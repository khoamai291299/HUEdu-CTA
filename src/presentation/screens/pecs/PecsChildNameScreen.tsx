/**
 * src/presentation/screens/pecs/PecsChildNameScreen.tsx
 * Mục đích: Bước 1/9 "Thông tin bé" — lời chào đồng cảm + nhập tên bé.
 *           Tên này được dùng lại ở mọi bước sau ("Màu sắc yêu thích [tên] là gì?").
 * Dependency: PecsProgressBar, useOnboardingStore.
 */
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';

export const PecsChildNameScreen: React.FC<
  PecsScreenProps<'PecsChildName'>
> = ({navigation}) => {
  const theme = useTheme();
  const {username, setUsername} = useOnboardingStore();
  const settings = useSettingsStore(s => s.settings);
  const activeChild = useChildStore(s =>
    s.children.find(c => c.id === settings.activeChildId),
  );

  // Store onboarding không lưu bền qua các lần mở app. Khi ba mẹ CHẠY LẠI thiết
  // lập, nạp lại tên/màu/giọng đang dùng để wizard không bắt đầu từ trống trơn.
  React.useEffect(() => {
    if (!settings.isOnboarded) {
      return;
    }
    const store = useOnboardingStore.getState();
    if (!store.username && activeChild?.name) {
      store.setUsername(activeChild.name);
      setName(activeChild.name);
    }
    if (activeChild?.skinTone) {
      store.setSkinTone(activeChild.skinTone);
    }
    if (settings.theme) {
      store.setThemeColor(settings.theme);
    }
    if (settings.speech.voiceId) {
      store.setVoiceId(settings.speech.voiceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.isOnboarded, activeChild?.id]);

  const [name, setName] = useState(username);

  const handleNext = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setUsername(trimmed);
    navigation.navigate('PecsThemeColor');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={1} label="Thông tin bé" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View
            style={[
              styles.banner,
              {backgroundColor: theme.colors.primaryContainer},
            ]}>
            <Text variant="titleMedium" style={styles.bannerText}>
              💛 Chỉ mất 2 phút để tạo ra không gian giao tiếp an toàn nhất cho
              bé.
            </Text>
          </View>

          <Text variant="headlineMedium" style={styles.title}>
            Chào mừng ba mẹ đến với HUEdu-CTA
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
            Hãy cho chúng tôi biết tên của bé nhé!
          </Text>

          <TextInput
            mode="outlined"
            label="Tên trẻ"
            value={name}
            onChangeText={setName}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={handleNext}
            autoFocus
          />

          <View style={styles.actions}>
            <Button
              mode="contained"
              disabled={!name.trim()}
              onPress={handleNext}>
              Tiếp theo
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  flex: {flex: 1},
  content: {paddingHorizontal: 20, paddingBottom: 24},
  banner: {borderRadius: 14, padding: 14, marginBottom: 24},
  bannerText: {fontStyle: 'italic', textAlign: 'center', fontWeight: '600'},
  title: {fontWeight: '800', textAlign: 'center', marginBottom: 8},
  subtitle: {textAlign: 'center', marginBottom: 28},
  input: {marginBottom: 20},
  actions: {alignItems: 'flex-end'},
});
