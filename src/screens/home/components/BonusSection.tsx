import { Dimensions, ScrollView } from 'react-native';
import { useUser } from '../../../hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import {
  BonusTaskList,
  // BonusTaskListNoAuth,
} from '../../../services/bonus.service';
import BonusCard from '../../../components/bonus/BonusCard';
import { bonusGradients, fakeBonuses } from '../../../constants/bonus';
import Skeleton from '../../../components/Skeleton';

const BonusSlider = () => {
  const { isAuthenticated } = useUser();

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['bonus-tasks', isAuthenticated],
    queryFn: BonusTaskList,
    enabled: isAuthenticated,
  });

  const isFetching = isLoading || isRefetching;
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ gap: 8 }}
      showsHorizontalScrollIndicator={false}
    >
      {isFetching
        ? Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={`skeleton-${index}`}
              width={screenWidth - 30}
              height={200}
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

export default BonusSlider;
