import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Vocabulary } from '@domain/entities/Vocabulary';
import { IconTile } from './IconTile';

interface Props {
  vocabulary: Vocabulary;
  size: number;
  dropZoneLayout: { x: number; y: number; width: number; height: number; pageY: number } | null;
  onDrop: (v: Vocabulary) => void;
  onPress: (v: Vocabulary) => void;
  scrollOffset?: number;
}

export const DraggableTile: React.FC<Props> = ({
  vocabulary,
  size,
  dropZoneLayout,
  onDrop,
  onPress,
}) => {
  const isDragging = useSharedValue(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Lưu vị trí gốc trên màn hình để tính toán va chạm
  const absoluteX = useSharedValue(0);
  const absoluteY = useSharedValue(0);

  const checkDrop = () => {
    'worklet';
    if (!dropZoneLayout) return false;
    
    const thresholdY = dropZoneLayout.height; 
    
    if (translateY.value < -100) {
      return true;
    }
    return false;
  };

  const handleDrop = () => {
    onDrop(vocabulary);
  };

  const handlePress = () => {
    onPress(vocabulary);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.1);
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      const dropped = checkDrop();
      if (dropped) {
        isDragging.value = false;
        // Snap vào DropZone
        translateX.value = withSpring(0);
        translateY.value = withSpring(-200); // Bay lên trên
        scale.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(handleDrop)();
          // Đặt lại sau khi drop
          translateX.value = 0;
          translateY.value = 0;
          scale.value = withTiming(1, { duration: 300 });
        });
      } else {
        isDragging.value = false;
        // Trở về vị trí cũ
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
      }
    })
    .onFinalize(() => {
      if (isDragging.value) {
        isDragging.value = false;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  const tapGesture = Gesture.Tap().runOnJS(true).onEnd(() => {
    handlePress();
  });

  const composed = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: isDragging.value ? 1000 : 1,
      elevation: isDragging.value ? 1000 : 1,
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[animatedStyle, { zIndex: 100 }]}>
        <View style={{ pointerEvents: 'none' }}>
          <IconTile
            vocabulary={vocabulary}
            size={size}
            onPress={() => {}} // Handle bằng tapGesture để tránh xung đột
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};
