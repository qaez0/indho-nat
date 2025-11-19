import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Modal, Text } from '@ui-kitten/components';
import type { DialogProps } from '.';
import LinearGradient from 'react-native-linear-gradient';

const SpinRewardDialog = ({
  open,
  onClose,
  total_received_reward,
}: // recent_reward,
DialogProps & {
  total_received_reward: number;
  recent_reward: number;
}) => {
  return (
    <Modal
      visible={open}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClose}
    >
      <View style={styles.container}>
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('../../../../assets/lucky-spin/spin/cash-out.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
          <View style={styles.absoluteTextWrapper}>
            <Text style={styles.amountText}>
              +PKR {(1000 - total_received_reward).toFixed(2)}
              {'\n'}more to go
            </Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((total_received_reward / 1000) * 100).toFixed(
                  2,
                )}%` as any,
              },
            ]}
          />
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            Only{' '}
            <Text style={styles.progressHighlight}>
              PKR {(1000 - total_received_reward).toFixed(2)}
            </Text>{' '}
            to go
          </Text>
          <Text style={styles.progressLabel}>
            {((total_received_reward / 1000) * 100).toFixed(2)}%
          </Text>
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
          <LinearGradient
            colors={['#ffdd17', '#f57009']}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text category="h4" style={{ color: '#FFFFFF', fontSize: 16 }}>
              Get Help from Friends
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SpinRewardDialog;

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.8)' },
  container: {
    width: 320,
    borderRadius: 16,
    padding: 16,
  },
  illustrationWrapper: { height: 260, position: 'relative' },
  illustration: { width: '100%', height: '100%' },
  absoluteTextWrapper: { position: 'absolute', top: 120, left: 0, right: 0 },
  amountText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#FF4D00',
    lineHeight: 22,
  },
  progressTrack: {
    height: 8,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F2272C',
    borderRadius: 100,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabel: { color: '#FFFFFF', fontSize: 12 },
  progressHighlight: { color: '#FFE552', fontWeight: '600', fontSize: 14 },
  actionBtn: {
    borderRadius: 8,
    minHeight: 44,
    marginTop: 12,
    overflow: 'hidden',
  },
});
