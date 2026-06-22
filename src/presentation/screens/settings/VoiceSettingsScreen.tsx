/**
 * src/presentation/screens/settings/VoiceSettingsScreen.tsx
 * Mục đích: Chọn giọng đọc TTS; cảnh báo nếu thiếu giọng tiếng Việt (FR-12, rủi ro R4).
 * Dependency: services DI (TTS), useSettingsStore, react-native-paper, i18n.
 */
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Banner, List, RadioButton} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {getTts} from '@presentation/di/services';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {TtsVoice} from '@domain/services/ITtsService';
import {LoadingView} from '@presentation/components/StatusView';

export const VoiceSettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const voiceId = useSettingsStore(s => s.settings.speech.voiceId);
  const setVoice = useSettingsStore(s => s.setVoice);
  const [voices, setVoices] = useState<TtsVoice[] | null>(null);
  const [hasVi, setHasVi] = useState(true);

  useEffect(() => {
    const load = async () => {
      const tts = getTts();
      const list = await tts.getVoices();
      setVoices(list);
      setHasVi(await tts.hasVoiceForLanguage('vi'));
    };
    load();
  }, []);

  if (!voices) {
    return <LoadingView />;
  }

  const getVoiceDescription = (item: TtsVoice) => {
    const nameLow = item.name.toLowerCase();
    
    if (nameLow.includes('vi-vn-x-vic')) return 'Giọng Nữ cao (Miền Bắc) - Rõ ràng, truyền cảm';
    if (nameLow.includes('vi-vn-x-vid')) return 'Giọng Nữ trung (Miền Nam) - Nhẹ nhàng, dễ thương';
    if (nameLow.includes('vi-vn-x-vie')) return 'Giọng Nam trung (Miền Nam) - Trầm ấm, chậm rãi';
    if (nameLow.includes('vi-vn-x-vif')) return 'Giọng Nam cao (Miền Bắc) - Dứt khoát, mạnh mẽ';
    if (nameLow.includes('vi-vn-x-via')) return 'Giọng Nữ trung (Tiêu chuẩn)';
    if (nameLow.includes('samsung') && nameLow.includes('female')) return 'Giọng Nữ (Samsung) - Trong trẻo, tự nhiên';
    if (nameLow.includes('samsung') && nameLow.includes('male')) return 'Giọng Nam (Samsung) - Vang, rõ chữ';

    // Fallback heuristic for others
    let desc = item.language;
    let gender = '';
    if (nameLow.includes('female') || nameLow.includes('f0') || nameLow.includes('-a') || nameLow.includes('-c')) {
      gender = 'Nữ';
    } else if (nameLow.includes('male') || nameLow.includes('m0') || nameLow.includes('-b') || nameLow.includes('-d') || nameLow.includes('-e') || nameLow.includes('-f')) {
      gender = 'Nam';
    }

    if (gender) desc += ` · ${gender}`;
    return desc;
  };

  return (
    <View style={styles.container}>
      {!hasVi ? (
        <Banner visible icon="alert">
          {t('errors.noVoice')}
        </Banner>
      ) : null}
      <FlatList
        data={voices}
        keyExtractor={v => v.id}
        renderItem={({item}) => (
          <List.Item
            title={item.name}
            description={getVoiceDescription(item)}
            onPress={() => setVoice(item.id)}
            right={() => (
              <RadioButton
                value={item.id}
                status={voiceId === item.id ? 'checked' : 'unchecked'}
                onPress={() => setVoice(item.id)}
              />
            )}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1}});
