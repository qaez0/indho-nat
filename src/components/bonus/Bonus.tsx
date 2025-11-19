import { Modal, Text } from '@ui-kitten/components';
import { create } from 'zustand';
import { BonusTask } from '../../types/bonus';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
import { imageHandler } from '../../utils/image-url';
import { useTranslation } from 'react-i18next';

interface StatsContainerProps {
  statTitle: string;
  value: string | number;
  isSmallScreen: boolean;
}

const StatsContainer = ({ statTitle, value, isSmallScreen }: StatsContainerProps) => {
  return (
    <View style={styles.statsContainer}>
      <Text category="s1" style={{ fontSize: isSmallScreen ? 13 : 14 }}>
        {statTitle}
      </Text>
      <Text category="s1" style={{ fontSize: isSmallScreen ? 13 : 14 }}>
        {value}
      </Text>
    </View>
  );
};

const Bonus = () => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const isSmallScreen = width < 380;
  const visible = useBonusDetailModal(state => state.visible);
  const toggleVisible = useBonusDetailModal(state => state.toggleVisible);
  const bonus = useBonusDetailModal(state => state.bonus);
  const {
    background,
    title,
    total_bet_amount,
    total_deposit_amount,
    remaing_coupons,
    reward,
    goal_bet,
    goal_deposit,
  } = bonus ?? {};

  const stats = [
    {
      title: t('bonus.betting-goal'),
      value: ` ${total_bet_amount ?? 0}/${goal_bet ?? 0}`,
    },
    {
      title: t('bonus.deposit-goal'),
      value: ` ${total_deposit_amount ?? 0}/${goal_deposit ?? 0}`,
    },
    { title: t('bonus.reward-amount'), value: `Rs ${reward ?? 0}` },
    { title: t('bonus.claim-remaining'), value: remaing_coupons ?? 0 },
  ];

  return (
    <Modal
      visible={visible && bonus !== null}
      animationType="fade"
      onBackdropPress={() => toggleVisible()}
      backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      style={styles.modal}
      hardwareAccelerated={true}
    >
      <View style={[styles.container, { padding: isSmallScreen ? 12 : 16 }]}>
        <View
          style={[styles.header, { paddingVertical: isSmallScreen ? 12 : 16 }]}
        >
          <Text
            category="h5"
            style={{ fontSize: isSmallScreen ? 18 : 20, fontWeight: 'bold' }}
          >
            {t('bonus.bonus-details')}
          </Text>
          <TouchableOpacity
            onPress={() => toggleVisible()}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 16 }}>
          <LinearGradient
            colors={background ?? []}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.headerImageContainer,
              {
                paddingHorizontal: isSmallScreen ? 12 : 16,
                paddingVertical: isSmallScreen ? 8 : 0,
              },
            ]}
          >
            <Text
              category="h5"
              style={{
                fontSize: isSmallScreen ? 16 : 18,
                fontWeight: 'bold',
                width: '50%',
               
              }}
            >
              {title}
            </Text>
            <Image
              source={{
                uri: imageHandler(
                  '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/bonus-avatar/public',
                ),
              }}
              style={{
                width: isSmallScreen ? 90 : 110,
                height: isSmallScreen ? 80 : 100,
              }}
            />
          </LinearGradient>
          <View
            style={[styles.baseContainer, { padding: isSmallScreen ? 12 : 16 }]}
          >
            <Text
              category="s1"
              style={[
                styles.descriptionText,
                {
                
                  textAlign: 'justify',
                  paddingHorizontal: 10,
                  alignSelf: 'center',
                  fontSize: isSmallScreen ? 13 : 14,
                  lineHeight: isSmallScreen ? 18 : 20,
                  flexShrink: 1,
                },
              ]}
            >
              {t('bonus.claim-description', { title })}
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            {stats.map((stat, index) => (
              <View
                key={index}
                style={{
                  ...styles.baseContainer,
                  borderRadius: 12,
                  padding: 0,
                  paddingVertical: isSmallScreen ? 8 : 10,
                  paddingHorizontal: isSmallScreen ? 12 : 16,
                }}
              >
                <StatsContainer statTitle={stat.title} value={stat.value ?? ''} isSmallScreen={isSmallScreen} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Bonus;

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    zIndex: 1000,
  },
  container: {
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: 'rgb(23, 23, 23)',
  },
  header: {
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
  },
  headerImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  baseContainer: {
    backgroundColor: '#262626',
    borderRadius: 10,
    display: 'flex',
  },
  descriptionText: {
    lineHeight: 20,
    textAlign: 'justify',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    gap: 2,
    borderColor: '#FFFFFF40',
  },
});

interface IBonusDetailModalState {
  visible: boolean;
  bonus?: (BonusTask & { background: string[] }) | null;
  toggleVisible: (bonus?: BonusTask & { background: string[] }) => void;
}

export const useBonusDetailModal = create<IBonusDetailModalState>(set => ({
  visible: false,
  toggleVisible: (bonus?: BonusTask & { background: string[] }) =>
    set(state => ({ visible: !state.visible, bonus: bonus ?? null })),
}));
