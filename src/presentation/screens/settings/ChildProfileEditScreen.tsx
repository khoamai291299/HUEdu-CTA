/**
 * src/presentation/screens/settings/ChildProfileEditScreen.tsx
 * Mục đích: Thêm/sửa hồ sơ trẻ (tên + ảnh đại diện) bằng react-hook-form (FR-10).
 * Dependency: react-hook-form, react-native-image-picker, useChildStore, i18n.
 */
import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Button, HelperText, TextInput} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {useChildStore} from '@presentation/stores/useChildStore';
import {SettingsScreenProps} from '@presentation/navigation/types';

interface FormValues {
  name: string;
  avatarPath: string | null;
}

export const ChildProfileEditScreen: React.FC<
  SettingsScreenProps<'ChildProfileEdit'>
> = ({navigation, route}) => {
  const {t} = useTranslation();
  const editingId = route.params?.id;
  const children = useChildStore(s => s.children);
  const add = useChildStore(s => s.add);
  const update = useChildStore(s => s.update);
  const existing = children.find(c => c.id === editingId);

  const {control, handleSubmit, setValue, watch} = useForm<FormValues>({
    defaultValues: {
      name: existing?.name ?? '',
      avatarPath: existing?.avatarPath ?? null,
    },
  });
  const avatarPath = watch('avatarPath');

  const pickAvatar = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.8});
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setValue('avatarPath', uri);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {name: values.name.trim(), avatarPath: values.avatarPath};
    if (editingId) {
      await update(editingId, payload);
    } else {
      await add(payload);
    }
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarRow}>
        {avatarPath ? (
          <Image source={{uri: avatarPath}} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={96} icon="account" />
        )}
      </View>
      <Button mode="outlined" icon="image" onPress={pickAvatar}>
        {t('profiles.avatar')}
      </Button>

      <Controller
        control={control}
        name="name"
        rules={{required: true, validate: v => v.trim().length > 0}}
        render={({field: {value, onChange}, fieldState}) => (
          <View style={styles.field}>
            <TextInput
              mode="outlined"
              label={t('profiles.name')}
              value={value}
              onChangeText={onChange}
            />
            <HelperText type="error" visible={!!fieldState.error}>
              {t('errors.VALIDATION')}
            </HelperText>
          </View>
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.save}>
        {t('common.save')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  avatarRow: {alignItems: 'center', marginBottom: 16},
  avatar: {width: 96, height: 96, borderRadius: 48},
  field: {marginTop: 16},
  save: {marginTop: 24},
});
