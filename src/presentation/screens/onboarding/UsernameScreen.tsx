import React, {useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {Text, Button, TextInput, useTheme} from 'react-native-paper';
import {OnboardingScreenProps} from '@presentation/navigation/types';
import {useOnboardingStore} from '@presentation/stores/useOnboardingStore';
import {useChildStore} from '@presentation/stores/useChildStore';
import {useSettingsStore} from '@presentation/stores/useSettingsStore';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Alert} from 'react-native';
import {AppThemeName} from '@core/theme';

export const UsernameScreen: React.FC<OnboardingScreenProps<'Username'>> = ({navigation}) => {
  const theme = useTheme();
  const {
    skinTone, region, diagnosis, birthYear, themeColor, voiceId, username, setUsername
  } = useOnboardingStore();
  const {add} = useChildStore();
  const {setVoice, setTheme, setIsOnboarded} = useSettingsStore();
  const [name, setName] = useState(username || '');

  const handleComplete = async () => {
    if (!name.trim()) return;

    try {
      // Save the child profile
      await add({
        name: name.trim(),
        skinTone,
        region,
        diagnosis,
        birthYear,
      });

      // Save app settings
      if (themeColor) {
        // NOTE: useAppTheme will now read this from settings
        await setTheme(themeColor as AppThemeName);
      }
      
      await setVoice(voiceId);
      setUsername(name.trim());
      await setIsOnboarded(true);

      // Navigate to Main
      navigation.replace('Main');
    } catch (e: any) {
      console.error('Lỗi khi hoàn tất Onboarding:', e);
      Alert.alert('Có lỗi xảy ra', typeof e === 'object' ? e?.message || String(e) : String(e));
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <View style={styles.centerContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>Tên của trẻ là gì?</Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Tên này sẽ hiển thị trên ứng dụng.
              </Text>
            </View>
            
            <TextInput
              mode="outlined"
              label="Tên trẻ"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoFocus
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button onPress={() => navigation.goBack()}>Quay lại</Button>
            <Button 
              mode="contained" 
              onPress={handleComplete} 
              disabled={!name.trim()}
            >
              Hoàn thành
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center'},
  scrollContent: {flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center'},
  header: {marginBottom: 32},
  title: {textAlign: 'center', fontWeight: 'bold', marginBottom: 8},
  subtitle: {textAlign: 'center', opacity: 0.7},
  input: {marginBottom: 20},
  footer: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12},
});
