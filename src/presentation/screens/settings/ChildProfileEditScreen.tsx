/**
 * src/presentation/screens/settings/ChildProfileEditScreen.tsx
 * Mục đích: Thêm/sửa hồ sơ trẻ (tên + ảnh đại diện + màu da nhân vật) bằng react-hook-form (FR-10).
 *           Màu da điều khiển nhân vật que hiển thị ở bảng giao tiếp.
 * Dependency: react-hook-form, react-native-image-picker, useChildStore, i18n.
 */
import React from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {useChildStore} from '@presentation/stores/useChildStore';
import {SettingsScreenProps} from '@presentation/navigation/types';
import {saveMediaFile} from '@core/utils/saveMediaFile';
import {StickFigure} from '@presentation/components/StickFigure';

interface FormValues {
  name: string;
  avatarPath: string | null;
  skinTone: string;
}

/** Cùng bảng màu với bảng giao tiếp (DirectCommunicationBoardScreen). */
const TONES: Array<{id: string; color: string}> = [
  {id: 'tone0', color: '#FFFFFF'}, {id: 'tone1', color: '#FFF5EE'},
  {id: 'tone2', color: '#FFDFC4'}, {id: 'tone3', color: '#F7D5B8'},
  {id: 'tone4', color: '#F0D5BE'}, {id: 'tone5', color: '#E8C4A0'},
  {id: 'tone6', color: '#DEB887'}, {id: 'tone7', color: '#D2996C'},
  {id: 'tone8', color: '#C68642'}, {id: 'tone9', color: '#B87333'},
  {id: 'tone10', color: '#AB724B'}, {id: 'tone11', color: '#96613D'},
  {id: 'tone12', color: '#8D5524'}, {id: 'tone13', color: '#7B4B2A'},
  {id: 'tone14', color: '#5C3A1E'},
];

export const ChildProfileEditScreen: React.FC<
  SettingsScreenProps<'ChildProfileEdit'>
> = ({navigation, route}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const editingId = route.params?.id;
  const children = useChildStore(s => s.children);
  const add = useChildStore(s => s.add);
  const update = useChildStore(s => s.update);
  const existing = children.find(c => c.id === editingId);

  const {control, handleSubmit, setValue, watch} = useForm<FormValues>({
    defaultValues: {
      name: existing?.name ?? '',
      avatarPath: existing?.avatarPath ?? null,
      skinTone: existing?.skinTone ?? 'tone2',
    },
  });
  const avatarPath = watch('avatarPath');
  const skinTone = watch('skinTone');
  const skinColor = TONES.find(x => x.id === skinTone)?.color ?? '#FFDFC4';

  const pickAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.6,
      maxWidth: 400,
      maxHeight: 400,
    });
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setValue('avatarPath', uri);
    }
  };

  const onSubmit = async (values: FormValues) => {
    // Nén và lưu ảnh vĩnh viễn
    const persistedAvatar = values.avatarPath
      ? await saveMediaFile(values.avatarPath, 'img', 'jpg').catch(() => values.avatarPath)
      : null;

    const payload = {
      name: values.name.trim(),
      avatarPath: persistedAvatar,
      skinTone: values.skinTone,
    };
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

      <View style={styles.field}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Màu da của nhân vật
        </Text>
        <View style={styles.figureWrap}>
          <StickFigure faceColor={skinColor} />
        </View>
        <View style={styles.toneGrid}>
          {TONES.map(tone => (
            <Pressable
              key={tone.id}
              accessibilityRole="radio"
              accessibilityState={{selected: skinTone === tone.id}}
              onPress={() => setValue('skinTone', tone.id)}
              style={[
                styles.toneSwatch,
                {
                  backgroundColor: tone.color,
                  borderColor:
                    skinTone === tone.id ? theme.colors.primary : '#E0E0E0',
                  borderWidth: skinTone === tone.id ? 4 : 1,
                },
              ]}
            />
          ))}
        </View>
      </View>

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
  sectionTitle: {fontWeight: '700', marginBottom: 12},
  figureWrap: {alignItems: 'center', marginBottom: 16},
  toneGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center'},
  toneSwatch: {width: 52, height: 52, borderRadius: 12},
  save: {marginTop: 24},
});
