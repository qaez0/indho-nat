import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const HamburgerMenu = ({
  onClick,
  isDrawerOpen,
}: {
  onClick: () => void;
  isDrawerOpen: boolean;
}) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isDrawerOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen, flipAnimation]);

  const rotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '0deg'],
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onClick} hitSlop={12}>
      <Animated.View
        style={{
          transform: [{ rotateY }],
        }}
      >
        <View
          style={[
            styles.rotatingContainer,
            isDrawerOpen
              ? styles.rotatingContainerOpen
              : styles.rotatingContainerClosed,
          ]}
        >
          <View style={[styles.line, styles.diagonalLine1]} />
          <View style={[styles.line, styles.diagonalLine2]} />
        </View>
        <View
          style={[
            styles.line,
            styles.topLine,
            isDrawerOpen ? styles.topLineOpen : styles.topLineClosed,
          ]}
        />
        <View
          style={[
            styles.line,
            styles.middleLine,
            isDrawerOpen ? styles.middleLineOpen : styles.middleLineClosed,
          ]}
        />
        <View style={[styles.line, styles.bottomLine]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 19,
    height: 17,
    position: 'relative',
  },
  rotatingContainer: {
    position: 'absolute',
    width: 6,
    height: 9,
    right: 0,
  },
  rotatingContainerClosed: {
    right: 0,
  },
  rotatingContainerOpen: {
    left: 0,
    transform: [{ rotate: '180deg' }],
  },
  line: {
    backgroundColor: 'white',
    height: 2,
  },
  diagonalLine1: {
    position: 'absolute',
    width: 6,
    transform: [{ rotate: '45deg' }],
    transformOrigin: 'left',
  },
  diagonalLine2: {
    position: 'absolute',
    width: 6,
    transform: [{ rotate: '-45deg' }],
    transformOrigin: 'left',
    top: 7,
  },
  topLine: {
    position: 'absolute',
    width: 9,
    top: 0,
  },
  topLineClosed: {
    left: 0,
  },
  topLineOpen: {
    right: 0,
  },
  middleLine: {
    position: 'absolute',
    width: 9,
    top: 8,
  },
  middleLineClosed: {
    left: 0,
  },
  middleLineOpen: {
    right: 0,
  },
  bottomLine: {
    position: 'absolute',
    width: '100%',
    top: 16,
  },
});

export default HamburgerMenu;
