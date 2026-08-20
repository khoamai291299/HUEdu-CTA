/**
 * src/presentation/components/pecs/PecsMasteryDialog.tsx
 * Mục đích: Pop-up chúc mừng khi cờ isReadyForNextStage bật — gợi ý phụ huynh
 *           thêm thẻ thứ 2 để trẻ học phân biệt (theo User Story 1).
 * Dependency: react-native-paper, PecsMastery.
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';
import {PecsMastery} from '@domain/entities/PecsConfig';

interface Props {
  visible: boolean;
  mastery: PecsMastery;
  childName?: string;
  onDismiss: () => void;
}

export const PecsMasteryDialog: React.FC<Props> = ({
  visible,
  mastery,
  childName,
  onDismiss,
}) => {
  const theme = useTheme();
  const percent = Math.round(mastery.independentRate * 100);
  const name = childName?.trim() || 'Bé';

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Content>
          <View style={styles.header}>
            <Text style={styles.emoji}>🎉</Text>
            <Text variant="headlineSmall" style={styles.title}>
              Tuyệt vời!
            </Text>
          </View>

          <Text variant="bodyLarge" style={styles.body}>
            {`${name} đã thành thạo việc sử dụng 1 thẻ. Ba mẹ có muốn thử thêm thẻ thứ 2 để bé học cách phân biệt không?`}
          </Text>

          <View
            style={[
              styles.statBox,
              {backgroundColor: theme.colors.secondaryContainer},
            ]}>
            <Text variant="titleMedium" style={styles.statText}>
              {`${mastery.independentCount}/${mastery.total} lượt trao đổi độc lập · ${percent}%`}
            </Text>
            <Text
              variant="bodySmall"
              style={{color: theme.colors.onSurfaceVariant}}>
              Tính trên 20 lượt tương tác gần nhất
            </Text>
          </View>

          <Text
            variant="bodySmall"
            style={[styles.note, {color: theme.colors.onSurfaceVariant}]}>
            Ghi chú: Bước 2 (phân biệt nhiều thẻ) sẽ được mở trong bản cập nhật
            tiếp theo. Hiện ba mẹ có thể tiếp tục củng cố Bước 1 hoặc đổi sang
            thẻ yêu thích khác.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Đã hiểu</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {borderRadius: 24},
  header: {alignItems: 'center', marginBottom: 12},
  emoji: {fontSize: 48},
  title: {fontWeight: '800', marginTop: 4},
  body: {textAlign: 'center', marginBottom: 16},
  statBox: {borderRadius: 16, padding: 14, alignItems: 'center', gap: 2},
  statText: {fontWeight: '700'},
  note: {marginTop: 14, fontStyle: 'italic'},
});
