/**
 * src/presentation/screens/SplashScreen.tsx
 * Mục đích: Màn khởi động - chạy bootstrap (useAppInit), hiển thị logo + spinner,
 *           điều hướng sang Main khi sẵn sàng, báo lỗi nếu thất bại.
 * Dependency: useAppInit, StatusView, RootScreenProps, react-native-paper.
 */
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {MessageCircleHeart} from 'lucide-react-native';
import {useAppInit} from '@presentation/hooks/useAppInit';
import {ErrorView, LoadingView} from '@presentation/components/StatusView';
import {RootScreenProps} from '@presentation/navigation/types';

export const SplashScreen: React.FC<RootScreenProps<'Splash'>> = ({
  navigation,
}) => {
  const {ready, error} = useAppInit();

  useEffect(() => {
    if (ready) {
      navigation.replace('Login');
    }
  }, [ready, navigation]);

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <View style={styles.container}>
      <MessageCircleHeart size={160} color="#5B8DEF" />
      <Text variant="displayMedium" style={styles.title}>
        HUEdu-CTA
      </Text>
      <View style={styles.loader}>
        <LoadingView />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {marginTop: 16, fontWeight: '700'},
  loader: {position: 'absolute', bottom: 80},
});
