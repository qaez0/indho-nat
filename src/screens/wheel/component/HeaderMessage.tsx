import { Text } from '@ui-kitten/components';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Logo from '../../../assets/logo.svg';
import LinearGradient from 'react-native-linear-gradient';

const HeaderMessage = () => {
  const { t } = useTranslation();

  return (
           // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flexDirection: 'column', gap: 12, padding: 12 }}>
      <LinearGradient
        colors={['#F1B563', '#BF7A1C']}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ borderRadius: 8, padding: 15 }}
      >
        
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

 <Image source={require('../../../assets/common/wheel/rules-logo.png')} style={{ width: 24, height: 24 , marginRight: 10}} />
       
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#000' }}>
            {t('wheel.header-message.title')}
          </Text>
        </View>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: '#000',
            marginTop: 8,
          }}
        >
          {t('wheel.header-message.description')}
        </Text>
      </LinearGradient>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFFFFF' }}>
          {t('wheel.header-message.thank-you-for-joining')}
        </Text>
        <Logo />
      </View>
    </View>
  );
};

export default HeaderMessage;
