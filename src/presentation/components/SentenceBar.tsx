/**
 * src/presentation/components/SentenceBar.tsx
 * Mục đích: Thanh hiển thị câu đang ghép + nút Đọc / Xoá lùi / Xoá hết (FR-02,03).
 * Dependency: react-native, react-native-paper, lucide-react-native, Vocabulary, i18n.
 */
import React from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {IconButton, Surface, Text, useTheme} from 'react-native-paper';
import {Delete, Trash2, Volume2} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {Vocabulary} from '@domain/entities/Vocabulary';

interface Props {
  words: Vocabulary[];
  onSpeak: () => void;
  onRemoveLast: () => void;
  onClear: () => void;
  onRemoveAt: (index: number) => void;
}

export const SentenceBar: React.FC<Props> = ({
  words,
  onSpeak,
  onRemoveLast,
  onClear,
  onRemoveAt,
}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <Surface style={styles.container} elevation={2}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={styles.scroll}>
        {words.length === 0 ? (
          <Text style={styles.placeholder}>{t('board.emptySentence')}</Text>
        ) : (
          words.map((w, i) => (
            <Pressable
              key={`${w.id}-${i}`}
              onPress={() => onRemoveAt(i)}
              style={[
                styles.chip,
                {backgroundColor: theme.colors.secondaryContainer},
              ]}>
              <Text variant="titleMedium">{w.label()}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>

      <View style={styles.actions}>
        <IconButton
          icon={() => <Delete size={24} color={theme.colors.onSurface} />}
          onPress={onRemoveLast}
          disabled={words.length === 0}
          accessibilityLabel="backspace"
        />
        <IconButton
          icon={() => <Trash2 size={24} color={theme.colors.error} />}
          onPress={onClear}
          disabled={words.length === 0}
          accessibilityLabel={t('board.clearSentence')}
        />
        <IconButton
          mode="contained"
          containerColor={theme.colors.primary}
          icon={() => <Volume2 size={26} color={theme.colors.onPrimary} />}
          onPress={onSpeak}
          disabled={words.length === 0}
          accessibilityLabel={t('board.speakSentence')}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    margin: 12,
    paddingHorizontal: 8,
    minHeight: 76,
  },
  scroll: {alignItems: 'center', paddingHorizontal: 4, gap: 8},
  placeholder: {opacity: 0.5, paddingHorizontal: 8},
  chip: {borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10},
  actions: {flexDirection: 'row', alignItems: 'center'},
});
