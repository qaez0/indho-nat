import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Modal, Text } from '@ui-kitten/components';
import type { DialogProps } from '.';
import type { Reward } from '../Spin';
import LinearGradient from 'react-native-linear-gradient';

const SpinRewardDialog = ({
  open,
  onClose,
  reward,
}: DialogProps & { reward: Reward }) => {
  const width = Dimensions.get('window').width;
  return (
    <Modal
      visible={open}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClose}
      animationType="fade"
      style={{ width: '100%' }}
    >
      <View style={styles.container}>
        <View style={{ ...styles.illustrationWrapper, width: width * 0.6 }}>
          <Image
            source={require('../../../../assets/lucky-spin/spin/spin-reward.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
          <View style={styles.absoluteTextWrapper}>
            <Text style={styles.amountText}>+PKR {reward?.reward}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ ...styles.actionBtn, width: width * 0.6 }}
          onPress={onClose}
        >
          <LinearGradient
            colors={['#ffdd17', '#f57009']}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text category="h4" style={{ color: '#FFFFFF', fontSize: 16 }}>
              OKAY
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.hintText}>Withdraw money over PKR 1000</Text>
      </View>
    </Modal>
  );
};

export default SpinRewardDialog;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    borderRadius: 16,
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  illustrationWrapper: {
    position: 'relative',
    minHeight: 140,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  absoluteTextWrapper: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
  },
  amountText: {
    textAlign: 'center',
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionBtn: {
    borderRadius: 8,
    minHeight: 44,
    overflow: 'hidden',
  },
  hintText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});
