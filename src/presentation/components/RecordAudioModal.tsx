import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, Button, useTheme, IconButton } from 'react-native-paper';
import { Mic, Square, Play, Trash2, Check } from 'lucide-react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { Vocabulary } from '@domain/entities/Vocabulary';

interface Props {
  visible: boolean;
  vocabulary: Vocabulary | null;
  onDismiss: () => void;
  onSave: (vocabularyId: number, newAudioPath: string | null) => Promise<void>;
}

// Single instance for recording
const audioRecorderPlayer = new AudioRecorderPlayer();

export const RecordAudioModal: React.FC<Props> = ({ visible, vocabulary, onDismiss, onSave }) => {
  const theme = useTheme();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (visible && vocabulary) {
      setAudioPath(vocabulary.audioPath || null);
      setRecordTime('00:00');
    }
    return () => {
      // Cleanup on unmount/hide
      if (isRecording) {
        audioRecorderPlayer.stopRecorder().catch(() => {});
        audioRecorderPlayer.removeRecordBackListener();
      }
      if (isPlaying) {
        audioRecorderPlayer.stopPlayer().catch(() => {});
        audioRecorderPlayer.removePlayBackListener();
      }
    };
  }, [visible, vocabulary]);

  const startRecording = async () => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/custom_audio_${Date.now()}.m4a`;
      const result = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(formatTime(e.currentPosition));
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

  const handleSave = async (useDefault = false) => {
    if (!vocabulary) return;
    setSaving(true);
    try {
      const pathToSave = useDefault ? null : audioPath;
      await onSave(vocabulary.id, pathToSave);
      onDismiss();
    } catch (error) {
      console.error('Failed to save audio', error);
    } finally {
      setSaving(false);
    }
  };

  if (!vocabulary) return null;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleLarge" style={styles.title}>Cài đặt âm thanh</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Thẻ: {vocabulary.label()}</Text>

        <View style={[styles.recordContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          {audioPath ? (
            <View style={styles.playbackControls}>
              <Button
                mode="contained"
                icon={() => <Play size={20} color={theme.colors.onPrimary} />}
                onPress={playRecording}
                disabled={isPlaying || isRecording}
              >
                Nghe lại
              </Button>
              <IconButton
                icon={() => <Trash2 size={24} color={theme.colors.error} />}
                onPress={deleteRecording}
                disabled={isPlaying || isRecording}
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

        <View style={styles.actions}>
          <Button 
            mode="outlined" 
            onPress={() => handleSave(true)} 
            disabled={saving || isRecording}
            style={{ flex: 1 }}
          >
            Dùng giọng mặc định
          </Button>
          <Button 
            mode="contained" 
            icon={() => <Check size={20} color={theme.colors.onPrimary} />}
            onPress={() => handleSave(false)} 
            disabled={saving || isRecording || !audioPath}
            style={{ flex: 1 }}
          >
            Lưu
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  recordContainer: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
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
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  }
});
