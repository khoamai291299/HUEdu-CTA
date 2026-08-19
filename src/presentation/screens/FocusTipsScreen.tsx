import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Linking } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, ArrowLeft, ExternalLink } from 'lucide-react-native';
import { RootScreenProps } from '@presentation/navigation/types';

export const FocusTipsScreen: React.FC<RootScreenProps<'FocusTips'>> = ({ navigation, route }) => {
  const theme = useTheme();
  const isFromOnboarding = route.params?.isFromOnboarding ?? false;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleStart = () => {
    navigation.replace('Main');
  };

  const handleOpenLink = () => {
    const url = Platform.OS === 'ios'
      ? 'https://support.apple.com/vi-vn/111795'
      : 'https://support.google.com/android/answer/9455138?hl=vi';
    
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      {!isFromOnboarding && (
        <View style={styles.header}>
          <IconButton
            icon={() => <ArrowLeft size={24} color={theme.colors.onBackground} />}
            onPress={handleBack}
          />
          <Text variant="titleLarge" style={styles.headerTitle}>
            Mẹo giúp bé tập trung
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} alwaysBounceVertical={false}>
        {/* Icon container */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primary }]}>
            <Lock size={48} color={theme.colors.onPrimary} />
          </View>
        </View>

        <Text variant="headlineSmall" style={styles.title}>
          Mẹo nhỏ để bé tập trung tối đa!
        </Text>

        <Text variant="bodyLarge" style={styles.description}>
          Để tránh việc bé vô tình bấm nút nguồn tắt màn hình hoặc vuốt thoát ứng dụng, ba mẹ hãy bật tính năng khoá trẻ em của điện thoại nhé:
        </Text>

        {/* OS Specific Instruction Box */}
        <View style={[styles.instructionBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.bulletRow}>
            <View style={[styles.bullet, { backgroundColor: theme.colors.primary }]} />
            <Text variant="bodyLarge" style={styles.instructionText}>
              {Platform.OS === 'ios' ? (
                <>Bật <Text style={{ fontWeight: 'bold' }}>"Truy cập được hướng dẫn"</Text> (Guided Access) trong phần Cài đặt Trợ năng.</>
              ) : (
                <>Bật <Text style={{ fontWeight: 'bold' }}>"Ghim ứng dụng"</Text> (App Pinning) trong phần Cài đặt {'>'} Bảo mật.</>
              )}
            </Text>
          </View>
        </View>

        {/* Link Button */}
        <Button
          mode="text"
          icon={() => <ExternalLink size={20} color={theme.colors.primary} />}
          onPress={handleOpenLink}
          style={styles.linkButton}
          contentStyle={{ height: 48 }}
        >
          Xem hướng dẫn chi tiết
        </Button>

        {/* Start Button for Onboarding */}
        {isFromOnboarding && (
          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleStart}
              style={styles.startButton}
              contentStyle={{ height: 56 }}
              labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
            >
              Đã hiểu và bắt đầu sử dụng
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  headerTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  instructionBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    lineHeight: 24,
  },
  linkButton: {
    marginBottom: 32,
  },
  footer: {
    width: '100%',
  },
  startButton: {
    borderRadius: 28,
  },
});
