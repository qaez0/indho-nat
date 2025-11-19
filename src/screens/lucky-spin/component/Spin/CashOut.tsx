import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  type DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '@ui-kitten/components';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const generateMockData = () => {
  const mockRecords = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Get start and end of today
  const startOfToday = new Date(yesterday);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(yesterday);
  endOfToday.setHours(23, 59, 59, 999);

  // Generate 10 mock records
  for (let i = 0; i < 10; i++) {
    // Generate random past date (within last 3 days)
    const randomTime =
      startOfToday.getTime() +
      Math.random() * (endOfToday.getTime() - startOfToday.getTime());
    const mockDate = new Date(randomTime);

    // Generate Pakistani phone number format (92XX****XXX)
    const twoRandomDigits = Math.floor(Math.random() * 90) + 10; // 10-99
    const lastThreeDigits = Math.floor(Math.random() * 900) + 100; // 100-999
    const phoneNumber = `9${twoRandomDigits}****${lastThreeDigits}`;

    mockRecords.push({
      date: formatDate(mockDate.toISOString()),
      phoneNumber: phoneNumber,
      amount: '1000',
    });
  }

  // Sort by date (most recent first)
  return mockRecords.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

interface CashOutProps {
  onCashOut: () => void;
  onSpinRecord: () => void;
  onRules: () => void;
  totalAmount: number;
}
const CashOut = ({
  onCashOut,
  onSpinRecord,
  onRules,
  totalAmount,
}: CashOutProps) => {
  const progressPercent = useMemo(() => {
    const percent = (totalAmount / 1000) * 100;
    return `${Math.min(Math.max(percent, 0), 100)}%`;
  }, [totalAmount]);

  const marqueeAnim = useRef(new Animated.Value(0)).current;
  const [halfContentHeight, setHalfContentHeight] = useState(0);

  useEffect(() => {
    if (halfContentHeight <= 0) return;
    marqueeAnim.setValue(0);
    const loop = Animated.loop(
      Animated.timing(marqueeAnim, {
        toValue: -halfContentHeight,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [halfContentHeight, marqueeAnim]);

  const onMarqueeLayout = (height: number) => {
    // Duplicate list twice, so half height equals single list height
    setHalfContentHeight(height / 2);
  };

  const records = useMemo(() => generateMockData(), []);

  return (
    <View style={styles.rootContainer}>
      <LinearGradient
        colors={['#FFEEA1', '#FFAE00']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.cardContainer}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onSpinRecord}>
            <Image
              source={require('../../../../assets/lucky-spin/spin/info.png')}
              style={styles.icon20}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text category="p1" style={styles.headerTitle}>
            Current Total Amount
          </Text>
          <TouchableOpacity onPress={onRules}>
            <Image
              source={require('../../../../assets/lucky-spin/spin/copy.png')}
              style={styles.icon20}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.amountText}>PKR {totalAmount}</Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: progressPercent as DimensionValue },
            ]}
          />
        </View>

        <TouchableOpacity style={styles.cashoutButton} onPress={onCashOut}>
          <LinearGradient
            colors={['#FF0000', '#FF383D']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.cashoutGradient}
          >
            <Text style={styles.cashoutLabel}>CASH OUT</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.marqueeContainer}>
          <Animated.View
            style={[
              styles.marqueeContent,
              { transform: [{ translateY: marqueeAnim }] },
            ]}
            onLayout={e => onMarqueeLayout(e.nativeEvent.layout.height)}
          >
            {records.map((record, index) => (
              <WinnerRows
                key={`first-${index}`}
                date={record.date}
                number={record.phoneNumber}
                amount={record.amount}
              />
            ))}
            {records.map((record, index) => (
              <WinnerRows
                key={`second-${index}`}
                date={record.date}
                number={record.phoneNumber}
                amount={record.amount}
              />
            ))}
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CashOut;

interface IWinnerRows {
  date: string;
  number: string;
  amount: string;
}
const WinnerRows = ({ date, number, amount }: IWinnerRows) => {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>{date}</Text>
      <Text style={styles.rowText}>{number}</Text>
      <Text style={styles.rowText}>
        Get <Text style={styles.rowTextBold}>PKR{amount}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    borderRadius: 16,
    padding: 5,
    minHeight: 250,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon20: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#E6122B',
  },
  amountText: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '900',
    color: '#E6122B',
    marginTop: 8,
    marginBottom: 8,
  },
  progressTrack: {
    height: 8,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F2272C',
    borderRadius: 100,
  },
  cashoutButton: {
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    padding: 0,
    minHeight: 44,
  },
  cashoutGradient: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flex: 1,
  },
  cashoutLabel: {
    fontWeight: '900',
    fontSize: 16,
    color: 'white',
    letterSpacing: 1,
  },
  marqueeContainer: {
    minHeight: 56,
    maxHeight: 56,
    overflow: 'hidden',
    backgroundColor: 'rgba(216, 101, 0, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  marqueeContent: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  rowText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  rowTextBold: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
