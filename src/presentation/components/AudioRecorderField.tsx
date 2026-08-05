import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, IconButton } from 'react-native-paper';
import { Mic, Square, Play, Trash2, RotateCcw } from 'lucide-react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

interface Props {
  audioPath: string | null;
  onChange: (path: string | null) => void;
}

const audioRecorderPlayer = new AudioRecorderPlayer();

export const AudioRecorderField: React.FC<Props> = ({ audioPath, onChange }) => {
  const theme = useTheme();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        audioRecorderPlayer.stopRecorder().catch(() => {});
        audioRecorderPlayer.removeRecordBackListener();
      }
      if (isPlaying) {
        audioRecorderPlayer.stopPlayer().catch(() => {});
        audioRecorderPlayer.removePlayBackListener();
      }
    };
  }, [isRecording, isPlaying]);

  const startRecording = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.warn('Microphone permission not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    
    try {
      const path = `${RNFS.DocumentDirectoryPath}/custom_audio_${Date.now()}.aac`;
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
      };
      const result = await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(formatTime(e.currentPosition));
      });
      setIsRecording(true);
    } catch (e) {
      console.warn('Start recording failed', e);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      onChange(result);
    } catch (e) {
      console.warn('Stop recording failed', e);
    }
  };

  const playRecording = async () => {
    if (!audioPath) return;
    if (isPlaying) {
      try {
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
      } catch (e) {
        console.warn('Stop player failed', e);
      }
      setIsPlaying(false);
      return;
    }
    try {
      setIsPlaying(true);
      await audioRecorderPlayer.startPlayer(audioPath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
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
    onChange(null);
    setRecordTime('00:00');
  };

  return (
    <View style={[styles.recordContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
      {audioPath ? (
        <View style={styles.playbackControls}>
          <Button
            mode="contained"
            icon={() => <Play size={20} color={theme.colors.onPrimary} />}
            onPress={playRecording}
            disabled={isRecording}
          >
            {isPlaying ? 'Dừng nghe' : 'Nghe lại'}
          </Button>
          <IconButton
            icon={() => <RotateCcw size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={deleteRecording}
            disabled={isRecording}
          />
          <IconButton
            icon={() => <Trash2 size={24} color={theme.colors.error} />}
            onPress={deleteRecording}
            disabled={isRecording}
          />
        </View>
      ) : (
        <View style={styles.recordRow}>
          <Text variant="titleLarge" style={styles.time}>{recordTime}</Text>
          
          <Text variant="bodyMedium" style={{ flex: 1, paddingHorizontal: 16 }}>
            {isRecording ? 'Đang ghi âm...' : 'Nhấn thu âm'}
          </Text>

          {isRecording ? (
            <TouchableOpacity
              style={[styles.recordBtn, { backgroundColor: theme.colors.error }]}
              onPress={stopRecording}
            >
              <Square size={24} color="white" fill="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.recordBtn, { backgroundColor: theme.colors.primary }]}
              onPress={startRecording}
            >
              <Mic size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recordContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  time: {
    fontVariant: ['tabular-nums'],
    width: 60,
  },
  recordBtn: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  }
});
