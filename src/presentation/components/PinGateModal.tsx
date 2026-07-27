import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { X, Delete } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

// Scramble the digits 0-9
const generateScrambledDigits = () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits;
};

export const PinGateModal: React.FC<Props> = ({ visible, onDismiss, onSuccess }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  
  const [digits, setDigits] = useState<number[]>([]);
  const [pin, setPin] = useState<string>('');
  
  // Default PIN is 1234. In a real app, you might want to save this in settings.
  const CORRECT_PIN = '1234';

  useEffect(() => {
    if (visible) {
      setDigits(generateScrambledDigits());
      setPin('');
    }
  }, [visible]);

  const handleDigitPress = (digit: number) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          onSuccess();
        } else {
          // Reset if wrong
          setTimeout(() => {
            setPin('');
            setDigits(generateScrambledDigits());
          }, 500);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface, width: Math.min(width - 32, 360) }]}>
          <View style={styles.header}>
            <Text variant="titleLarge">Dành cho phụ huynh</Text>
            <TouchableOpacity onPress={onDismiss} hitSlop={8}>
              <X size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
          
          <Text variant="bodyMedium" style={styles.subtitle}>
            Nhập mã PIN để tiếp tục (Mặc định: 1234)
          </Text>

          <View style={styles.pinDisplay}>
            {[0, 1, 2, 3].map(i => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  { borderColor: theme.colors.outline },
                  pin.length > i && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                ]}
              />
            ))}
          </View>

          <View style={styles.keypad}>
            {digits.map(digit => (
              <TouchableOpacity
                key={digit}
                style={[styles.key, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => handleDigitPress(digit)}
              >
                <Text variant="headlineMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {digit}
                </Text>
              </TouchableOpacity>
            ))}
            
            <View style={[styles.key, { backgroundColor: 'transparent' }]} />
            
            <TouchableOpacity
              style={[styles.key, { backgroundColor: theme.colors.errorContainer }]}
              onPress={handleBackspace}
            >
              <Delete size={28} color={theme.colors.onErrorContainer} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    marginBottom: 24,
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  key: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
