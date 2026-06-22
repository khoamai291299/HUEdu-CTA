/**
 * src/presentation/components/EmptyState.tsx
 * Mục đích: Hiển thị trạng thái rỗng thân thiện (icon + thông điệp).
 * Dependency: react-native-paper, lucide-react-native.
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Inbox} from 'lucide-react-native';

interface Props {
  message: string;
}

export const EmptyState: React.FC<Props> = ({message}) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Inbox size={64} color={theme.colors.outline} />
      <Text variant="bodyLarge" style={styles.text}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32},
  text: {marginTop: 16, textAlign: 'center', opacity: 0.7},
});
