/**
 * src/presentation/screens/pecs/PecsHandoffScreen.tsx
 * Mục đích: Bước 9/9 "Hoàn tất & Chuyển giao" — hướng dẫn dành riêng cho người lớn
 *           trước khi đưa máy cho bé, nhấn mạnh quy luật nhân quả (máy phát âm ->
 *           đưa món đồ thật NGAY LẬP TỨC) + mẹo Ghim ứng dụng.
 *
 *           Đây cũng là nơi CHỐT toàn bộ luồng thiết lập: tạo/cập nhật hồ sơ trẻ,
 *           ghi màu giao diện & giọng đọc vào settings, đánh dấu đã onboarding.
 * Dependency: PecsProgressBar, PecsCardFace, usePecsStore, useChildStore, useSettingsStore.
 */
import React, {useMemo, useState} from 'react';
import {Alert, Linking, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ExternalLink, Lightbulb} from 'lucide-react-native';
import {PecsScreenProps} from '@presentation/navigation/types';
import {PecsProgressBar} from '@presentation/components/pecs/PecsProgressBar';
import {PecsCardFace} from '@presentation/components/pecs/PecsCardFace';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {AppThemeName} from '@core/theme';
import {logger} from '@core/utils/logger';

export const PecsHandoffScreen: React.FC<PecsScreenProps<'PecsHandoff'>> = ({
  navigation,
}) => {
  const theme = useTheme();
  const config = usePecsStore(s => s.config);
  const save = usePecsStore(s => s.save);
  const activities = useActivityStore(s => s.activities);

  const {username, themeColor, voiceId, skinTone, region, diagnosis, birthYear} =
    useOnboardingStore();
  const settings = useSettingsStore(s => s.settings);
  const setTheme = useSettingsStore(s => s.setTheme);
  const setVoice = useSettingsStore(s => s.setVoice);
  const setIsOnboarded = useSettingsStore(s => s.setIsOnboarded);

  const [saving, setSaving] = useState(false);

  const card = useMemo(
    () => activities.find(a => a.id === config.selectedCardId) ?? null,
    [activities, config.selectedCardId],
  );

  // Trẻ luôn thấy khung nhận. Với mức 'basic', trẻ chạm vào thẻ thì thẻ sẽ TỰ ĐỘNG hút vào khung.
  const isBasicMotor = config.motorLevel === 'basic';
  const actionText = isBasicMotor
    ? 'Khi bé chạm và máy phát ra âm thanh'
    : 'Khi bé kéo thẻ vào ô nhận và máy phát ra âm thanh';

  const openPinningGuide = () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://support.apple.com/vi-vn/111795'
        : 'https://support.google.com/android/answer/9455138?hl=vi';
    Linking.openURL(url).catch(() => undefined);
  };

  const handleStart = async () => {
    setSaving(true);
    try {
      const name = username.trim();

      if (!settings.isOnboarded) {
        // Lần đầu: tạo hồ sơ trẻ từ dữ liệu đã thu thập trong wizard.
        await useChildStore.getState().add({
          name: name || 'Bé',
          skinTone,
          region,
          diagnosis,
          birthYear,
        });
        await useChildStore.getState().ensureActive();
      } else if (name) {
        // Chạy lại thiết lập: chỉ cập nhật tên hồ sơ đang dùng.
        const activeId = settings.activeChildId;
        if (activeId != null) {
          await useChildStore.getState().update(activeId, {name});
        }
      }

      if (themeColor) {
        await setTheme(themeColor as AppThemeName);
      }
      await setVoice(voiceId);

      await save({
        setupDone: true,
        masteryNotified: false,
        childModeActive: true,
      });

      if (!settings.isOnboarded) {
        await setIsOnboarded(true);
      }

      navigation.navigate('PecsChild');
    } catch (e) {
      logger.error('[PecsHandoffScreen] hoàn tất thiết lập thất bại', e);
      Alert.alert(
        'Có lỗi xảy ra',
        'Không lưu được thiết lập. Ba mẹ thử lại giúp nhé.',
      );
      setSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right']}>
      <PecsProgressBar step={9} label="Hoàn tất & Chuyển giao" />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[styles.iconBox, {backgroundColor: theme.colors.primary}]}>
          <Lightbulb size={40} color={theme.colors.onPrimary} />
        </View>

        <Text variant="headlineSmall" style={styles.title}>
          Ứng dụng đã sẵn sàng!
        </Text>

        {card ? (
          <View style={styles.cardWrap}>
            <PecsCardFace card={card} size={150} />
          </View>
        ) : null}

        <View
          style={[
            styles.callout,
            {
              backgroundColor: theme.colors.primaryContainer,
              borderColor: theme.colors.primary,
            },
          ]}>
          <Text variant="titleMedium" style={styles.calloutText}>
            {`Khi đưa máy cho bé, ba mẹ hãy chuẩn bị sẵn món "${
              card?.label() ?? 'đã chọn'
            }" trên tay. ${actionText}, hãy đưa món đồ cho bé ngay lập tức nhé!`}
          </Text>
        </View>

        <Text variant="titleMedium" style={styles.tipTitle}>
          Mẹo nhỏ để bé tập trung tối đa
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.tipBody, {color: theme.colors.onSurfaceVariant}]}>
          Để tránh việc bé vô tình bấm nút nguồn tắt màn hình hoặc vuốt thoát ứng
          dụng, ba mẹ hãy bật tính năng khoá trẻ em của điện thoại nhé:
        </Text>

        <View
          style={[styles.tipBox, {backgroundColor: theme.colors.surfaceVariant}]}>
          <Text variant="bodyMedium">
            {'•  Bật '}
            <Text style={styles.bold}>"Ghim ứng dụng"</Text>
            {' (App Pinning) trong phần Cài đặt > Bảo mật.'}
          </Text>
        </View>

        <Button
          mode="text"
          icon={() => (
            <ExternalLink size={18} color={theme.colors.primary} />
          )}
          onPress={openPinningGuide}>
          Xem hướng dẫn chi tiết
        </Button>
      </ScrollView>

      <View style={styles.footer}>
        <Button disabled={saving} onPress={() => navigation.goBack()}>
          Quay lại
        </Button>
        <Button
          mode="contained"
          disabled={!card || saving}
          loading={saving}
          contentStyle={styles.ctaContent}
          onPress={handleStart}>
          Đã hiểu và bắt đầu sử dụng
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {paddingHorizontal: 20, paddingBottom: 16, alignItems: 'center'},
  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  title: {fontWeight: '800', marginBottom: 16},
  cardWrap: {marginBottom: 16},
  callout: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 22,
  },
  calloutText: {fontWeight: '600', lineHeight: 24},
  tipTitle: {alignSelf: 'flex-start', fontWeight: '800', marginBottom: 6},
  tipBody: {alignSelf: 'flex-start', marginBottom: 12},
  tipBox: {width: '100%', borderRadius: 14, padding: 14},
  bold: {fontWeight: '800'},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 8,
  },
  ctaContent: {paddingVertical: 6},
});
