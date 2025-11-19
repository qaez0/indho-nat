import {
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import { Text, Button } from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
interface IStatusData {
  title: string;
  image: number;
  description: string;
}
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../hooks/useUser';
import { RootStackNav } from '../../../types/nav';

const StatusUpdate = ({ title, image, description }: IStatusData) => {
  const navigation = useNavigation<RootStackNav>();
  const { t } = useTranslation();
  const { isRefetching, invalidate } = useUser();

  const renderIcon = () => (
    <View style={{ paddingLeft: 15 }}>
      <Feather name="arrow-left" size={16} color="#000" />
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching.panelInfo}
          onRefresh={() => invalidate('panel-info')}
        />
      }
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#2a2927',
          padding: 15,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image source={image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Button
        status="success"
        style={styles.button}
        accessoryLeft={renderIcon}
        onPress={() =>
          navigation.navigate('main-tabs', {
            screen: 'tabs',
            params: {
              screen: 'home',
            },
          })
        }
      >
        {t('kyc.back-to-home')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    maxWidth: 500,
    marginTop: 30,
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
});

export default StatusUpdate;
