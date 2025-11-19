import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  ViewStyle,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Logo from '../../../assets/logo.svg';

interface IDraggableBubble {
  width: number;
  height: number;
  style?: ViewStyle;
  onPopoverAction?: (action: 'deposit' | 'quit') => void;
}

const BUBBLE_SIZE = 60;
const PADDING = 20;
const BOTTOM_SAFE_AREA = 40;

export default function DraggableBubble({
  width,
  height,
  style,
  onPopoverAction,
}: IDraggableBubble) {
  const position = useRef(
    new Animated.ValueXY({ x: PADDING, y: height / 2 }),
  ).current;
  const last = useRef({ x: PADDING, y: height / 2 });
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [popoverSide, setPopoverSide] = useState<'left' | 'right'>('right');
  const [arrowPosition, setArrowPosition] = useState(0);
  const popoverAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = position.addListener(v => {
      last.current = v;
    });
    return () => position.removeListener(id);
  }, [position]);

  useEffect(() => {
    const x = clamp(last.current.x, PADDING, width - BUBBLE_SIZE - PADDING);
    const y = clamp(
      last.current.y,
      PADDING,
      height - BUBBLE_SIZE - PADDING - BOTTOM_SAFE_AREA,
    );
    position.setOffset({ x: 0, y: 0 });
    position.setValue({ x, y });
    last.current = { x, y };
  }, [width, height, position]);

  useEffect(() => {
    if (showPopover) {
      Animated.spring(popoverAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(popoverAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showPopover, popoverAnimation]);


  const handleBubblePress = () => {
    const currentX = last.current.x;
    const currentY = last.current.y;

    const isOnLeftSide = currentX < width / 2;
    const side = isOnLeftSide ? 'right' : 'left';

    const popoverWidth = 150;
    const popoverHeight = 120;

    let popoverX: number;
    let popoverY: number;

    if (side === 'right') {
      popoverX = currentX + BUBBLE_SIZE + 10;
      popoverY = currentY + BUBBLE_SIZE / 2 - popoverHeight / 2;
    } else {
      popoverX = currentX - popoverWidth - 10;
      popoverY = currentY + BUBBLE_SIZE / 2 - popoverHeight / 2;
    }

    // Ensure popover stays within screen bounds
    popoverX = Math.max(
      PADDING,
      Math.min(popoverX, width - popoverWidth - PADDING),
    );
    popoverY = Math.max(
      PADDING,
      Math.min(popoverY, height - popoverHeight - PADDING - BOTTOM_SAFE_AREA),
    );

    const bubbleCenterY = currentY + BUBBLE_SIZE / 2;
    const popoverTop = popoverY;
    const arrowY = bubbleCenterY - popoverTop;
    const clampedArrowY = Math.max(20, Math.min(arrowY, popoverHeight - 20));

    setPopoverSide(side);
    setPopoverPosition({ x: popoverX, y: popoverY });
    setArrowPosition(clampedArrowY);
    setShowPopover(!showPopover);
  };

  const hidePopover = () => {
    setShowPopover(false);
  };

  const createPanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !showPopover,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (showPopover) return false;
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },

      onPanResponderGrant: () => {
        position.setOffset({ x: last.current.x, y: last.current.y });
        position.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false },
      ),

      onPanResponderRelease: (_, gestureState) => {
        position.flattenOffset();

        const current = last.current;

        const isTap =
          Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;

        if (isTap) {
          handleBubblePress();
        }

        const snapToRight = current.x + BUBBLE_SIZE / 2 > width / 2;
        const targetX = snapToRight ? width - BUBBLE_SIZE - PADDING : PADDING;

        const targetY = clamp(
          current.y,
          PADDING,
          height - BUBBLE_SIZE - PADDING - BOTTOM_SAFE_AREA,
        );

        Animated.spring(position, {
          toValue: { x: targetX, y: targetY },
          useNativeDriver: false,
          speed: 15,
          bounciness: 8,
        }).start();
      },

      onPanResponderTerminate: () => {
        position.flattenOffset();
        const current = last.current;
        const snapToRight = current.x + BUBBLE_SIZE / 2 > width / 2;
        const targetX = snapToRight ? width - BUBBLE_SIZE - PADDING : PADDING;
        const targetY = clamp(
          current.y,
          PADDING,
          height - BUBBLE_SIZE - PADDING - BOTTOM_SAFE_AREA,
        );
        Animated.spring(position, {
          toValue: { x: targetX, y: targetY },
          useNativeDriver: false,
          speed: 15,
          bounciness: 8,
        }).start();
      },
    });
  };

  const panResponder = createPanResponder();

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.bubbleContainer,
          style,
          { transform: position.getTranslateTransform() },
        ]}
      >
        <View style={styles.bubbleBorder} />
        <View style={styles.bubble}>
          <Logo width={32} height={32} />
        </View>
      </Animated.View>

      {showPopover && (
        <>
          <TouchableWithoutFeedback onPress={hidePopover}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.popover,
              {
                left: popoverPosition.x,
                top: popoverPosition.y,
                opacity: popoverAnimation,
                transform: [
                  {
                    scale: popoverAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                  {
                    translateX: popoverAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: popoverSide === 'right' ? [-10, 0] : [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.popoverContent}>
              <TouchableOpacity
                style={styles.popoverItem}
                onPress={() => {
                  onPopoverAction?.('deposit');
                  setShowPopover(false);
                }}
              >
                <Text style={styles.popoverText}>Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popoverItem}
                onPress={() => {
                  onPopoverAction?.('quit');
                  setShowPopover(false);
                }}
              >
                <Text style={styles.popoverText}>Quit</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.popoverArrow,
                popoverSide === 'right'
                  ? styles.popoverArrowLeft
                  : styles.popoverArrowRight,
                { top: arrowPosition },
              ]}
            />
          </Animated.View>
        </>
      )}
    </>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bubbleContainer: {
    width: BUBBLE_SIZE ,
    height: BUBBLE_SIZE,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  bubbleBorder: {
    width: BUBBLE_SIZE + 4,
    height: BUBBLE_SIZE + 4,
    borderRadius: (BUBBLE_SIZE + 4) / 2,
    position: 'absolute',
    borderStyle: 'solid',
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 2,
  },
  popover: {
    position: 'absolute',
    zIndex: 1001,
  },
  popoverContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 120,
  },
  popoverItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  popoverText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    fontWeight: '500',
  },
  popoverArrow: {
    position: 'absolute',
    marginTop: -8,
    width: 0,
    height: 0,
  },
  popoverArrowLeft: {
    left: -8,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#fff',
  },
  popoverArrowRight: {
    right: -8,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#fff',
  },
});
