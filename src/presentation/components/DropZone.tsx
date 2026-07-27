import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, ViewProps, LayoutChangeEvent } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  LinearTransition,
} from 'react-native-reanimated';
import { DownloadCloud, Volume2, Trash2 } from 'lucide-react-native';
import { IconButton } from 'react-native-paper';
import { Vocabulary } from '@domain/entities/Vocabulary';
import { IconTile } from './IconTile';

export interface DropZoneRef {
  triggerHighlight: () => void;
}

interface DropZoneProps extends ViewProps {
  vocabulary?: Vocabulary | null;
  onPlay?: () => void;
  onClear?: () => void;
  onLayoutChange?: (layout: { x: number; y: number; width: number; height: number; pageY: number }) => void;
}

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(
  ({ style, vocabulary, onPlay, onClear, onLayoutChange, ...props }, ref) => {
    const theme = useTheme();
    const highlightOpacity = useSharedValue(0);

    useImperativeHandle(ref, () => ({
      triggerHighlight: () => {
        highlightOpacity.value = withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0, { duration: 300 })
        );
      },
    }));

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: highlightOpacity.value,
      };
    });

    const handleLayout = (e: LayoutChangeEvent) => {
      if (onLayoutChange) {
        // Lấy tọa độ tương đối từ event
        const layout = e.nativeEvent.layout;
        onLayoutChange({ ...layout, pageY: layout.y });
      }
    };

    return (
      <Animated.View
        layout={LinearTransition.springify().damping(16).mass(0.6)}
        onLayout={handleLayout}
        style={[
          styles.container,
          { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline },
          { height: vocabulary ? 120 : 50 },
          style
        ]}
        {...props}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.primary, opacity: 0.2 },
            animatedStyle,
          ]}
        />
        
        {vocabulary ? (
          <View style={styles.droppedContainer}>
            <View pointerEvents="none" style={{ marginRight: 16 }}>
              <IconTile vocabulary={vocabulary} size={70} onPress={() => {}} />
            </View>
            
            <View style={styles.controls}>
              <IconButton
                icon={() => <Volume2 size={20} color={theme.colors.onPrimaryContainer} />}
                size={32}
                mode="contained-tonal"
                containerColor={theme.colors.primaryContainer}
                onPress={onPlay}
                style={{ margin: 0 }}
              />
              <IconButton
                icon={() => <Trash2 size={20} color={theme.colors.error} />}
                size={32}
                mode="contained-tonal"
                containerColor={theme.colors.errorContainer}
                onPress={onClear}
                style={{ margin: 0 }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.8 }}>
              Kéo thẻ vào đây để phát âm
            </Text>
          </View>
        )}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 120,
    margin: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 8,
    opacity: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  droppedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  controls: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  }
});
