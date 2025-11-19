import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { BonusTask } from '../../types/bonus';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Text } from '@ui-kitten/components';
import { imageHandler } from '../../utils/image-url';
import { useEffect, useState } from 'react';
import { useBonusDetailModal } from './Bonus';
import { useMutation } from '@tanstack/react-query';
import { BonusTaskClaim } from '../../services/bonus.service';
import { queryClient } from '../../App';
import { useUser } from '../../hooks/useUser';
import Toast from 'react-native-toast-message';
import { useAuthModal } from '../../store/useUIStore';
import { useTranslation } from 'react-i18next';

const BonusCard = (props: BonusTask & { background: string[] }) => {
  const { isAuthenticated } = useUser();
  const { t } = useTranslation();
  const openAuthModal = useAuthModal(state => state.openDialog);
  const { title, bonus_type, background, status, reward, time_remaining } =
    props;
  const initialTime = Math.round(Number(time_remaining) ?? 7821059);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const screenWidth = Dimensions.get('window').width;
  const toggleBonusDetailModal = useBonusDetailModal(
    state => state.toggleVisible,
  );

  function formatTime(seconds: number) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return { days, hours, minutes, secs };
  }

  const time = formatTime(timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const { mutateAsync: claimBonus } = useMutation({
    mutationFn: () => {
      return BonusTaskClaim(props.id);
    },
    onMutate: () => {
      Toast.show({
        text1: 'Claiming bonus...',
        type: 'promise',
        autoHide: false,
      });
    },
    onSuccess: () => {
      Toast.hide();
      Toast.show({
        text1: 'Bonus claimed successfully',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['bonus-tasks'] });
    },
    onError: (error: any) => {
      const message = JSON.parse(error?.message)?.message;
      Toast.hide();
      Toast.show({
        text1: message ?? 'Failed to claim bonus',
        type: 'error',
      });
    },
  });

  return (
    <LinearGradient
      colors={background}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[{ width: screenWidth - 30 }, styles.bonusCard]}
    >
      <View style={styles.bonusTypePart}>
        <Text
          category="p1"
          style={{
            color: '#fff',
          }}
        >
          {bonus_type === 2 ? 'Casino' : bonus_type}
        </Text>
      </View>
      <View style={styles.welcomeBonusPart}>
        <Text
          category="h5"
          style={{
            paddingHorizontal: 10,
            paddingTop: 20,
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
            width: 110,
            height: 100,
          }}
        />
      </View>
      <View style={styles.bonusDetailsPart}>
        <View style={styles.bonusDetailsPartLeft}>
          <Text category="s1" style={{ fontWeight: 'bold', fontSize: 18 }}>
            Rs {reward}
          </Text>
          <Text category="c2" style={{ color: '#000', fontSize: 10 }}>
            REWARD
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            gap: 15,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          {[
            { label: 'DAYS', value: time.days },
            { label: 'HRS', value: time.hours },
            { label: 'MIN', value: time.minutes },
            { label: 'SEC', value: time.secs },
          ].map(item => (
            <View
              key={item.label}
              style={{ flexDirection: 'column', alignItems: 'center', gap: 2 }}
            >
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 2,
                }}
              >
                <Text
                  category="s1"
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  {item.value}
                </Text>

                {item.label !== 'SEC' && (
                  <Text
                    category="s1"
                    style={{
                      color: '#000',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                  >
                    :
                  </Text>
                )}
              </View>
              <Text
                category="c2"
                style={{
                  color: '#000',
                  fontSize: 10,
                }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          appearance="filled"
       //  disabled={false}
         disabled={status !== 'CLAIMABLE'} 
         style={{ 
            ...styles.buttonStyle,
  
         //  backgroundColor: status === 'CLAIMABLE' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
           backgroundColor: status === 'CLAIMABLE' ? '#FFFFFF' : 'rgba(51, 51, 51, 0.3)',
          }}
          onPress={() => {
            if (!isAuthenticated) {
              openAuthModal();
            } else {
              claimBonus();
            }
          }}
        >
              {(evaProps: any) => (
            <Text 
              {...evaProps} 
              style={{
                color: status === 'CLAIMABLE' ? '#333333' : '#FFFFFF',
                fontWeight:status === 'CLAIMABLE' ? 'bold' : 'normal',
             
              }}
            >
              {t('bonus.claim')}
            </Text>
          )}
        </Button>
        <Button
          appearance="filled"
          style={styles.buttonStyle}
          onPress={() => toggleBonusDetailModal(props)}
        >
          {t('bonus.details')}
        </Button>
      </View>
    </LinearGradient>
  );
};

export default BonusCard;

const styles = StyleSheet.create({
  bonusCard: {
    borderRadius: 12,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  welcomeBonusPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonusTypePart: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomRightRadius: 12,
  },
  bonusDetailsPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  bonusDetailsPartLeft: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  buttonStyle: {
    paddingVertical: 10,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 0,
  },
});
