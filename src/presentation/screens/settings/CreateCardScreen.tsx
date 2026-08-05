import React, { useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Appbar, Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Camera, Image as ImageIcon, Mic, Square, Play, Trash2 } from 'lucide-react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const CreateCardScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [name, setName] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTake = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.6,
      maxWidth: 500,
      maxHeight: 500,
    });
    if (result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const handlePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.6,
      maxWidth: 500,
      maxHeight: 500,
    });
    if (result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const startRecording = async () => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/custom_card_${Date.now()}.m4a`;
      const result = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      setIsRecording(true);
      setAudioPath(result);
    } catch (e) {
      console.warn('Start recording failed', e);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
    } catch (e) {
      console.warn('Stop recording failed', e);
    }
  };

  const playRecording = async () => {
    if (!audioPath) return;
    try {
      setIsPlaying(true);
      await audioRecorderPlayer.startPlayer(audioPath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.warn('Play recording failed', e);
      setIsPlaying(false);
    }
  };
  
  const deleteRecording = () => {
    setAudioPath(null);
    setRecordTime('00:00');
  };

  const handleSave = () => {
    // 1. Move photo and audio to permanent app storage if necessary
    // 2. Insert to database via repository
    // Since this is a demo, we will just log and go back
    console.log('Saved Custom Card:', { photo, name, audioPath });
    navigation.goBack();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map(i => (
        <React.Fragment key={i}>
          <View style={[
            styles.stepCircle,
            { backgroundColor: step >= i ? theme.colors.primary : theme.colors.surfaceVariant }
          ]}>
            <Text style={{ color: step >= i ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }}>{i}</Text>
          </View>
          {i < 3 && <View style={[
            styles.stepLine,
            { backgroundColor: step > i ? theme.colors.primary : theme.colors.surfaceVariant }
          ]} />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Tạo thẻ mới" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {renderStepIndicator()}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text variant="titleLarge" style={styles.title}>Bước 1: Chọn hình ảnh</Text>
            
            <View style={styles.photoContainer}>
              {photo ? (
                <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <ImageIcon size={48} color={theme.colors.onSurfaceVariant} opacity={0.5} />
                </View>
              )}
            </View>

            <View style={styles.actionRow}>
              <Button mode="outlined" icon={() => <Camera size={20} color={theme.colors.primary} />} onPress={handleTake}>
                Chụp ảnh
              </Button>
              <Button mode="outlined" icon={() => <ImageIcon size={20} color={theme.colors.primary} />} onPress={handlePick}>
                Thư viện
              </Button>
            </View>

            <Button mode="contained" onPress={() => setStep(2)} disabled={!photo} style={styles.nextBtn}>
              Tiếp tục
            </Button>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text variant="titleLarge" style={styles.title}>Bước 2: Đặt tên thẻ</Text>
            
            <TextInput
              label="Tên từ vựng (Tiếng Việt)"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.actionRowSpace}>
              <Button mode="text" onPress={() => setStep(1)}>Quay lại</Button>
              <Button mode="contained" onPress={() => setStep(3)} disabled={!name.trim()}>
                Tiếp tục
              </Button>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text variant="titleLarge" style={styles.title}>Bước 3: Ghi âm giọng đọc</Text>
            
            <View style={[styles.recordContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              {audioPath ? (
                <View style={styles.playbackControls}>
                  <Button
                    mode="contained"
                    icon={() => <Play size={20} color={theme.colors.onPrimary} />}
                    onPress={playRecording}
                    disabled={isPlaying}
                  >
                    Nghe lại
                  </Button>
                  <IconButton
                    icon={() => <Trash2 size={24} color={theme.colors.error} />}
                    onPress={deleteRecording}
                  />
                </View>
              ) : (
                <>
                  <Text variant="displayMedium" style={styles.time}>{recordTime}</Text>
                  
                  {isRecording ? (
                    <TouchableOpacity
                      style={[styles.recordBtn, { backgroundColor: theme.colors.error }]}
                      onPress={stopRecording}
                    >
                      <Square size={32} color="white" fill="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.recordBtn, { backgroundColor: theme.colors.primary }]}
                      onPress={startRecording}
                    >
                      <Mic size={32} color="white" />
                    </TouchableOpacity>
                  )}
                  <Text variant="bodyMedium" style={{ marginTop: 16 }}>
                    {isRecording ? 'Đang ghi âm...' : 'Nhấn để bắt đầu ghi âm'}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.actionRowSpace}>
              <Button mode="text" onPress={() => setStep(2)}>Quay lại</Button>
              <Button mode="contained" onPress={handleSave} disabled={!audioPath}>
                Hoàn tất & Lưu thẻ
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  stepLine: {
    width: 40, height: 4,
    marginHorizontal: 8,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePreview: {
    width: 200, height: 200, borderRadius: 16,
  },
  imagePlaceholder: {
    width: 200, height: 200, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  actionRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  nextBtn: {
    marginTop: 16,
  },
  input: {
    marginBottom: 24,
  },
  recordContainer: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  time: {
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
  },
  recordBtn: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  }
});
