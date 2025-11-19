import { Modal, Text } from '@ui-kitten/components';
import LottieView from 'lottie-react-native';
import lottieJson from '../../assets/loader.json';
import { useGlobalLoader } from '../../store/useUIStore';
import { View } from 'react-native';

const Loader = () => {
  const isOpen = useGlobalLoader(state => state.isOpen);
  const message = useGlobalLoader(state => state.message);
  const closeLoader = useGlobalLoader(state => state.closeLoader);

  return (
    <Modal
      animationType="fade"
      visible={isOpen}
      onBackdropPress={closeLoader}
      backdropStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: 15,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: 12,
            gap: 8,
            backgroundColor: 'transparent',
          }}
        >
          <LottieView
            source={lottieJson}
            autoPlay
            loop
            style={{
              width: 100,
              height: 'auto',
              aspectRatio: 1,
              marginVertical: -30,
            }}
          />
          <Text
            category="p2"
            style={{
              fontWeight: '700',
              color: 'white',
              fontStyle: 'italic',
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
