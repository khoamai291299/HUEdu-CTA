/**
 * src/presentation/screens/settings/VocabularyEditScreen.tsx
 * Mục đích: Thêm/sửa từ vựng bằng react-hook-form (tên VI/EN, danh mục, hình ảnh) (FR-05).
 * Dependency: react-hook-form, react-native-image-picker, useVocabularyStore, i18n.
 * Dependency: react-hook-form, react-native-image-picker, i18n.
 */
import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Chip, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {SettingsScreenProps} from '@presentation/navigation/types';
import {translateText} from '@core/utils/translate';
import {ICON_NAMES, LucideIcon} from '@presentation/components/LucideIcon';

interface FormValues {
  nameVi: string;
  speechTextVi: string;
  categoryId: number | null;
  imagePath: string | null;
}

export const ActivityEditScreen: React.FC<
  SettingsScreenProps<'ActivityEdit'>
> = ({navigation, route}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const editingId = route.params?.id;

  const activityStore = useActivityStore();
  const language = useSettingsStore(s => s.settings.language);
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const existing = activityStore.activities.find(v => v.id === editingId);

  const {control, handleSubmit, setValue, watch} = useForm<FormValues>({
    defaultValues: {
      nameVi: existing?.nameVi ?? '',
      speechTextVi: existing?.speechTextVi ?? '',
      categoryId: existing?.categoryId ?? activityStore.categories[0]?.id ?? null,
      imagePath: existing?.imagePath ?? null,
    },
  });

  const imagePath = watch('imagePath');
  const categoryId = watch('categoryId');

  const pickImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.8});
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setValue('imagePath', uri);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setErrorMsg('');
    const trimmedNameVi = values.nameVi.trim();
    if (values.categoryId == null) {
      return;
    }

    // Kiểm tra trùng lặp
    const isDuplicate = activityStore.activities.some(
      v => v.nameVi.toLowerCase() === trimmedNameVi.toLowerCase() && v.id !== editingId
    );
    if (isDuplicate) {
      setErrorMsg('Hoạt động này đã tồn tại!');
      return;
    }

    setIsTranslating(true);
    let speechEn = '';
    let nameEn = '';
    
    const sourceForSpeech = values.speechTextVi.trim() || trimmedNameVi;

    try {
      nameEn = await translateText(trimmedNameVi, 'vi', 'en');
      if (sourceForSpeech) {
        speechEn = await translateText(sourceForSpeech, 'vi', 'en');
      }
    } catch (err) {
      // Bỏ qua lỗi dịch
    }
    
    setIsTranslating(false);

    const payload = {
      nameVi: trimmedNameVi,
      nameEn: nameEn || trimmedNameVi,
      speechTextVi: values.speechTextVi.trim() || null,
      speechTextEn: speechEn || null,
      categoryId: values.categoryId,
      imagePath: values.imagePath,
    };
    if (editingId) {
      await activityStore.updateActivity(editingId, payload);
    } else {
      await activityStore.addActivity(payload);
    }
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="nameVi"
        rules={{required: true, validate: v => v.trim().length > 0}}
        render={({field: {value, onChange}, fieldState}) => (
          <View>
            <TextInput
              mode="outlined"
              label="Tên hoạt động (Ví dụ: Uống nước)"
              value={value}
              onChangeText={onChange}
              error={!!fieldState.error || !!errorMsg}
            />
            <HelperText type="error" visible={!!fieldState.error || !!errorMsg}>
              {errorMsg || t('errors.VALIDATION')}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="speechTextVi"
        render={({field: {value, onChange}}) => (
          <TextInput
            mode="outlined"
            label="Thông tin hành động (Vd: Con muốn đi vệ sinh)"
            placeholder="Nội dung sẽ được phát âm bằng giọng nói"
            value={value}
            onChangeText={onChange}
            style={styles.field}
          />
        )}
      />

      <Text variant="labelLarge" style={styles.label}>
        Danh mục hoạt động
      </Text>
      <View style={styles.chips}>
        {activityStore.categories.map(c => {
          const isSelected = categoryId === c.id;
          return (
            <Chip
              key={c.id}
              selected={isSelected}
              onPress={() => setValue('categoryId', c.id)}
              style={[
                styles.chip,
                isSelected ? {backgroundColor: c.color} : {borderColor: c.color, borderWidth: 1, backgroundColor: theme.colors.surface}
              ]}
              textStyle={isSelected ? {color: '#fff', fontWeight: 'bold'} : {color: theme.colors.onSurface}}
              icon={() => (
                <LucideIcon name={c.icon} size={18} color={isSelected ? '#fff' : theme.colors.onSurface} />
              )}>
              {language === 'en' ? c.nameEn : c.nameVi}
            </Chip>
          );
        })}
      </View>

      <Text variant="labelLarge" style={styles.label}>
        {t('vocabulary.image')} hoặc Icon
      </Text>
      {imagePath?.startsWith('lucide:') ? (
        <View style={[styles.preview, {alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceVariant}]}>
          <LucideIcon name={imagePath.replace('lucide:', '')} size={64} color={theme.colors.onSurface} />
        </View>
      ) : imagePath ? (
        <Image source={{uri: imagePath}} style={styles.preview} />
      ) : null}
      <Button mode="outlined" icon="image" onPress={pickImage} style={styles.field}>
        {t('vocabulary.pickImage')}
      </Button>

      <Text variant="labelLarge" style={styles.label}>
        Icon (chọn thay cho ảnh)
      </Text>
      <View style={styles.row}>
        {ICON_NAMES.map(name => (
          <Pressable
            key={name}
            onPress={() => setValue('imagePath', 'lucide:' + name)}
            style={[
              styles.iconBtn,
              {
                backgroundColor:
                  imagePath === 'lucide:' + name
                    ? theme.colors.primaryContainer
                    : theme.colors.surfaceVariant,
              },
            ]}>
            <LucideIcon
              name={name}
              size={22}
              color={theme.colors.onSurface}
            />
          </Pressable>
        ))}
      </View>

      <Button
        mode="contained"
        disabled={isTranslating}
        onPress={handleSubmit(onSubmit)}
        style={styles.save}>
        {isTranslating ? 'Đang lưu & Dịch...' : t('common.save')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  field: {marginTop: 8},
  label: {marginTop: 16, marginBottom: 8},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {marginBottom: 4},
  preview: {width: 120, height: 120, borderRadius: 12, marginBottom: 8},
  save: {marginTop: 24, marginBottom: 40},
  row: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
