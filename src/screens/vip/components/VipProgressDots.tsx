import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { VipProgressDotsProps } from '../../../types/vip';
import { vipStyles } from './vip.styles';

const VipProgressDots: React.FC<VipProgressDotsProps> = ({
  totalDots,
  currentIndex,
  onDotPress,
}) => {
  return (
    <View style={vipStyles.progressDotsContainer}>
      <View style={vipStyles.progressDotsWrapper}>
        {/* Background connecting line */}
        <View style={vipStyles.progressDotsLine} />

        {/* Dots row */}
        <View style={vipStyles.progressDotsRow}>
          {Array.from({ length: totalDots }, (_, index) => (
            <TouchableOpacity
              key={`dot-${index}`}
              style={[
                vipStyles.progressDot,
                index === currentIndex && vipStyles.progressDotActive,
              ]}
              onPress={() => onDotPress(index)}
              activeOpacity={0.7}
              hitSlop={12}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default VipProgressDots;
