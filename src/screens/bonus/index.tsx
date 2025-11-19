import { Dimensions, RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BonusTaskList } from '../../services/bonus.service';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../../hooks/useUser';
import { bonusGradients, fakeBonuses } from '../../constants/bonus';
import BonusCard from '../../components/bonus/BonusCard';
import { Text } from '@ui-kitten/components';
import Skeleton from '../../components/Skeleton';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

const BonusScreen = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useUser();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['bonus-tasks'],
    queryFn: BonusTaskList,
    enabled: isAuthenticated,
  });

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <Text style={styles.headerTitle}>{t('bonus.limited-bonus')}</Text>
      <LinearGradient
        colors={['transparent', '#FFD700', '#FFA500', '#FFD700', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.goldenLine}
      />
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`skeleton-${index}`}
              width={screenWidth - 30}
              height={220}
              borderRadius={12}
            />
          ))
        : (data?.data?.Data ?? fakeBonuses).map((item, index) => (
            <BonusCard
              key={item.id}
              {...item}
              background={bonusGradients[index % bonusGradients.length]}
            />
          ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    padding: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    alignSelf: 'center',
    marginBottom: 10,
  },
  goldenLine: {
    height: 1.5,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default BonusScreen;
