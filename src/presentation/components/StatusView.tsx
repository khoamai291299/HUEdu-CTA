/**
 * src/presentation/components/StatusView.tsx
 * Mục đích: View trạng thái Loading & Error dùng chung (màn khởi động, tải dữ liệu).
 * Dependency: react-native-paper.
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, Text} from 'react-native-paper';

export const LoadingView: React.FC<{label?: string}> = ({label}) => (
  <View style={styles.center}>
    <ActivityIndicator size="large" />
    {label ? (
      <Text variant="bodyMedium" style={styles.label}>
        {label}
      </Text>
    ) : null}
  </View>
);

export const ErrorView: React.FC<{message: string; onRetry?: () => void}> = ({
  message,
  onRetry,
}) => (
  <View style={styles.center}>
    <Text variant="titleMedium" style={styles.error}>
      {message}
    </Text>
    {onRetry ? (
      <Button mode="contained" onPress={onRetry} style={styles.retry}>
        Thử lại
      </Button>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24},
  label: {marginTop: 12, opacity: 0.7},
  error: {textAlign: 'center', marginBottom: 16},
  retry: {marginTop: 8},
});
