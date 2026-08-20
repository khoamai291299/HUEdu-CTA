/**
 * src/presentation/screens/ModeSelectScreen.tsx
 * Mục đích: Màn hình 1 của tài liệu — Khởi động & Chọn Chế độ.
 *           Hiển thị ngay khi mở app (sau khi đã onboarding), tách rõ hai lối vào:
 *           "Vào Cài đặt (dành cho phụ huynh)" — có cổng PIN — và
 *           "Bắt đầu giao tiếp (dành cho trẻ)".
 * Dependency: PinGateModal, usePecsStore, useChildStore.
 */
import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Baby, MessageSquare, Settings as SettingsIcon} from 'lucide-react-native';
import {RootScreenProps} from '@presentation/navigation/types';
import {PinGateModal} from '@presentation/components/PinGateModal';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';

export const ModeSelectScreen: React.FC<RootScreenProps<'ModeSelect'>> = ({
  navigation,
}) => {
  const theme = useTheme();
  const config = usePecsStore(s => s.config);
  const activeChildId = useSettingsStore(s => s.settings.activeChildId);
  const child = useChildStore(s => s.children.find(c => c.id === activeChildId));
  const childName = child?.name?.trim();

  const [showPinGate, setShowPinGate] = useState(false);

  const tile = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    onPress: () => void,
    accent: string,
  ) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      android_ripple={{color: theme.colors.primary}}
      style={[
        styles.tile,
        {backgroundColor: theme.colors.surfaceVariant, borderColor: accent},
      ]}>
      <View style={[styles.iconBox, {backgroundColor: accent}]}>{icon}</View>
      <Text variant="titleLarge" style={styles.tileTitle}>
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.tileSubtitle, {color: theme.colors.onSurfaceVariant}]}>
        {subtitle}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {childName ? `Chào ${childName}!` : 'Chào mừng ba mẹ!'}
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          Ba mẹ muốn làm gì bây giờ?
        </Text>

        <View style={styles.tiles}>
          {tile(
            <MessageSquare size={40} color="#FFFFFF" />,
            'Bắt đầu giao tiếp',
            'Dành cho trẻ · Bảng thẻ giao tiếp',
            () => navigation.replace('Main'),
            theme.colors.primary,
          )}

          {config.setupDone
            ? tile(
                <Baby size={40} color="#FFFFFF" />,
                'Bài học PECS - Bước 1',
                config.selectedCardId
                  ? 'Dành cho trẻ · Trao đổi 1 thẻ'
                  : 'Cần chọn thẻ trong phần thiết lập',
                () =>
                  config.selectedCardId
                    ? navigation.replace('PecsChild')
                    : setShowPinGate(true),
                '#7C9A5E',
              )
            : null}

          {tile(
            <SettingsIcon size={40} color="#FFFFFF" />,
            'Vào Cài đặt',
            'Dành cho phụ huynh · Cần mã PIN',
            () => setShowPinGate(true),
            '#6B7280',
          )}
        </View>
      </ScrollView>

      <PinGateModal
        visible={showPinGate}
        onDismiss={() => setShowPinGate(false)}
        onSuccess={() => {
          setShowPinGate(false);
          navigation.navigate('Settings');
        }}
        onMaxFailures={() => setShowPinGate(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  title: {textAlign: 'center', fontWeight: '800', marginBottom: 6},
  subtitle: {textAlign: 'center', marginBottom: 32},
  tiles: {gap: 16},
  tile: {
    borderRadius: 24,
    borderWidth: 2,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tileTitle: {fontWeight: '800', textAlign: 'center'},
  tileSubtitle: {textAlign: 'center', marginTop: 4},
});
