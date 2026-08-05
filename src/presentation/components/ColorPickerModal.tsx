import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  PanResponder,
  GestureResponderEvent,
  LayoutChangeEvent,
  TextInput as RNTextInput,
} from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { X } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onApply: (hex: string) => void;
  initialColor?: string;
}

// ─── Colour math helpers ────────────────────────────────────────────────────

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  h = h % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [Math.round(h), max === 0 ? 0 : d / max, max];
}

function hueToHex(h: number): string {
  const [r, g, b] = hsvToRgb(h, 1, 1);
  return rgbToHex(r, g, b);
}

// ─── Basic colour palette ────────────────────────────────────────────────────
const BASIC_COLORS: string[] = [
  '#FF8080','#FF0000','#804040','#804000','#400000','#00FFFF',
  '#00FF80','#0080FF','#0000FF','#004080','#000080',
  '#FFFF80','#FFFF00','#FF8040','#FF8000','#804000','#808040',
  '#8080FF','#8000FF','#800080','#400040','#FF00FF',
  '#80FF80','#80FF00','#008040','#008000','#004000','#80C080',
  '#FF80FF','#FF00FF','#800040','#400040','#804080','#A040A0',
  '#00FF00','#80C040','#408000','#004000','#408040','#C0C040',
  '#00FF80','#00C080','#008060','#004040','#004060','#005050',
  '#008080','#00C0C0','#408080','#004080','#000080','#000040',
  '#000000','#404040','#808080','#C0C0C0','#E0E0E0','#FFFFFF',
];

// ─── Component ───────────────────────────────────────────────────────────────

