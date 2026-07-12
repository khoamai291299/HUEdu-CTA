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
import {VBEE_VOICES} from '@core/config/vbeeConfig';

export const VoiceSettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const voiceId = useSettingsStore(s => s.settings.speech.voiceId);
  const setVoice = useSettingsStore(s => s.setVoice);
  /** voices: khởi tạo sẵn từ VBEE_VOICES để list hiện ngay, không chờ async. */
  const [voices, setVoices] = useState<TtsVoice[]>(
    VBEE_VOICES.map(v => ({id: v.id, name: v.label, language: 'vi-VN'})),
  );
  const [hasVi, setHasVi] = useState(true);
  /** selectedId: cập nhật tức thì khi bấm (optimistic), không chờ DB write xong. */
  const [selectedId, setSelectedId] = useState<string | null>(voiceId);

  useEffect(() => {
    const load = async () => {
      const tts = getTts();
      const list = await tts.getVoices();
      setVoices(list);
      setHasVi(await tts.hasVoiceForLanguage('vi'));
    };
    load();
  }, []);

  // Đồng bộ selectedId nếu voiceId trong store thay đổi từ bên ngoài.
  useEffect(() => {
    setSelectedId(voiceId);
  }, [voiceId]);

  /** Chọn giọng: cập nhật UI tức thì, lưu DB trong nền. */
  const handleSelectVoice = (id: string) => {
    setSelectedId(id);
    setVoice(id);
  };


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
            onPress={() => handleSelectVoice(item.id)}
            right={() => (
              <RadioButton
                value={item.id}
                status={selectedId === item.id ? 'checked' : 'unchecked'}
                onPress={() => handleSelectVoice(item.id)}
              />
            )}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1}});
