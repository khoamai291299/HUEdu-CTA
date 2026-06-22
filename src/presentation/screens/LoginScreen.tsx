/**
 * src/presentation/screens/LoginScreen.tsx
 * Mục đích: Màn hình đăng nhập Demo theo yêu cầu (FR-15).
 * Dependency: react-native, react-native-paper, RootScreenProps.
 */
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image, Keyboard } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { RootScreenProps } from '@presentation/navigation/types';

export const LoginScreen: React.FC<RootScreenProps<'Login'>> = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onDemoLogin = () => {
    Keyboard.dismiss();
    // Chờ 500ms để bàn phím hạ xuống hoàn toàn nhằm tránh lỗi Crash do InputMethodManager của Android 
    // khi phá huỷ màn hình (Fragment) chứa TextInput đang focus bằng react-native-screens.
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.centerContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image 
              source={require('../../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
              HUEdu-CTA
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Ứng dụng giao tiếp AAC cho trẻ
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email / Tài khoản"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              dense
            />
            <TextInput
              label="Mật khẩu"
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              dense
            />
            <Button
              mode="contained"
              onPress={onDemoLogin}
              style={styles.btnMain}
              contentStyle={{ paddingVertical: 4 }}>
              Đăng nhập nhanh
            </Button>
          </View>

          <View style={styles.social}>
            <Text variant="bodySmall" style={styles.socialText}>Hoặc đăng nhập với</Text>
            <View style={styles.socialBtns}>
              <Button mode="outlined" icon="google" onPress={onDemoLogin} style={styles.socialBtn} compact>
                Google
              </Button>
              <Button mode="outlined" icon="facebook" onPress={onDemoLogin} style={styles.socialBtn} compact>
                Facebook
              </Button>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  content: { width: '100%', maxWidth: 360, paddingHorizontal: 16 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 80, height: 80, borderRadius: 20, marginBottom: 12 },
  title: { fontWeight: 'bold' },
  form: { marginBottom: 24 },
  input: { marginBottom: 16, height: 48 },
  btnMain: { marginTop: 8, borderRadius: 8 },
  social: { alignItems: 'center' },
  socialText: { marginBottom: 12, opacity: 0.7 },
  socialBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  socialBtn: { flex: 1 },
});
