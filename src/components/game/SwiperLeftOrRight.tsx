import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Left from '../../assets/common/swiper/left';
import Right from '../../assets/common/swiper/right';

type Props = {
  onClickLeft: () => void;
  onClickRight: () => void;
};

const SwiperLeftOrRight = ({ onClickLeft, onClickRight }: Props) => (
  <View style={styles.navButtons}>
    <TouchableOpacity style={styles.prevLeft} onPress={onClickLeft}>
      <Left />
    </TouchableOpacity>
    <TouchableOpacity style={styles.prevRight} onPress={onClickRight}>
      <Right />
    </TouchableOpacity>
  </View>
);

export default SwiperLeftOrRight;

const styles = StyleSheet.create({
  navButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
    borderRadius: 32,
  },
  prevLeft: {
    backgroundColor: '#fff',
    display: 'flex',
    height: 22,
    paddingHorizontal: 8,
    paddingVertical: 2,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevRight: {
    backgroundColor: '#fff',
    display: 'flex',
    height: 22,
    paddingHorizontal: 8,
    paddingVertical: 2,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
