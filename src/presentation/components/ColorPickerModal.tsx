import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { X } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onApply: (hex: string) => void;
  initialColor?: string;
}

export const ColorPickerModal: React.FC<Props> = ({
  visible,
  onDismiss,
  onApply,
  initialColor = '#5B8DEF',
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [hex, setHex] = useState(initialColor);

  useEffect(() => {
    if (visible) {
      setHex(initialColor);
    }
  }, [visible, initialColor]);

  // Đảm bảo có dạng #RRGGBB
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);

  const handleApply = () => {
    if (isValidHex) {
      onApply(hex);
      onDismiss();
    }
  };

  const presetColors = [
    '#5B8DEF', '#E07A6E', '#81C784', '#F7D5B8', '#F5F5DC', '#121417',
    '#FF69B4', '#9370DB', '#00CED1', '#FFD700', '#FF8C00', '#8B4513'
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface, width: Math.min(width - 32, 400) }]}>
          <View style={styles.header}>
            <Text variant="titleLarge">Màu tùy chọn</Text>
            <TouchableOpacity onPress={onDismiss} hitSlop={8}>
              <X size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={[styles.preview, { backgroundColor: isValidHex ? hex : '#CCC' }]} />
            
            <TextInput
              label="Mã HEX (VD: #5B8DEF)"
              value={hex}
              onChangeText={(text) => {
                if (text.startsWith('#')) setHex(text);
                else setHex('#' + text);
              }}
              mode="outlined"
              style={styles.input}
              autoCapitalize="characters"
              maxLength={7}
            />

            <Text variant="labelLarge" style={styles.presetsLabel}>Màu gợi ý:</Text>
            <View style={styles.presets}>
              {presetColors.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.presetDot, { backgroundColor: c, borderColor: theme.colors.outline }]}
                  onPress={() => setHex(c)}
                />
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <Button mode="text" onPress={onDismiss}>Hủy</Button>
            <Button mode="contained" onPress={handleApply} disabled={!isValidHex}>Áp dụng</Button>
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
    marginBottom: 16,
  },
  content: {
    marginBottom: 24,
  },
  preview: {
    height: 80,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    marginBottom: 16,
  },
  presetsLabel: {
    marginBottom: 8,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
