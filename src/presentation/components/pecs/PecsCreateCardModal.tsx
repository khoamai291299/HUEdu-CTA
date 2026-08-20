/**
 * src/presentation/components/pecs/PecsCreateCardModal.tsx
 * Mục đích: "Thêm thẻ mới" — chụp ảnh/chọn ảnh món đồ THỰC TẾ của bé, đặt tên,
 *           và (tuỳ chọn) tự ghi âm giọng ba mẹ. Đây là tính năng bắt buộc theo
 *           tài liệu vì trẻ tự kỷ thường gắn bó với đồ vật rất cụ thể.
 * Dependency: image-picker, AudioRecorderField, saveMediaFile, useActivityStore.
 */
import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {Camera, Image as ImageIcon} from 'lucide-react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AudioRecorderField} from '../AudioRecorderField';
import {saveMediaFile} from '@core/utils/saveMediaFile';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {PECS_CATEGORY_KEY} from '@core/constants';
import {logger} from '@core/utils/logger';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  /** Gọi lại với id thẻ vừa tạo để màn cha tự động chọn thẻ đó. */
  onCreated: (cardId: number) => void;
}

export const PecsCreateCardModal: React.FC<Props> = ({
  visible,
  onDismiss,
  onCreated,
}) => {
  const theme = useTheme();
  const addActivity = useActivityStore(s => s.addActivity);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setPhotoUri(null);
    setName('');
    setAudioPath(null);
    setSaving(false);
    setError(null);
  };

  const handleDismiss = () => {
    reset();
    onDismiss();
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.6 as const,
      maxWidth: 800,
      maxHeight: 800,
    };
    try {
      const result =
        source === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);
      const uri = result.assets?.[0]?.uri;
      if (uri) {
        setPhotoUri(uri);
        setError(null);
      }
    } catch (e) {
      logger.warn('[PecsCreateCardModal] pick image failed', e);
      setError('Không mở được máy ảnh/thư viện ảnh.');
    }
  };

  const handleSave = async () => {
    if (!photoUri || !name.trim()) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // Copy ảnh & âm thanh về thư mục vĩnh viễn để không mất khi OS dọn cache.
      const savedImage = await saveMediaFile(photoUri, 'img', 'jpg');
      const savedAudio = audioPath
        ? await saveMediaFile(audioPath, 'audio', 'aac')
        : null;

      const trimmed = name.trim();
      await addActivity({
        nameVi: trimmed,
        imagePath: savedImage,
        speechTextVi: trimmed,
        categoryKey: PECS_CATEGORY_KEY,
        isDefault: false,
        isCustom: true,
        audioPath: savedAudio,
        sortOrder: 999,
      });

      // addActivity đã reload store — tìm lại thẻ vừa tạo (mới nhất trùng tên).
      const created = useActivityStore
        .getState()
        .activities.filter(a => a.nameVi === trimmed)
        .sort((a, b) => b.id - a.id)[0];

      if (created) {
        onCreated(created.id);
      }
      reset();
      onDismiss();
    } catch (e) {
      logger.warn('[PecsCreateCardModal] save failed', e);
      setError('Lưu thẻ thất bại. Ba mẹ thử lại giúp nhé.');
      setSaving(false);
    }
  };

  const canSave = !!photoUri && !!name.trim() && !saving;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modal,
          {backgroundColor: theme.colors.background},
        ]}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text variant="headlineSmall" style={styles.title}>
            Thêm thẻ của riêng bé
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
            Chụp đúng món đồ thật của bé (ví dụ: chiếc cốc xanh có hình siêu
            nhân) để bé nhận ra ngay.
          </Text>

          <View style={styles.photoWrap}>
            {photoUri ? (
              <Image source={{uri: photoUri}} style={styles.preview} />
            ) : (
              <View
                style={[
                  styles.placeholder,
                  {backgroundColor: theme.colors.surfaceVariant},
                ]}>
                <ImageIcon
                  size={44}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            <Button
              mode="contained-tonal"
              icon={() => <Camera size={20} color={theme.colors.primary} />}
              onPress={() => pickImage('camera')}>
              Chụp ảnh
            </Button>
            <Button
              mode="contained-tonal"
              icon={() => <ImageIcon size={20} color={theme.colors.primary} />}
              onPress={() => pickImage('library')}>
              Thư viện
            </Button>
          </View>

          <TextInput
            mode="outlined"
            label="Tên món đồ (bé sẽ nghe tên này)"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text variant="titleSmall" style={styles.sectionLabel}>
            Ghi âm giọng ba mẹ (không bắt buộc)
          </Text>
          <Text
            variant="bodySmall"
            style={{color: theme.colors.onSurfaceVariant}}>
            Nếu bỏ trống, ứng dụng sẽ dùng giọng đọc đã chọn để đọc tên thẻ.
          </Text>
          <AudioRecorderField audioPath={audioPath} onChange={setAudioPath} />

          {error ? (
            <Text style={{color: theme.colors.error, marginTop: 8}}>
              {error}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <Button onPress={handleDismiss} disabled={saving}>
              Huỷ
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!canSave}
              loading={saving}>
              Lưu thẻ
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 24,
    maxHeight: '90%',
  },
  title: {fontWeight: '800', textAlign: 'center'},
  subtitle: {textAlign: 'center', marginTop: 6, marginBottom: 16},
  photoWrap: {alignItems: 'center', marginBottom: 16},
  preview: {width: 160, height: 160, borderRadius: 20},
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  input: {marginBottom: 16},
  sectionLabel: {fontWeight: '700', marginBottom: 2},
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
});
