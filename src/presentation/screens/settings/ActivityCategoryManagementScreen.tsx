/**
 * src/presentation/screens/settings/CategoryManagementScreen.tsx
 * Mục đích: Quản lý danh mục - thêm/sửa/xoá với chọn màu & icon Lucide (FR-04).
 * Dependency: useVocabularyStore, react-native-paper, LucideIcon, i18n.
 */
import React, {useState} from 'react';
import {FlatList, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  FAB,
  List,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {ICON_NAMES, LucideIcon} from '@presentation/components/LucideIcon';
import {Category} from '@domain/entities/Category';

import {SettingsScreenProps} from '@presentation/navigation/types';

const COLORS = [
  '#F2B5A0', '#5B8DEF', '#7BD0C1', '#E0A96E', '#9C8CEF',
  '#E07A6E', '#82C09A', '#F2C14E', '#6FB1FC', '#C58BF2',
];

export const ActivityCategoryManagementScreen: React.FC<
  SettingsScreenProps<'ActivityCategoryManagement'>
> = () => {
  const {t} = useTranslation();
  const theme = useTheme();

  const activityStore = useActivityStore();

  const categories = activityStore.categories;
  const addCategory = activityStore.addCategory;
  const updateCategory = activityStore.updateCategory;
  const deleteCategory = activityStore.deleteCategory;

  const language = useSettingsStore(s => s.settings.language);

  const [editing, setEditing] = useState<Category | null>(null);
  const [visible, setVisible] = useState(false);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICON_NAMES[0]);

  const open = (cat?: Category) => {
    setEditing(cat ?? null);
    setNameVi(cat?.nameVi ?? '');
    setNameEn(cat?.nameEn ?? '');
    setColor(cat?.color ?? COLORS[0]);
    setIcon(cat?.icon ?? ICON_NAMES[0]);
    setVisible(true);
  };

  const save = async () => {
    if (nameVi.trim().length === 0) {
      return;
    }
    const payload = {nameVi: nameVi.trim(), nameEn: nameEn.trim(), icon, color};
    if (editing) {
      await updateCategory(editing.id, payload);
    } else {
      await addCategory(payload);
    }
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 80}}
        data={categories}
        keyExtractor={i => String(i.id)}
        renderItem={({item}) => (
          <List.Item
            title={language === 'en' ? item.nameEn : item.nameVi}
            left={() => (
              <View style={[styles.swatch, {backgroundColor: item.color}]}>
                <LucideIcon name={item.icon} size={20} color="#fff" />
              </View>
            )}
            right={() => (
              <View style={styles.actions}>
                <Appbar.Action icon="pencil" onPress={() => open(item)} />
                <Appbar.Action
                  icon="delete"
                  onPress={() => deleteCategory(item.id)}
                />
              </View>
            )}
          />
        )}
      />

      <FAB icon="plus" style={styles.fab} onPress={() => open()} />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>
            {editing ? t('common.edit') : t('common.add')}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.dialogBody}>
              <TextInput
                mode="outlined"
                label={t('category.name')}
                value={nameVi}
                onChangeText={setNameVi}
              />
              <TextInput
                mode="outlined"
                label={t('vocabulary.nameEn')}
                value={nameEn}
                onChangeText={setNameEn}
                style={styles.field}
              />

              <Text variant="labelLarge" style={styles.label}>
                {t('category.color')}
              </Text>
              <View style={styles.row}>
                {COLORS.map(c => (
                  <Pressable
                    key={c}
                    onPress={() => setColor(c)}
                    style={[
                      styles.colorDot,
                      {backgroundColor: c},
                      color === c && {
                        borderWidth: 3,
                        borderColor: theme.colors.onSurface,
                      },
                    ]}
                  />
                ))}
              </View>

              <Text variant="labelLarge" style={styles.label}>
                Icon
              </Text>
              <View style={styles.row}>
                {ICON_NAMES.map(name => (
                  <Pressable
                    key={name}
                    onPress={() => setIcon(name)}
                    style={[
                      styles.iconBtn,
                      {
                        backgroundColor:
                          icon === name
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
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>
              {t('common.cancel')}
            </Button>
            <Button onPress={save}>{t('common.save')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  actions: {flexDirection: 'row'},
  fab: {position: 'absolute', right: 16, bottom: 16},
  dialogBody: {paddingVertical: 8},
  field: {marginTop: 8},
  label: {marginTop: 16, marginBottom: 8},
  row: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  colorDot: {width: 36, height: 36, borderRadius: 18},
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
