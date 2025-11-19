import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { vipStyles } from './vip.styles';
import { VipLevelData, BlockConfig, vipLevelsData } from '../../../types/vip';

const VipLevelsTable = () => {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const getCrownImage = (vipLevel: number) => {
    const crowns = [
      require('../../../assets/common/vip/crowns/vip0.png'), // VIP 0
      require('../../../assets/common/vip/crowns/vip1.png'), // VIP 1
      require('../../../assets/common/vip/crowns/vip2.png'), // VIP 2
      require('../../../assets/common/vip/crowns/vip3.png'), // VIP 3
      require('../../../assets/common/vip/crowns/vip4.png'), // VIP 4
      require('../../../assets/common/vip/crowns/vip5.png'), // VIP 5
      require('../../../assets/common/vip/crowns/vip6.png'), // VIP 6
    ];
    return crowns[vipLevel] || crowns[0];
  };

  // Visual blocks configuration (matching web version exactly)
  const visualBlocksConfig: BlockConfig[] = [
    {
      isFirstBlock: true,
      rows: [
        { type: 'header', label: 'VIP\nLEVELS' },
        { type: 'data', key: 'totalDeposit', label: 'Total Deposit' },
      ],
    },
    {
      rows: [
        {
          type: 'data',
          key: 'weeklyLossbackBonus',
          label: 'Weekly\nLossback Bonus',
        },
        { type: 'data', key: 'bonusTurnover1', label: 'Bonus Turnover' },
        { type: 'data', key: 'minLossReq', label: 'Minimum Loss Req.' },
      ],
    },
    {
      rows: [
        {
          type: 'data',
          key: 'depositExtraBonus',
          label: 'Deposit\nExtra Bonus',
        },
        { type: 'data', key: 'minDepositReq', label: 'Minimum\nDeposit Req.' },
        { type: 'data', key: 'maxBonus', label: 'Max Bonus' },
        { type: 'data', key: 'bonusTurnover2', label: 'Bonus Turnover' },
        { type: 'data', key: 'dailyClaimTimes', label: 'Daily Claim\nTimes' },
      ],
    },
  ];

  // Constants for styling (matching web version)
  const cellWidth = 90;
  const labelWidth = 100;
  const dataRowPadding = 8;
  const headerRowPadding = 6;
  const minScrollWidth = labelWidth + vipLevelsData.length * cellWidth;

  const labelColumnColor = '#3a3b3a';
  const vip0ColumnColor = '#454645';
  const otherVipColumnsColor = '#3a3b3a';
  const outerBorderColor = '#9a9c9a';
  const blockBorderRadius = 16;
  const blockMarginBottom = 16;

  return (
    <View style={vipStyles.tableSection}>
      <Text style={vipStyles.sectionTitle}>{t('vip.level-and-rewards')}</Text>
      <Text style={vipStyles.sectionSubtitle}>{t('vip.level-details')}</Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ overflow: 'hidden' }}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <View style={{ minWidth: minScrollWidth }}>
          {visualBlocksConfig.map((block, blockIndex) => (
            <View
              key={`block-${blockIndex}`}
              style={[
                vipStyles.complexTableBlock,
                {
                  borderRadius: blockBorderRadius,
                  borderWidth: 1,
                  borderColor: outerBorderColor,
                  marginBottom:
                    blockIndex < visualBlocksConfig.length - 1
                      ? blockMarginBottom
                      : 0,
                },
              ]}
            >
              {block.rows.map((rowConfig, rowIndex) => {
                const getBorderColor = () => {
                  if (blockIndex === 0) {
                    return `${outerBorderColor}80`;
                  } else {
                    return `${outerBorderColor}40`;
                  }
                };

                const isLastRowInBlock = rowIndex === block.rows.length - 1;

                return (
                  <View
                    key={rowConfig.label}
                    style={[
                      vipStyles.complexTableRow,
                      {
                        borderBottomWidth: isLastRowInBlock ? 0 : 1,
                        borderBottomColor: getBorderColor(),
                      },
                    ]}
                  >
                    {/* Label Column */}
                    <View
                      style={[
                        vipStyles.complexTableLabelCell,
                        {
                          width: labelWidth,
                          minWidth: labelWidth,
                          padding:
                            rowConfig.type === 'header'
                              ? headerRowPadding
                              : dataRowPadding,
                          backgroundColor: labelColumnColor,
                        },
                      ]}
                    >
                      <Text style={vipStyles.complexTableLabelText}>
                        {rowConfig.label}
                      </Text>
                    </View>

                    {/* VIP Level Columns */}
                    {vipLevelsData.map((vip, vipIndex) => {
                      const vipLevelNumber = parseInt(
                        vip.level.replace('VIP ', ''),
                        10,
                      );

                      return (
                        <View
                          key={`${vip.level}-${rowConfig.label}`}
                          style={[
                            vipStyles.complexTableDataCell,
                            {
                              width: cellWidth,
                              minWidth: cellWidth,
                              padding:
                                rowConfig.type === 'header'
                                  ? headerRowPadding
                                  : dataRowPadding,
                              backgroundColor:
                                vip.level === 'VIP 0'
                                  ? vip0ColumnColor
                                  : otherVipColumnsColor,
                            },
                          ]}
                        >
                          {rowConfig.type === 'header' ? (
                            <View style={vipStyles.complexTableHeaderContent}>
                              {/* VIP Crown Icon */}
                              <Image
                                source={getCrownImage(vipLevelNumber)}
                                style={{
                                  width: 32,
                                  height: 32,
                                  marginBottom: 2,
                                }}
                                resizeMode="contain"
                              />
                              <Text style={vipStyles.complexTableHeaderText}>
                                {vip.level}
                              </Text>
                            </View>
                          ) : (
                            <Text style={vipStyles.complexTableDataText}>
                              {vip[rowConfig.key! as keyof VipLevelData]}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default VipLevelsTable;
