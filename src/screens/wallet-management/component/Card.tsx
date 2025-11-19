import { Text } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import USDT from '../../../assets/dep-with/usdt.svg';
import CardIcon from '../../../assets/dep-with/card.svg';

interface CardProps {
  bank_name: string;
  bank_account_name: string;
  ifsc?: string;
  bank_account_num: string;
  card_type: 'BANK' | 'EWALLET' | 'CRYPTO';
}

const Card = ({
  bank_name,
  ifsc,
  bank_account_num,
  card_type,
  bank_account_name,
}: CardProps) => {
  const color: string[] =
    card_type === 'CRYPTO'
      ? ['#5F6162', '#323631', '#7D7D7D']
      : ['#4C6769', '#738F8C'];
  return (
    <LinearGradient colors={color} style={styles.container}>
      <View style={styles.header}>
        {card_type === 'CRYPTO' ? (
          <USDT width={24} height={24} />
        ) : (
          <CardIcon width={24} height={24} />
        )}
        <Text category="s1" style={{ fontWeight: 'bold' }}>
          {card_type === 'CRYPTO' ? 'USDT Address' : bank_name}
        </Text>
      </View>
      <Text category="s1">{bank_account_num}</Text>
      <Text category="s1">{ifsc || bank_account_name}</Text>
    </LinearGradient>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    borderRadius: 8,
    padding: 16,
    minHeight: 124,
  },
  header: {
    flexDirection: 'row',
    gap: 8,
  },
});
