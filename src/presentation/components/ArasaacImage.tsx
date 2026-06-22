import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {HelpCircle} from 'lucide-react-native';
import {translateText} from '@core/utils/translate';

interface ArasaacImageProps {
  keyword: string;
  bgColor?: string;
  size?: number;
}

export const ArasaacImage: React.FC<ArasaacImageProps> = ({
  keyword,
  bgColor,
  size = 100,
}) => {
  const theme = useTheme();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      if (!keyword) {
        setLoading(false);
        return;
      }
      try {
        let searchWord = keyword.toLowerCase();
        
        // Translate to English because ARASAAC doesn't support 'vi' natively via API easily
        const englishWord = await translateText(searchWord, 'vi', 'en');
        if (englishWord) {
          searchWord = englishWord.toLowerCase();
        }

        const encoded = encodeURIComponent(searchWord);
        const res = await fetch(`https://api.arasaac.org/api/pictograms/en/search/${encoded}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        if (data && data.length > 0 && isMounted) {
          const id = data[0]._id;
          setImageUrl(`https://static.arasaac.org/pictograms/${id}/${id}_300.png`);
        }
      } catch (e) {
        // Ignore errors, just show fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setLoading(true);
    setImageUrl(null);
    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [keyword]);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: bgColor || theme.colors.surfaceVariant,
          borderColor: theme.colors.outline,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : (
        <>
          <Text
            variant="titleMedium"
            numberOfLines={1}
            style={{fontWeight: 'bold', marginBottom: 4, color: '#000'}}>
            {keyword}
          </Text>
          <HelpCircle size={size * 0.4} color="#555" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
