import { Text } from '@ui-kitten/components';
import WinnerContainer from './WinnerContainer';
import { useTranslation } from 'react-i18next';
import { ImageBackground, ScrollView, View } from 'react-native';

const DailyDeposit = () => {
  const { t } = useTranslation();
  return (
    <ImageBackground
      source={require('../../../assets/wheel/bg_clouds.png')}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        marginTop: 20,
        width: '100%',
        height: 400,
        justifyContent: 'flex-end',
        position: 'relative',
      }}
      resizeMode="contain"
    >
      <View style={{ paddingBottom: 20, height: 320, }}>
        <Text
          category="h4"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            textAlign: 'center',
            fontSize: 20,
            color: '#000',
          }}
        >
          {t('wheel.daily-deposit.title')}
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 4, color: '#000' }}>
          {t('wheel.daily-deposit.description')}
        </Text>
        <WinnerContainer />
      </View>
    </ImageBackground>
  );
};

export default DailyDeposit;
