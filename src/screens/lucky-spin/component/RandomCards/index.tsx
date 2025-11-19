import { useEffect, useReducer } from 'react';
import Congratulations from './Congratulations';
import PickOneCard from './PickOneCard';
import { useLuckySpin } from '../../useLuckySpin';
import { useQuery } from '@tanstack/react-query';
import {
  Image,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FadeSlideInView from '../../animations/FadeSlideInView';

export interface Reward {
  envelope_number: number;
  reward_amount: number;
  selected: boolean;
}
interface IRandomCardsProps {
  onClickWithdraw: (reward: Reward) => void;
}

interface State {
  flippedCards: { [key: number]: boolean };
  selectedCard: Reward | null;
  unFlipRemain: boolean;
  showCongratulation: boolean;
}

type Action =
  | { type: 'SELECT_CARD'; payload: { reward: Reward; index: number } }
  | { type: 'FLIP_REMAINING_CARDS' }
  | { type: 'SHOW_CONGRATULATION' };

const initialState: State = {
  flippedCards: {},
  selectedCard: null,
  unFlipRemain: false,
  showCongratulation: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: action.payload.reward,
        flippedCards: {
          ...state.flippedCards,
          [action.payload.index]: !state.flippedCards[action.payload.index],
        },
      };
    case 'FLIP_REMAINING_CARDS': {
      const newFlippedCards = { ...state.flippedCards };
      [...Array(6)].forEach((_, i) => {
        if (!newFlippedCards[i]) {
          newFlippedCards[i] = true;
        }
      });
      return {
        ...state,
        flippedCards: newFlippedCards,
        unFlipRemain: true,
      };
    }
    case 'SHOW_CONGRATULATION':
      return {
        ...state,
        showCongratulation: true,
      };
    default:
      return state;
  }
}

const RandomCards = ({ onClickWithdraw }: IRandomCardsProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { selectedCard, unFlipRemain, showCongratulation } = state;
  const { eventDetails, refetchEventDetails, getEnvelopeSetting } =
    useLuckySpin();

  const handleCardClick = (reward: Reward, index: number) => {
    if (selectedCard === null) {
      dispatch({ type: 'SELECT_CARD', payload: { reward, index } });
      refetchEventDetails();
    }
  };

  const { data: envelopeSetting } = useQuery({
    queryKey: ['lucky-spin-envelope-count'],
    queryFn: getEnvelopeSetting,
  });

  useEffect(() => {
    let timer: number;
    if (selectedCard !== null) {
      timer = setTimeout(() => {
        dispatch({ type: 'FLIP_REMAINING_CARDS' });
      }, 1000);
    }
    if (unFlipRemain) {
      timer = setTimeout(() => {
        dispatch({ type: 'SHOW_CONGRATULATION' });
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [selectedCard, unFlipRemain]);

  const logo = require('../../../../assets/lucky-spin/random-cards/logo-wheel.png');
  const { width, height } = Image.resolveAssetSource(logo);
  const { width: windowWidth } = useWindowDimensions();
  const desiredWidth = windowWidth;
  const desiredHeight = (height / width) * desiredWidth;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FadeSlideInView delayMs={200}>
        <Image
          source={logo}
          style={{
            width: desiredWidth,
            height: desiredHeight,
          }}
          resizeMode="contain"
        />
      </FadeSlideInView>

      {showCongratulation ? (
        <Congratulations
          onClickWithdraw={() => selectedCard && onClickWithdraw(selectedCard)}
          rewardAmount={selectedCard?.reward_amount || 0}
          eventStartTime={eventDetails?.eventInfo?.event_start_time || ''}
          eventEndTime={eventDetails?.eventInfo?.event_end_time || ''}
        />
      ) : envelopeSetting ? (
        <PickOneCard
          {...state}
          onCardClick={handleCardClick}
          numberOfCards={
            (envelopeSetting as any)?.data?.[0]?.max_envelope_count || 6
          }
        />
      ) : null}
    </ScrollView>
  );
};

export default RandomCards;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
