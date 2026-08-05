/**
 * src/presentation/screens/settings/VocabularyEditScreen.tsx
 * Mục đích: Thêm/sửa từ vựng bằng react-hook-form (tên VI/EN, danh mục, hình ảnh) (FR-05).
 * Dependency: react-hook-form, react-native-image-picker, useVocabularyStore, i18n.
 */
import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';

import {SettingsScreenProps} from '@presentation/navigation/types';
import {ICON_NAMES, LucideIcon} from '@presentation/components/LucideIcon';
import {ArasaacImage} from '@presentation/components/ArasaacImage';
import {ArasaacPickerModal} from '@presentation/components/ArasaacPickerModal';
import {saveMediaFile} from '@core/utils/saveMediaFile';

interface FormValues {
  nameVi: string;

  imagePath: string | null;
}

export const VocabularyEditScreen: React.FC<
  SettingsScreenProps<'VocabularyEdit'>
> = ({navigation, route}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const editingId = route.params?.id;

  const vocabStore = useVocabularyStore();

  const [errorMsg, setErrorMsg] = useState('');

  const existing = vocabStore.vocabulary.find(v => v.id === editingId);

  const {control, handleSubmit, setValue, watch} = useForm<FormValues>({
    defaultValues: {
      nameVi: existing?.nameVi ?? '',

      imagePath: existing?.imagePath ?? null,
    },
  });

  const imagePath = watch('imagePath');


  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.6,
      maxWidth: 500,
      maxHeight: 500,
    });
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setValue('imagePath', uri);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setErrorMsg('');
    const trimmedNameVi = values.nameVi.trim();


    // Kiểm tra trùng lặp
    const isDuplicate = vocabStore.vocabulary.some(
      v => v.nameVi.toLowerCase() === trimmedNameVi.toLowerCase() && v.id !== editingId
    );
    if (isDuplicate) {
      setErrorMsg('Từ vựng này đã tồn tại!');
      return;
    }

    // Copy file về DocumentDirectory để đảm bảo không bị mất
    const persistedImage = values.imagePath
      ? await saveMediaFile(values.imagePath, 'img', 'jpg').catch(() => values.imagePath)
      : null;

    const payload = {
      nameVi: trimmedNameVi,
      speechTextVi: null,
      imagePath: persistedImage,
    };
    if (editingId) {
      await vocabStore.updateVocabulary(editingId, payload);
    } else {
      await vocabStore.addVocabulary(payload);
    }
    navigation.goBack();
  };

  const [showArasaac, setShowArasaac] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="nameVi"
        rules={{required: true, validate: v => v.trim().length > 0}}
        render={({field: {value, onChange}, fieldState}) => (
          <View>
            <TextInput
              mode="outlined"
              label="Tên từ vựng (Ví dụ: Quả cam)"
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



      <Text variant="labelLarge" style={styles.label}>
        {t('vocabulary.image')} hoặc Icon
      </Text>
      {imagePath?.startsWith('lucide:') ? (
        <View style={[styles.preview, {alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceVariant}]}>
          <LucideIcon name={imagePath.replace('lucide:', '')} size={64} color={theme.colors.onSurface} />
        </View>
      ) : imagePath ? (
        <Image source={{uri: imagePath}} style={styles.preview} />
      ) : watch('nameVi').trim().length > 0 ? (
        <View style={[styles.preview, {alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceVariant, overflow: 'hidden'}]}>
          <ArasaacImage keyword={watch('nameVi').trim()} size={80} />
          <Text variant="bodySmall" style={{marginTop: 4, opacity: 0.7}}>ARASAAC Auto</Text>
        </View>
      ) : null}

      <View style={{flexDirection: 'row', gap: 12, marginTop: 8}}>
        <Button mode="outlined" icon="image-search" onPress={() => setShowArasaac(true)} style={{flex: 1}}>
          ARASAAC
        </Button>
        <Button mode="outlined" icon="image" onPress={pickImage} style={{flex: 1}}>
          {t('vocabulary.pickImage') || 'Thư viện'}
        </Button>
      </View>

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
        onPress={handleSubmit(onSubmit)}
        style={styles.save}>
        {t('common.save')}
      </Button>

      <ArasaacPickerModal
        visible={showArasaac}
        onDismiss={() => setShowArasaac(false)}
        onSelect={(url) => {
          setValue('imagePath', url);
          setShowArasaac(false);
        }}
      />
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
