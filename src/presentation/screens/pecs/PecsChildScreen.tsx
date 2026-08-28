/**
 * src/presentation/screens/pecs/PecsChildScreen.tsx
 * Mục đích: Màn 10 — Giao diện của TRẺ ở Bước 1 PECS.
 *           Màn hình trống, ẩn thanh điều hướng, không có nút cài đặt.
 *
 *           Giao diện được chọn theo Decision Tree (mức vận động tinh):
 *             - 'basic'    : CHỈ duy nhất 1 thẻ thật to ở giữa màn hình, trẻ CHẠM
 *                            (không có vùng kéo thả — đúng mô tả Phần 2 của tài liệu).
 *             - 'standard' : 1 thẻ + 1 Vùng nhận, trẻ KÉO - THẢ (đúng Màn hình 10).
 *
 *           Mọi lượt tương tác được ghi lại để tính cờ isReadyForNextStage.
 * Dependency: gesture-handler, reanimated, PecsCardFace, PecsDropZone, usePecsStore, useTts.
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button, IconButton, Text, useTheme} from 'react-native-paper';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {RootScreenProps} from '@presentation/navigation/types';
import {
  PecsCardFace,
  PecsCardFaceRef,
} from '@presentation/components/pecs/PecsCardFace';
import {
  PecsDropZone,
  PecsDropZoneRef,
  PecsZoneLayout,
} from '@presentation/components/pecs/PecsDropZone';
import {X} from 'lucide-react-native';
import {PinGateModal} from '@presentation/components/PinGateModal';
import {usePecsStore} from '@presentation/stores/usePecsStore';
import {useActivityStore} from '@presentation/stores/useActivityStore';
import {useTts} from '@presentation/hooks/useTts';
import {Pecs} from '@core/constants';

/** Thời gian thẻ "nghỉ" sau một lượt thành công trước khi sẵn sàng lượt mới. */
const RESET_DELAY_MS = 1400;