export const ColorPickerModal: React.FC<Props> = ({
  visible,
  onDismiss,
  onApply,
  initialColor = '#5B8DEF',
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(1);
  const [val, setVal] = useState(1);

  const [hexText, setHexText] = useState('');
  const [rText, setRText] = useState('0');
  const [gText, setGText] = useState('0');
  const [bText, setBText] = useState('0');

  const [customColors, setCustomColors] = useState<(string | null)[]>(Array(16).fill(null));
  const [canvasSize, setCanvasSize] = useState({ w: 1, h: 1 });
  const [hueBarWidth, setHueBarWidth] = useState(1);

  // ── Refs to avoid stale closures in PanResponder ─────────────────────────
  const hsvRef = useRef({ hue: 0, sat: 1, val: 1 });
  hsvRef.current = { hue, sat, val };
  const canvasSizeRef = useRef({ w: 1, h: 1 });
  canvasSizeRef.current = canvasSize;
  const hueBarWidthRef = useRef(1);
  hueBarWidthRef.current = hueBarWidth;

  const syncTextFromHsv = useCallback((h: number, s: number, v: number) => {
    const [r, g, b] = hsvToRgb(h, s, v);
    setHexText(rgbToHex(r, g, b));
    setRText(String(r));
    setGText(String(g));
    setBText(String(b));
  }, []);

  useEffect(() => {
    if (!visible) return;
    const rgb = hexToRgb(initialColor);
    if (rgb) {
      const [r, g, b] = rgb;
      const [h, s, v] = rgbToHsv(r, g, b);
      setHue(h); setSat(s); setVal(v);
      syncTextFromHsv(h, s, v);
    }
  }, [visible, initialColor, syncTextFromHsv]);

  const currentHex = (() => {
    const [r, g, b] = hsvToRgb(hue, sat, val);
    return rgbToHex(r, g, b);
  })();

  // ── Canvas PanResponder ──────────────────────────────────────────────────
  const canvasPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const { w, h } = canvasSizeRef.current;
        const { hue: curHue } = hsvRef.current;
        const newSat = Math.max(0, Math.min(1, locationX / w));
        const newVal = Math.max(0, Math.min(1, 1 - locationY / h));
        setSat(newSat); setVal(newVal);
        syncTextFromHsv(curHue, newSat, newVal);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const { w, h } = canvasSizeRef.current;
        const { hue: curHue } = hsvRef.current;
        const newSat = Math.max(0, Math.min(1, locationX / w));
        const newVal = Math.max(0, Math.min(1, 1 - locationY / h));
        setSat(newSat); setVal(newVal);
        syncTextFromHsv(curHue, newSat, newVal);
      },
    })
  ).current;

  // ── Hue PanResponder ─────────────────────────────────────────────────────
  const huePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX } = evt.nativeEvent;
        const { sat: curSat, val: curVal } = hsvRef.current;
        const newHue = Math.max(0, Math.min(359, (locationX / hueBarWidthRef.current) * 360));
        setHue(newHue);
        syncTextFromHsv(newHue, curSat, curVal);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX } = evt.nativeEvent;
        const { sat: curSat, val: curVal } = hsvRef.current;
        const newHue = Math.max(0, Math.min(359, (locationX / hueBarWidthRef.current) * 360));
        setHue(newHue);
        syncTextFromHsv(newHue, curSat, curVal);
      },
    })
  ).current;

  // ── Text handlers ────────────────────────────────────────────────────────
  const handleHexChange = (text: string) => {
    const cleaned = text.startsWith('#') ? text : '#' + text;
    setHexText(cleaned.toUpperCase());
    const rgb = hexToRgb(cleaned);
    if (rgb) {
      const [r, g, b] = rgb;
      const [h, s, v] = rgbToHsv(r, g, b);
      setHue(h); setSat(s); setVal(v);
      setRText(String(r)); setGText(String(g)); setBText(String(b));
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', text: string) => {
    const num = Math.max(0, Math.min(255, parseInt(text) || 0));
    const r = channel === 'r' ? num : parseInt(rText) || 0;
    const g = channel === 'g' ? num : parseInt(gText) || 0;
    const b = channel === 'b' ? num : parseInt(bText) || 0;
    if (channel === 'r') setRText(text);
    if (channel === 'g') setGText(text);
    if (channel === 'b') setBText(text);
    setHexText(rgbToHex(r, g, b));
    const [h, s, v] = rgbToHsv(r, g, b);
    setHue(h); setSat(s); setVal(v);
  };

  const handlePickPreset = (color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return;
    const [r, g, b] = rgb;
    const [h, s, v] = rgbToHsv(r, g, b);
    setHue(h); setSat(s); setVal(v);
    syncTextFromHsv(h, s, v);
  };

  const handleAddCustom = () => {
    setCustomColors(prev => {
      const idx = prev.findIndex(c => c === null);
      if (idx === -1) return [...prev.slice(1), currentHex];
      const next = [...prev];
      next[idx] = currentHex;
      return next;
    });
  };

  const handleApply = () => {
    onApply(currentHex);
    onDismiss();
  };

  const modalWidth = Math.min(width - 24, 420);
  const panelWidth = modalWidth - 48;
  const canvasW = Math.round(panelWidth * 0.54);
  const canvasH = Math.round(canvasW * 0.65);
  const thumbX = sat * canvasSize.w - 8;
  const thumbY = (1 - val) * canvasSize.h - 8;
  const hueThumbX = (hue / 360) * hueBarWidth - 10;

  const surf = theme.colors.surface;
  const onSurf = theme.colors.onSurface;
  const outline = theme.colors.outline;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: surf, width: modalWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Chỉnh sửa màu</Text>
            <TouchableOpacity onPress={onDismiss} hitSlop={8}>
              <X size={22} color={onSurf} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* ── Top row: canvas + right panel ── */}
            <View style={styles.topRow}>
              {/* Gradient canvas */}
              <View
                style={[styles.canvas, { width: canvasW, height: canvasH }]}
                onLayout={(e: LayoutChangeEvent) =>
                  setCanvasSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
                }
                {...canvasPanResponder.panHandlers}
              >
                <Svg width={canvasSize.w} height={canvasSize.h} style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id="satGrad" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
                      <Stop offset="1" stopColor={hueToHex(hue)} stopOpacity="1" />
                    </LinearGradient>
                    <LinearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                      <Stop offset="1" stopColor="#000000" stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  <Rect x="0" y="0" width={canvasSize.w} height={canvasSize.h} fill="url(#satGrad)" />
                  <Rect x="0" y="0" width={canvasSize.w} height={canvasSize.h} fill="url(#valGrad)" />
                </Svg>
                <View
                  pointerEvents="none"
                  style={[
                    styles.thumb,
                    { left: thumbX, top: thumbY, borderColor: val > 0.5 ? '#000' : '#FFF' },
                  ]}
                />
              </View>

              {/* Right panel: preview + hex + RGB */}
              <View style={styles.rightPanel}>
                <View style={[styles.preview, { backgroundColor: currentHex, borderColor: outline }]} />
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: outline}]}>HEX</Text>
                  <RNTextInput
                    value={hexText}
                    onChangeText={handleHexChange}
                    style={[styles.nativeInput, {borderColor: outline, color: onSurf, backgroundColor: surf}]}
                    autoCapitalize="characters"
                    maxLength={7}
                  />
                </View>
                <View style={styles.rgbRow}>
                  {(['r', 'g', 'b'] as const).map(ch => (
                    <View key={ch} style={styles.rgbField}>
                      <Text style={[styles.inputLabel, {color: outline}]}>{ch.toUpperCase()}</Text>
                      <RNTextInput
                        value={ch === 'r' ? rText : ch === 'g' ? gText : bText}
                        onChangeText={t => handleRgbChange(ch, t)}
                        style={[styles.nativeInput, {borderColor: outline, color: onSurf, backgroundColor: surf, textAlign: 'center'}]}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* ── Hue slider ── */}
            <View
              style={[styles.hueBar, { width: panelWidth }]}
              onLayout={e => setHueBarWidth(e.nativeEvent.layout.width)}
              {...huePanResponder.panHandlers}
            >
              <Svg width={panelWidth} height={20} style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id="hueGrad" x1="0" y1="0" x2="1" y2="0">
                    {[0, 60, 120, 180, 240, 300, 360].map((h, i) => (
                      <Stop key={h} offset={`${(i / 6) * 100}%`} stopColor={hueToHex(h)} />
                    ))}
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width={panelWidth} height={20} fill="url(#hueGrad)" rx="4" />
              </Svg>
              <View
                pointerEvents="none"
                style={[styles.hueThumb, { left: hueThumbX, borderColor: outline }]}
              />
            </View>

            {/* ── Basic colours ── */}
            <Text variant="labelLarge" style={styles.sectionLabel}>Màu cơ bản:</Text>
            <View style={styles.palette}>
              {BASIC_COLORS.map((c, i) => (
                <TouchableOpacity
                  key={`${c}-${i}`}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    c.toUpperCase() === currentHex && { borderWidth: 2, borderColor: theme.colors.primary },
                  ]}
                  onPress={() => handlePickPreset(c)}
                />
              ))}
            </View>

            {/* ── Custom colours ── */}
            <View style={styles.customHeader}>
              <Text variant="labelLarge" style={styles.sectionLabel}>Màu tùy chỉnh:</Text>
              <TouchableOpacity style={[styles.addBtn, { borderColor: outline }]} onPress={handleAddCustom}>
                <Text style={{ fontSize: 18, color: onSurf, lineHeight: 22 }}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.palette}>
              {customColors.map((c, i) => (
                <TouchableOpacity
                  key={`custom-${i}`}
                  style={[
                    c
                      ? [styles.colorDot, { backgroundColor: c },
                          c === currentHex && { borderWidth: 2, borderColor: theme.colors.primary }]
                      : styles.emptyDot,
                  ]}
                  onPress={() => c && handlePickPreset(c)}
                />
              ))}
            </View>
          </ScrollView>

          {/* ── Actions ── */}
          <View style={styles.actions}>
            <Button mode="text" onPress={onDismiss}>Hủy</Button>
            <Button mode="contained" onPress={handleApply}>OK</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  canvas: {
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  rightPanel: {
    flex: 1,
    gap: 6,
  },
  preview: {
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  nativeInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },
  rgbRow: {
    flexDirection: 'row',
    gap: 4,
  },
  rgbField: {
    flex: 1,
  },
  hueBar: {
    height: 20,
    borderRadius: 4,
    marginBottom: 16,
    position: 'relative',
    overflow: 'visible',
  },
  hueThumb: {
    position: 'absolute',
    top: -4,
    width: 20,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  emptyDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderStyle: 'dashed',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
});
