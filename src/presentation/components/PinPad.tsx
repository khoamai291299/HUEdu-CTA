/**
 * src/presentation/components/PinPad.tsx
 * Mục đích: Bàn phím số nhập PIN cho Parent Gate (FR-09) - ô lớn, hiển thị chấm tròn.
 * Dependency: react-native, react-native-paper, lucide-react-native, constants.
 */
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {Delete} from 'lucide-react-native';
import {Defaults} from '@core/constants';

interface Props {
  value: string;
  onChange: (next: string) => void;
  length?: number;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export const PinPad: React.FC<Props> = ({
  value,
  onChange,
  length = Defaults.PIN_LENGTH,
}) => {
  const theme = useTheme();

  const press = (key: string) => {
    if (key === 'del') {
      onChange(value.slice(0, -1));
    } else if (key !== '' && value.length < length) {
      onChange(value + key);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.dots}>
        {Array.from({length}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                borderColor: theme.colors.primary,
                backgroundColor:
                  i < value.length ? theme.colors.primary : 'transparent',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.grid}>
        {KEYS.map((key, idx) => (
          <Pressable
            key={`${key}-${idx}`}
            disabled={key === ''}
            android_ripple={{color: theme.colors.primary, borderless: true}}
            onPress={() => press(key)}
            style={[
              styles.key,
              key === '' && styles.keyEmpty,
              key !== '' && {backgroundColor: theme.colors.surfaceVariant},
            ]}>
            {key === 'del' ? (
              <Delete size={28} color={theme.colors.onSurface} />
            ) : (
              <Text variant="headlineSmall">{key}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {alignItems: 'center'},
  dots: {flexDirection: 'row', gap: 18, marginBottom: 32},
  dot: {width: 20, height: 20, borderRadius: 10, borderWidth: 2},
  grid: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  key: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmpty: {backgroundColor: 'transparent'},
});