export const PecsChildScreen: React.FC<RootScreenProps<'PecsChild'>> = ({
  navigation,
}) => {
  const theme = useTheme();
  const {width, height} = useWindowDimensions();

  const config = usePecsStore(s => s.config);
  const recordAttempt = usePecsStore(s => s.recordAttempt);
  const setChildModeActive = usePecsStore(s => s.setChildModeActive);
  const activities = useActivityStore(s => s.activities);
  const {speakWord} = useTts();

  const card = useMemo(
    () => activities.find(a => a.id === config.selectedCardId) ?? null,
    [activities, config.selectedCardId],
  );

  // Yêu cầu mới: luôn sử dụng kéo thả (standard), bỏ chức năng chạm để đọc (basic)
  const isTapMode = false;
  const isBasicMotor = config.motorLevel === 'basic';

  const cardRef = useRef<PecsCardFaceRef>(null);
  const zoneRef = useRef<PecsDropZoneRef>(null);

  const [showExitGate, setShowExitGate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [busy, setBusy] = useState(false);

  // ── Trạng thái một "lượt tương tác" ────────────────────────────────────────
  const attemptStartRef = useRef<number>(Date.now());
  const cancelCountRef = useRef(0);
  const touchedRef = useRef(false);

  const resetAttempt = useCallback(() => {
    attemptStartRef.current = Date.now();
    cancelCountRef.current = 0;
    touchedRef.current = false;
  }, []);

  // ── Vị trí thẻ & vùng nhận (toạ độ trong cùng một container) ───────────────
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(1);
  const hovering = useSharedValue(0);

  const zone = useSharedValue<PecsZoneLayout>({x: 0, y: 0, width: 0, height: 0});
  const cardBox = useSharedValue({x: 0, y: 0, width: 0, height: 0});

  useAnimatedReaction(
    () => hovering.value,
    (curr, prev) => {
      if (curr !== prev) {
        runOnJS(setIsHovered)(curr === 1);
      }
    },
  );

  // ── Chặn nút Back vật lý — trẻ không được tự thoát ────────────────────────
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      // Đang mở cổng PIN -> để nút Back đóng cổng (trả bé về màn của bé).
      if (showExitGate) {
        setShowExitGate(false);
        return true;
      }
      // Trẻ đang dùng -> chặn hoàn toàn.
      return true;
    });
    return () => sub.remove();
  }, [showExitGate]);

  // ── Lượt thất bại do quá thời gian (chỉ khi trẻ đã thực sự thao tác) ───────
  useEffect(() => {
    const timer = setInterval(() => {
      if (!card || busy) {
        return;
      }
      const elapsed = Date.now() - attemptStartRef.current;
      if (touchedRef.current && elapsed > Pecs.ATTEMPT_TIMEOUT_MS) {
        recordAttempt({
          cardId: card.id,
          responseMs: elapsed,
          isSuccess: false,
          cancelCount: cancelCountRef.current,
        });
        resetAttempt();
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [card, busy, recordAttempt, resetAttempt]);

  // ── Xử lý một lượt thành công ─────────────────────────────────────────────
  const handleSuccess = useCallback(() => {
    if (!card || busy) {
      return;
    }
    setBusy(true);

    const responseMs = Date.now() - attemptStartRef.current;
    const cancelCount = cancelCountRef.current;

    // Phản hồi cho trẻ: thẻ sáng lên + nảy nhẹ, đồng thời phát âm to rõ.
    cardRef.current?.playSuccess();
    zoneRef.current?.triggerHighlight();
    // recordUsage = false: lượt PECS được ghi vào bảng riêng, không lẫn lịch sử bảng giao tiếp.
    speakWord(card, false);

    recordAttempt({
      cardId: card.id,
      responseMs,
      isSuccess: true,
      cancelCount,
    });

    setTimeout(() => {
      // Bay về vị trí cũ một cách nhẹ nhàng và chậm rãi để trẻ không bị hoảng
      tx.value = withTiming(0, {duration: 500});
      ty.value = withTiming(0, {duration: 500});
      scale.value = withTiming(1, {duration: 300});
      hovering.value = 0;
      resetAttempt();
      setBusy(false);
    }, RESET_DELAY_MS);
  }, [card, busy, speakWord, recordAttempt, resetAttempt, tx, ty, scale, hovering]);

  const handleCancelledDrag = useCallback(() => {
    if (!card) {
      return;
    }
    cancelCountRef.current += 1;
    touchedRef.current = true;

    if (cancelCountRef.current >= Pecs.MAX_CANCELS_PER_ATTEMPT) {
      recordAttempt({
        cardId: card.id,
        responseMs: Date.now() - attemptStartRef.current,
        isSuccess: false,
        cancelCount: cancelCountRef.current,
      });
      resetAttempt();
    }
  }, [card, recordAttempt, resetAttempt]);

  const markTouched = useCallback(() => {
    touchedRef.current = true;
  }, []);

  // ── Cử chỉ ────────────────────────────────────────────────────────────────
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!isBasicMotor && !busy)
        .onStart(() => {
          'worklet';
          scale.value = withSpring(1.08);
          runOnJS(markTouched)();
        })
        .onUpdate(e => {
          'worklet';
          tx.value = e.translationX;
          ty.value = e.translationY;

          // Tâm thẻ hiện tại trong hệ toạ độ container
          const cx = cardBox.value.x + cardBox.value.width / 2 + tx.value;
          const cy = cardBox.value.y + cardBox.value.height / 2 + ty.value;

          // "Hút thẻ": nới rộng biên vùng nhận để trẻ không cần thả chính xác
          // Ở mức basic: nhân 3 padding để hút mạnh hơn.
          const pad = isBasicMotor ? Pecs.DROP_ZONE_PADDING * 3 : Pecs.DROP_ZONE_PADDING;
          const inside =
            cx > zone.value.x - pad &&
            cx < zone.value.x + zone.value.width + pad &&
            cy > zone.value.y - pad &&
            cy < zone.value.y + zone.value.height + pad;

          hovering.value = inside ? 1 : 0;
        })
        .onEnd(() => {
          'worklet';
          if (hovering.value === 1) {
            // Snap thẻ vào giữa vùng nhận rồi báo thành công
            const targetX =
              zone.value.x +
              zone.value.width / 2 -
              (cardBox.value.x + cardBox.value.width / 2);
            const targetY =
              zone.value.y +
              zone.value.height / 2 -
              (cardBox.value.y + cardBox.value.height / 2);
            tx.value = withSpring(targetX, {damping: 18});
            ty.value = withSpring(targetY, {damping: 18});
            scale.value = withSpring(1);
            runOnJS(handleSuccess)();
          } else {
            tx.value = withSpring(0);
            ty.value = withSpring(0);
            scale.value = withSpring(1);
            runOnJS(handleCancelledDrag)();
          }
        }),
    [
      isTapMode,
      busy,
      tx,
      ty,
      scale,
      hovering,
      zone,
      cardBox,
      handleSuccess,
      handleCancelledDrag,
      markTouched,
    ],
  );

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(isBasicMotor && !busy)
        .onStart(() => {
          'worklet';
          runOnJS(markTouched)();
        })
        .onEnd(() => {
          'worklet';
          const targetX =
            zone.value.x +
            zone.value.width / 2 -
            (cardBox.value.x + cardBox.value.width / 2);
          const targetY =
            zone.value.y +
            zone.value.height / 2 -
            (cardBox.value.y + cardBox.value.height / 2);
          tx.value = withTiming(targetX, {duration: 250});
          scale.value = withTiming(1, {duration: 250});
          ty.value = withTiming(targetY, {duration: 250}, (finished) => {
            if (finished) {
              runOnJS(handleSuccess)();
            }
          });
        }),
    [isBasicMotor, busy, handleSuccess, markTouched, zone, cardBox, tx, ty, scale],
  );

  const composed = useMemo(
    () => Gesture.Exclusive(panGesture, tapGesture),
    [panGesture, tapGesture],
  );

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: tx.value},
      {translateY: ty.value},
      {scale: scale.value},
    ],
  }));

  // ── Thoát chế độ trẻ ──────────────────────────────────────────────────────
  const handleExitSuccess = async () => {
    setShowExitGate(false);
    await setChildModeActive(false);
    // reset (không replace) để mỗi vòng vào/ra chế độ trẻ không chồng thêm
    // một route 'Pecs' vào stack. Giữ ModeSelect bên dưới để nút Back của
    // Dashboard vẫn có chỗ quay về.
    navigation.reset({
      index: 1,
      routes: [{name: 'ModeSelect'}, {name: 'Pecs'}],
    });
  };

  // ── Kích thước thẻ ────────────────────────────────────────────────────────
  const shortSide = Math.min(width, height);
  const baseSize = shortSide * 0.42;
  const cardSize = Math.min(baseSize, shortSide * 0.72);
  const zoneHeight = Math.max(height * 0.24, 150);

  if (!card) {
    return (
      <View
        style={[styles.fallback, {backgroundColor: theme.colors.background}]}>
        <StatusBar hidden />
        <Text variant="titleLarge" style={styles.fallbackTitle}>
          Chưa có thẻ nào được chọn
        </Text>
        <Text variant="bodyMedium" style={styles.fallbackBody}>
          Ba mẹ hãy quay lại phần thiết lập để chọn 1 thẻ cho bé.
        </Text>
        <Button mode="contained" onPress={() => setShowExitGate(true)}>
          Về phần thiết lập
        </Button>
        <PinGateModal
          visible={showExitGate}
          onDismiss={() => setShowExitGate(false)}
          onSuccess={handleExitSuccess}
          onMaxFailures={() => setShowExitGate(false)}
          dismissOnBackdropPress
          dismissOnWrongPin
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar hidden />

      {/* Nút thoát dành cho người lớn — mở cổng PIN, trẻ bấm cũng không qua được */}
      <IconButton
        icon={() => <X size={26} color={theme.colors.onSurfaceVariant} />}
        style={styles.exitBtn}
        accessibilityLabel="Thoát chế độ trẻ (dành cho người lớn)"
        onPress={() => setShowExitGate(true)}
      />

      {isTapMode ? (
        // ── Mức 'basic': màn hình trống hoàn toàn, chỉ duy nhất 1 thẻ ở giữa ──
        <View style={styles.tapLayout}>
          <GestureDetector gesture={composed}>
            <Animated.View style={cardAnimatedStyle}>
              <PecsCardFace ref={cardRef} card={card} size={cardSize} />
            </Animated.View>
          </GestureDetector>
        </View>
      ) : (
        // ── Mức 'standard': 1 thẻ + 1 Vùng nhận, kéo - thả ────────────────────
        // LƯU Ý: Vùng nhận và thẻ PHẢI là con trực tiếp của cùng một View thì
        // toạ độ onLayout của chúng mới cùng hệ quy chiếu để so va chạm.
        <View style={[styles.dragLayout, {paddingTop: height * 0.06}]}>
          <PecsDropZone
            ref={zoneRef}
            isHovered={isHovered}
            height={zoneHeight}
            onLayoutChange={layout => {
              zone.value = layout;
            }}
          />

          <View
            style={styles.cardSlot}
            onLayout={e => {
              const {x, y, width: w, height: h} = e.nativeEvent.layout;
              cardBox.value = {x, y, width: w, height: h};
            }}>
            <GestureDetector gesture={composed}>
              <Animated.View style={cardAnimatedStyle}>
                <PecsCardFace ref={cardRef} card={card} size={cardSize} />
              </Animated.View>
            </GestureDetector>
          </View>
        </View>
      )}

      <PinGateModal
        visible={showExitGate}
        onDismiss={() => setShowExitGate(false)}
        onSuccess={handleExitSuccess}
        onMaxFailures={() => setShowExitGate(false)}
        dismissOnBackdropPress
        dismissOnWrongPin
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  exitBtn: {position: 'absolute', top: 6, right: 6, zIndex: 50, opacity: 0.55},
  tapLayout: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40},
  dragLayout: {flex: 1, paddingBottom: 24},
  // cardSlot chiếm hết khoảng trống còn lại và căn GIỮA thẻ -> thẻ không còn
  // dính sát mép dưới máy. Tâm của slot trùng tâm thẻ nên phép tính va chạm
  // và snap vào Vùng nhận vẫn chính xác.
  cardSlot: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  fallbackTitle: {fontWeight: '800', textAlign: 'center'},
  fallbackBody: {textAlign: 'center', marginBottom: 12},
});
