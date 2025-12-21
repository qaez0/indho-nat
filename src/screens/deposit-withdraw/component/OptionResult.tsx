import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import PartnerBtn from './PartnerBtn';
import { channelIdentifier } from '../../../constants/deposit';
import { useSelectedOption } from '../store';

interface IOptionResultProps {
  data: any[];
  reset?: () => void;
}

const OptionResult = ({ data, reset }: IOptionResultProps) => {
  const { index, setSelectedOption } = useSelectedOption();
  
  const normalizeDisplayName = (displayName: string | undefined): string => {
    if (!displayName) return '';
    const normalized = displayName.trim();
    if (
      normalized.toLowerCase() === 'gamepayer easypaisa' ||
      normalized.toLowerCase() === 'gamepayer jazzcash'
    ) {
      return 'GamePayer';
    }
    return displayName;
  };
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {data.map((item, activeIndex) => {
        const IconComponent = channelIdentifier(item.channels);
        return (
          <PartnerBtn
            icon={<IconComponent width={40} height={40} />}
            key={activeIndex}
            onClick={() => {
              setSelectedOption(item, activeIndex);
              reset?.();
            }}
            isActive={activeIndex === index}
            label={
              <View style={styles.labelContainer}>
                <Text style={[styles.label, styles.baseLabel]}>
                  {normalizeDisplayName(item?.display_name)}
                </Text>
                <Text style={[styles.range, styles.baseLabel]}>
                  {item?.amount_options[0]} -{' '}
                  {item?.amount_options[item?.amount_options.length - 1]}
                </Text>
              </View>
            }
          />
        );
      })}
    </ScrollView>
  );
};

export default OptionResult;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 4,
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  baseLabel: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    color: '#FFFFFF',
  },
  label: {
    fontSize: 10,
  },
  range: {
    fontSize: 9,
  },
  icon: {
    height: 40,
    width: 80,
    color: '#FFFFFF',
  },
});
