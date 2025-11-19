import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { VipCardProps } from '../../../types/vip';
import { vipStyles } from './vip.styles';
import { useTranslation } from 'react-i18next';
import Logo from '../../../assets/logo.svg';
import vip0Bg from '../../../assets/common/vip/masks/vip0.png';
import vip1Bg from '../../../assets/common/vip/masks/vip1.png';
import vip2Bg from '../../../assets/common/vip/masks/vip2.png';
import vip3Bg from '../../../assets/common/vip/masks/vip3.png';
import vip4Bg from '../../../assets/common/vip/masks/vip4.png';
import vip5Bg from '../../../assets/common/vip/masks/vip5.png';
import vip6Bg from '../../../assets/common/vip/masks/vip6.png';
import crown0 from '../../../assets/common/vip/crowns/crown0.png';
import crown1 from '../../../assets/common/vip/crowns/crown1.png';
import crown2 from '../../../assets/common/vip/crowns/crown2.png';
import crown3 from '../../../assets/common/vip/crowns/crown3.png';
import crown4 from '../../../assets/common/vip/crowns/corwn4.png';
import crown5 from '../../../assets/common/vip/crowns/crown5.png';
import crown6 from '../../../assets/common/vip/crowns/crown6.png';

const VipCard = ({
  index,
  isActive,
  level,
}: {
  index: number;
  isActive: boolean;
  level: {
    bet_requirement: number;
    deposit_requirement: string;
    deposit_amount: number;
    deposit_progress: number;
    start_time: string;
    status: 'DISABLED' | 'CURRENT';
  };
}) => {
  const { t } = useTranslation();
  const crowns = [crown0, crown1, crown2, crown3, crown4, crown5, crown6];
  const backgrounds = [vip0Bg, vip1Bg, vip2Bg, vip3Bg, vip4Bg, vip5Bg, vip6Bg];

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <View style={vipStyles.crownContainer}>
        <Image
          source={crowns[index]}
          style={vipStyles.crownImage}
          resizeMode="contain"
        />
      </View>
      <ImageBackground
        source={backgrounds[index]}
        style={[
          vipStyles.vipCard,
          isActive ? vipStyles.vipCardActive : vipStyles.vipCardInactive,
        ]}
        resizeMode="cover"
      >
        <View style={vipStyles.vipCardHeader}>
          <View style={vipStyles.vipCardLogoContainer}>
            <View style={vipStyles.vipCardLogo}>
              <Logo width={32} height={32} fill="#fff" />
            </View>
            <Text style={vipStyles.vipCardTitle}>VIP {index}</Text>
          </View>
        </View>

        {index < 6 && (
          <View style={vipStyles.progressSection}>
            <View style={vipStyles.progressContainer}>
              <View style={vipStyles.progressBarContainer}>
                <View style={vipStyles.progressBar}>
                  <View
                    style={[
                      vipStyles.progressFill,
                      { width: `${level.deposit_progress}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={vipStyles.nextLevelIndicator}>
                <Image
                  source={crowns[index + 1]}
                  style={vipStyles.nextLevelCrown}
                  resizeMode="contain"
                />
                <Text style={vipStyles.nextLevelText}>VIP {index + 1}</Text>
              </View>
            </View>
          </View>
        )}

        <View>
          <Text style={vipStyles.depositRequirement}>
            {index === 6
              ? t('vip.highest-level-reached')
              : t('vip.deposit-to-qualify', { level: index + 1 })}
          </Text>
          <Text style={vipStyles.depositRequirementLarge}>
            {index === 6
              ? t('vip.congratulations')
              : level.deposit_requirement
              ? `${Number(level.deposit_requirement).toLocaleString(
                  'en-US',
                )} PKR`
              : t('vip.not-available')}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default VipCard;
