/**
 * src/presentation/components/PinGateModal.tsx
 * Mục đích: AC1 - Cổng xác minh phụ huynh.
 * Bàn phím 4 số chuẩn điện thoại (3×4), hiện giữa màn hình, sai quá 2 lần tự đóng.
 */
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  onMaxFailures?: () => void;
}

const MAX_FAILURES = 2;
const PIN_LENGTH = 4;
// Bàn phím chuẩn điện thoại — không xáo trộn
const FIXED_KEYPAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// ─── Component ────────────────────────────────────────────────────────────────

export const PinGateModal: React.FC<Props> = ({
  visible,
  onDismiss,
  onSuccess,
  onMaxFailures,
}) => {
  const theme = useTheme();
  const parentPin = useSettingsStore(s => s.settings.parentPin);
  const setParentPin = useSettingsStore(s => s.setParentPin);

  const [entered, setEntered] = useState<number[]>([]);
  const [failures, setFailures] = useState(0);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'closing'>('idle');
  const [isSetupMode, setIsSetupMode] = useState(!parentPin);

  const shakeX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      resetAll();
      setIsSetupMode(!parentPin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const resetAll = () => {
    setEntered([]);
    setFailures(0);
    setStatus('idle');
  };

  const playShake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, {toValue: 10, duration: 50, useNativeDriver: true, easing: Easing.linear}),
      Animated.timing(shakeX, {toValue: -10, duration: 50, useNativeDriver: true, easing: Easing.linear}),
      Animated.timing(shakeX, {toValue: 6, duration: 50, useNativeDriver: true, easing: Easing.linear}),
      Animated.timing(shakeX, {toValue: 0, duration: 50, useNativeDriver: true, easing: Easing.linear}),
    ]).start();
  };

  const handleDigit = (d: number) => {
    if (status !== 'idle') {return;}
    const next = [...entered, d];
    setEntered(next);
    if (next.length < PIN_LENGTH) {return;}

    const enteredPin = next.join('');
    
    if (isSetupMode) {
      // Đăng ký lần đầu
      setParentPin(enteredPin);
      setStatus('closing');
      setTimeout(onSuccess, 300);
    } else {
      // Xác minh
      if (enteredPin === parentPin) {
        setStatus('closing');
        setTimeout(onSuccess, 300);
      } else {
        setStatus('wrong');
        playShake();
        const newFail = failures + 1;
        setFailures(newFail);
        if (newFail > MAX_FAILURES) {
          setTimeout(() => {onDismiss(); onMaxFailures?.();}, 900);
        } else {
          setTimeout(() => {
            setEntered([]);
            setStatus('idle');
          }, 900);
        }
      }
    }
  };

  const handleBack = () => {
    if (status !== 'idle') {return;}
    setEntered(p => p.slice(0, -1));
  };

  const isWrong = status === 'wrong';

  // Layout: 3 hàng × 3 số + hàng cuối [ghost, 0, ⌫]
  const rows = [
    FIXED_KEYPAD.slice(0, 3),
    FIXED_KEYPAD.slice(3, 6),
    FIXED_KEYPAD.slice(6, 9),
  ];
  const lastDigit = FIXED_KEYPAD[9]; // 0

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Nút đóng */}
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss} hitSlop={16}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          {/* Tiêu đề */}
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.promptLabel}>
            {isSetupMode ? 'Tạo mật khẩu bảo mật' : 'Nhập mật khẩu'}
          </Text>
          <Text style={[styles.promptText, {color: theme.colors.primary, fontSize: 14, marginTop: 4}]}>
            {isSetupMode ? 'Hãy nhập 4 số để khoá phần Cài đặt' : 'Nhập mã để vào phần Cài đặt'}
          </Text>

          {/* Cảnh báo */}
          {failures > 0 && !isWrong && (
            <Text style={styles.warnText}>
              ⚠️ Sai {failures}/{MAX_FAILURES} – còn {MAX_FAILURES - failures + 1} lần
            </Text>
          )}
          {isWrong && (
            <Text style={styles.warnText}>
              {failures > MAX_FAILURES ? '❌ Hết lượt, đóng...' : '❌ Sai! Thử lại...'}
            </Text>
          )}

          {/* Dots tiến trình */}
          <Animated.View style={[styles.dotRow, {transform: [{translateX: shakeX}]}]}>
            {Array.from({length: PIN_LENGTH}).map((_, i) => {
              const filled = i < entered.length;
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    !filled && {borderColor: '#D0D5DD', backgroundColor: 'transparent'},
                    filled && !isWrong && {backgroundColor: theme.colors.primary, borderColor: theme.colors.primary},
                    filled && isWrong && {backgroundColor: '#EF4444', borderColor: '#EF4444'},
                  ]}
                />
              );
            })}
          </Animated.View>

          {/* Bàn phím số chuẩn */}
          <View style={styles.keypad}>
            {rows.map((row, ri) => (
              <View key={ri} style={styles.keyRow}>
                {row.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.keyBtn, isWrong && styles.keyBtnWrong]}
                    onPress={() => handleDigit(d)}
                    disabled={status !== 'idle'}
                    activeOpacity={0.6}>
                    <Text style={styles.keyText}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Hàng cuối: [rỗng] [0] [⌫] */}
            <View style={styles.keyRow}>
              <View style={styles.keyGhost} />
              <TouchableOpacity
                style={[styles.keyBtn, isWrong && styles.keyBtnWrong]}
                onPress={() => handleDigit(lastDigit)}
                disabled={status !== 'idle'}
                activeOpacity={0.6}>
                <Text style={styles.keyText}>{lastDigit}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.keyBtn, styles.keyDel]}
                onPress={handleBack}
                disabled={status !== 'idle'}
                activeOpacity={0.6}>
                <Text style={styles.keyDelText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',    // ← căn giữa màn hình
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    padding: 4,
  },
  closeIcon: {
    fontSize: 18,
    color: '#999',
  },
  lockIcon: {
    fontSize: 34,
    marginBottom: 8,
  },
  promptLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  promptText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  warnText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
    marginBottom: 22,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  keypad: {
    width: '100%',
    gap: 10,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  keyBtn: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  keyBtnWrong: {
    backgroundColor: '#FEE2E2',
  },
  keyDel: {
    backgroundColor: '#FEE2E2',
  },
  keyGhost: {
    flex: 1,
    height: 54,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  keyDelText: {
    fontSize: 22,
    color: '#DC2626',
  },
});