import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {OnboardingScreenProps} from '@presentation/navigation/types';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StickFigure} from '@presentation/components/StickFigure';

const TONES = [
  {id: 'tone0', color: '#FFFFFF', label: 'Trắng bạch'},
  {id: 'tone1', color: '#FFDFC4', label: 'Rất sáng'},
  {id: 'tone2', color: '#F0D5BE', label: 'Sáng'},
  {id: 'tone3', color: '#D2996C', label: 'Trung bình sáng'},
  {id: 'tone4', color: '#AB724B', label: 'Trung bình'},
  {id: 'tone5', color: '#8D5524', label: 'Nâu nhạt'},
  {id: 'tone6', color: '#7B4B2A', label: 'Ngăm'},
  {id: 'tone7', color: '#4B3322', label: 'Tối'},
];

export const SkinToneScreen: React.FC<OnboardingScreenProps<'SkinTone'>> = ({navigation}) => {
  const theme = useTheme();
  const {skinTone, setSkinTone} = useOnboardingStore();
  const {width} = useWindowDimensions();

  // Lấy màu da từ tông đã chọn, mặc định trắng nhạt
  const selectedColor = TONES.find(t => t.id === skinTone)?.color ?? '#FFDFC4';
  
  // Tính toán kích thước card để có 4 cột, khoảng cách 12px
  const paddingHorizontal = 24;
  const gap = 12;
  const columns = 4;
  const maxContainerWidth = 360;
  const actualWidth = Math.min(width, maxContainerWidth);
  const availableWidth = actualWidth - (paddingHorizontal * 2) - (gap * (columns - 1));
  const cardSize = Math.min(Math.max(Math.floor(availableWidth / columns), 50), 70);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right']}>
      <View style={styles.centerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text variant="headlineMedium" style={styles.title}>Bé có màu da nào?</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Điều này giúp thay đổi màu da mặc định của các biểu tượng nhân vật.
          </Text>

          <View style={styles.figureWrap}>
            <StickFigure faceColor={selectedColor} />
          </View>
          
          <View style={[styles.grid, {gap}]}>
            {TONES.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.card,
                  {
                    width: cardSize, 
                    height: cardSize,
                    backgroundColor: t.color,
                    borderColor: skinTone === t.id ? theme.colors.primary : '#E0E0E0',
                    borderWidth: skinTone === t.id ? 4 : 1
                  }
                ]}
                onPress={() => setSkinTone(t.id)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="contained" onPress={() => navigation.navigate('Region')} style={styles.nextBtn}>
            Tiếp tục
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, width: '100%', maxWidth: 450, alignSelf: 'center'},
  scrollContent: {padding: 24, paddingBottom: 8, alignItems: 'center'},
  title: {textAlign: 'center', fontWeight: 'bold', marginBottom: 12},
  subtitle: {textAlign: 'center', marginBottom: 24, opacity: 0.7},
  figureWrap: {alignItems: 'center', marginBottom: 24},
  grid: {flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', width: '100%'},
  card: {borderRadius: 12},
  footer: {paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12},
  nextBtn: {paddingVertical: 6},
});
