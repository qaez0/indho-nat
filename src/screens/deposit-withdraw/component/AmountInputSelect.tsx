import { View, StyleSheet } from 'react-native';
import { Button } from '@ui-kitten/components';

const AmountInputSelect = ({
  amounts,
  onAmountChange,
  value,
}: {
  amounts: number[];
  onAmountChange: (amount: number) => void;
  value: string;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.predefineContainer}>
        {(amounts ?? []).map((item, index) => (
          <Button
            key={index}
            style={{ width: 90 }}
            appearance="filled"
            status={value === item.toString() ? 'success' : 'primary'}
            onPress={() => onAmountChange(item)}
          >
            {item.toString()}
          </Button>
        ))}
      </View>
    </View>
  );
};

export default AmountInputSelect;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  predefineContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
