import { useState } from 'react';
import type { Reward } from '.';
import { useLuckySpin } from '../../useLuckySpin';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import FlipCard from '../../animations/FlipCard';
import FadeSlideInView from '../../animations/FadeSlideInView';

const NUM_COLUMNS = 3;
const GRID_GAP = 10;
const GRID_PADDING = 12;

interface PickOneCardProps {
  onCardClick: (reward: Reward, index: number) => void;
  flippedCards: { [key: number]: boolean };
  selectedCard: Reward | null;
  unFlipRemain: boolean;
  numberOfCards: number;
}

const PickOneCard = ({
  onCardClick,
  flippedCards,
  selectedCard,
  unFlipRemain,
  numberOfCards,
}: PickOneCardProps) => {
  const { pickEnvelope } = useLuckySpin();
  const [assignedRewards, setAssignedRewards] = useState<Reward[]>([]);
  const { width: windowWidth } = useWindowDimensions();

  // Compute card aspect ratio based on the front card asset
  const frontCard = require('../../../../assets/lucky-spin/random-cards/card-active.png');
  const { width: cardImgW, height: cardImgH } =
    Image.resolveAssetSource(frontCard);
  const cardAspectRatio = cardImgH / cardImgW;

  // Derive card height accurately from screen width with fixed 3 columns
  const itemWidth = Math.floor(
    (windowWidth - GRID_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
      NUM_COLUMNS,
  );
  const cardWidth = itemWidth;
  const cardHeight = Math.round(cardWidth * cardAspectRatio);

  const getGridItemStyle = (index: number) => {
    const isEndOfRow = (index + 1) % NUM_COLUMNS === 0;
    return {
      width: itemWidth,
      marginRight: isEndOfRow ? 0 : GRID_GAP,
      marginBottom: GRID_GAP,
    } as const;
  };
  const handleOnCardClick = async (index: number) => {
    const envelopeNumber = index + 1;
    try {
      const response = await pickEnvelope(envelopeNumber);
      if (response.data) {
        setAssignedRewards(response.data);
        const selectedReward = response.data.find(
          (reward: Reward) => reward.envelope_number === envelopeNumber,
        );
        if (selectedReward) {
          onCardClick(selectedReward, index);
        }
      }
    } catch (error) {
      // Error handled silently
    }
  };

  return (
    <FadeSlideInView>
      <View style={styles.headerRow}>
        <Image
          source={require('../../../../assets/lucky-spin/random-cards/arrow-guide.png')}
          style={styles.arrowGuide}
          resizeMode="contain"
        />
        <Text category="s1" style={styles.headerTitle}>
          PICK ONE CARD
        </Text>
        <Image
          source={require('../../../../assets/lucky-spin/random-cards/arrow-guide.png')}
          style={[styles.arrowGuide, { transform: [{ rotate: '180deg' }] }]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.gridContainer}>
        {Array.from({ length: numberOfCards }).map((_, index: number) => {
          const isPlaceholder = index >= numberOfCards;
          const isSelectedCard =
            selectedCard?.envelope_number ===
            assignedRewards[index]?.envelope_number;
          const isFlipped = isPlaceholder
            ? false
            : Boolean(flippedCards[index]);
          return (
            <View
              key={index}
              style={[styles.gridItem, getGridItemStyle(index)]}
            >
              <View style={styles.cardWrapper}>
                <FlipCard
                  isFlipped={isFlipped}
                  height={cardHeight}
                  front={
                    <Image
                      source={frontCard}
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  }
                  back={
                    <View style={styles.flex1}>
                      <Image
                        source={
                          isSelectedCard
                            ? require('../../../../assets/lucky-spin/random-cards/card-win.png')
                            : unFlipRemain
                            ? require('../../../../assets/lucky-spin/random-cards/card-other-rewards.png')
                            : require('../../../../assets/lucky-spin/random-cards/card-disabled.png')
                        }
                        style={styles.cardImage}
                        resizeMode="contain"
                      />
                      {(isSelectedCard ||
                        (unFlipRemain && !isSelectedCard)) && (
                        <View style={styles.rewardLabelWrapper}>
                          <Text
                            category="s1"
                            style={[
                              styles.rewardLabel,
                              isSelectedCard
                                ? styles.rewardLabelActive
                                : styles.rewardLabelDim,
                            ]}
                          >
                            {assignedRewards[index]?.reward_amount}
                          </Text>
                        </View>
                      )}
                    </View>
                  }
                />
                {!selectedCard && (
                  <View
                    style={StyleSheet.absoluteFill}
                    pointerEvents="box-none"
                  >
                    <View style={styles.flex1} />
                  </View>
                )}
                <View
                  style={StyleSheet.absoluteFill}
                  pointerEvents={
                    selectedCard || isPlaceholder ? 'none' : 'auto'
                  }
                >
                  <View
                    style={styles.flex1}
                    onTouchEnd={() => !selectedCard && handleOnCardClick(index)}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </FadeSlideInView>
  );
};

export default PickOneCard;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#FFE8D3',
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    paddingVertical: GRID_PADDING,
  },
  gridItem: {
    // width is computed dynamically per item
  },
  cardWrapper: {},
  cardImage: {
    width: '100%',
    height: '100%',
  },
  rewardLabelWrapper: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  rewardLabel: {
    color: '#FFE8D3',
    fontWeight: 'bold',
  },
  rewardLabelActive: {
    textShadowColor: '#FF4D01',
    textShadowRadius: 10,
  },
  rewardLabelDim: {
    opacity: 0.4,
  },
  arrowGuide: {
    width: 100,
    height: 20,
  },
  flex1: {
    flex: 1,
  },
});
