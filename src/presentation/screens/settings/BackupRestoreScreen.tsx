/**
 * src/presentation/screens/settings/BackupRestoreScreen.tsx
 * Mục đích: Sao lưu (xuất file JSON + chia sẻ) và khôi phục (dán JSON, có xác nhận) (FR-15).
 * Dependency: Backup use cases, services DI, react-native Share, react-native-fs,
 *             react-native-paper, i18n, các store (tải lại sau khi khôi phục).
 */
import React, {useState} from 'react';
import {Share, StyleSheet, View} from 'react-native';
import RNFS from 'react-native-fs';
import {
  Button,
  Card,
  Dialog,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {
  ExportBackupUseCase,
  ImportBackupUseCase,
} from '@domain/usecases/backup/BackupUseCases';
import {getBackup} from '@presentation/di/services';
import {useVocabularyStore} from '@presentation/stores/useVocabularyStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {logger} from '@core/utils/logger';

export const BackupRestoreScreen: React.FC = () => {
  const {t} = useTranslation();
  const [snack, setSnack] = useState<string | null>(null);
  const [importVisible, setImportVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [json, setJson] = useState('');

  const doExport = async () => {
    try {
      const path = await new ExportBackupUseCase(getBackup()).execute();
      await Share.share({url: `file://${path}`, message: path});
      setSnack(t('backup.exportSuccess'));
    } catch (e) {
      logger.error('[Backup] export failed', e);
      setSnack(t('errors.BACKUP'));
    }
  };

  const loadFromFilePrompt = async () => {
    // Gợi ý: đọc file backup gần nhất trong thư mục tài liệu (nếu có) để dán sẵn.
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const backups = files
        .filter(f => f.name.startsWith('huedu-cta-backup-'))
        .sort((a, b) => b.name.localeCompare(a.name));
      if (backups.length > 0) {
        const content = await RNFS.readFile(backups[0].path, 'utf8');
        setJson(content);
      }
    } catch (e) {
      logger.warn('[Backup] read dir failed', e);
    }
    setImportVisible(true);
  };

  const doImport = async () => {
    try {
      await new ImportBackupUseCase(getBackup()).execute(json);
      await useVocabularyStore.getState().load();
      await useChildStore.getState().load();
      await useChildStore.getState().ensureActive();
      const activeId = useSettingsStore.getState().settings.activeChildId;
      if (activeId != null) {
        await useVocabularyStore.getState().loadFavorites(activeId);
      }
      setSnack(t('backup.importSuccess'));
    } catch (e) {
      logger.error('[Backup] import failed', e);
      setSnack(t('errors.BACKUP'));
    } finally {
      setConfirmVisible(false);
      setImportVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{t('backup.export')}</Text>
          <Button mode="contained" icon="export" onPress={doExport} style={styles.btn}>
            {t('backup.export')}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{t('backup.import')}</Text>
          <Button
            mode="outlined"
            icon="import"
            onPress={loadFromFilePrompt}
            style={styles.btn}>
            {t('backup.import')}
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={importVisible} onDismiss={() => setImportVisible(false)}>
          <Dialog.Title>{t('backup.import')}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              placeholder="JSON..."
              value={json}
              onChangeText={setJson}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setImportVisible(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              disabled={json.trim().length === 0}
              onPress={() => setConfirmVisible(true)}>
              {t('common.confirm')}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={confirmVisible} onDismiss={() => setConfirmVisible(false)}>
          <Dialog.Title>{t('backup.import')}</Dialog.Title>
          <Dialog.Content>
            <Text>{t('backup.importConfirm')}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmVisible(false)}>
              {t('common.cancel')}
            </Button>
            <Button onPress={doImport}>{t('common.confirm')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={snack != null} onDismiss={() => setSnack(null)}>
        {snack ?? ''}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 12},
  card: {marginBottom: 12},
  btn: {marginTop: 12},
});
