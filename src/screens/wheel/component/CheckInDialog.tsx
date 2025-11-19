import { useCallback, useEffect, useState } from 'react';
import { Modal, Text, Button, useTheme } from '@ui-kitten/components';
import { TouchableOpacity, View } from 'react-native';
import { useWheel } from '../hooks/useWheel';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import Feather from '@react-native-vector-icons/feather';

// Styled MUI components replaced by inline styles with UI Kitten/Layout

interface CheckInDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CheckInDialog({ open, onClose }: CheckInDialogProps) {
  const { t } = useTranslation();
  const { queryCheckInAndRewards } = useWheel();
  const { data: checkInDatesRecord } = queryCheckInAndRewards[0];
  const { data: userRewards } = queryCheckInAndRewards[1];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [checkedInDays, setCheckedInDays] = useState<number[]>([]);
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate
    .toLocaleString('default', { month: 'long' })
    .toUpperCase();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const mondayStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [];
  for (let i = 0; i < mondayStart; i++) {
    calendarCells.push({ day: null, key: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({ day, key: `day-${day}` });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const isToday = (day: number | null) => {
    if (day === null) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const dayPassed = (day: number | null) => {
    const today = new Date();
    if (day === null) return false;
    if (currentDate.getMonth() > today.getMonth()) return false;
    return (
      today.getDate() > day ||
      today.getMonth() > month ||
      today.getFullYear() > year
    );
  };

  const checkInDates = useCallback(
    (day: number) => {
      const today = new Date();
      return checkedInDays.includes(day) && today.getMonth() === month;
    },
    [checkedInDays, month],
  );

  useEffect(() => {
    if (checkInDatesRecord?.data) {
      setCheckedInDays(
        checkInDatesRecord.data.map((date: string) => {
          const dateObj = new Date(date);
          console.log(dateObj, 'converted', dateObj.getDate());
          return dateObj.getDate();
        }),
      );
    }
  }, [checkInDatesRecord]);
  const theme = useTheme();
  return (
    <Modal
      visible={open}
      backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onBackdropPress={onClose}
      style={{
        padding: 16,
      }}
      animationType="fade"
    >
      <View
        style={{
          backgroundColor: theme['bg-secondary'],
          overflow: 'hidden',
          borderRadius: 16,
        }}
      >
        <View
          style={{
            backgroundColor: '#F3B867',
            padding: 8,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Text category="s1" style={{ fontWeight: '700', color: '#000' }}>
            {t('wheel.check-in-dialog.claimed-rewards') || 'CLAIMED REWARDS'}
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 5,
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 0,
              top: 0,
            }}
            onPress={onClose}
          >
            <Feather name="x" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{
            minHeight: 100,
            maxHeight: 200,
            overflow: 'hidden',
            paddingHorizontal: 8,
          }}
        >
          {userRewards?.data?.length > 0 ? (
            <View style={{ padding: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ flex: 1, fontWeight: '700' }}>
                  {t('wheel.check-in-dialog.log-in') || 'Log In'}
                </Text>
                <Text
                  style={{ flex: 1, textAlign: 'center', fontWeight: '700' }}
                >
                  {t('wheel.check-in-dialog.date-time') || 'Date & Time'}
                </Text>
                <Text
                  style={{ flex: 1, textAlign: 'right', fontWeight: '700' }}
                >
                  {t('wheel.check-in-dialog.rewards') || 'Rewards'}
                </Text>
              </View>
              {userRewards?.data.map(
                (
                  reward: { request_time: string; reward: number },
                  index: number,
                ) => {
                  const date = new Date(reward.request_time).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric' },
                  );
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#444',
                      }}
                    >
                      <Text style={{ fontWeight: '700' }}>{index + 1}</Text>
                      <Text appearance="hint">{date}</Text>
                      <Text appearance="hint">{reward.reward}</Text>
                    </View>
                  );
                },
              )}
            </View>
          ) : (
            <View
              style={{
                minHeight: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text appearance="hint">
                {t('wheel.check-in-dialog.no-rewards-record-found') ||
                  'No rewards record found.'}
              </Text>
            </View>
          )}
        </ScrollView>

        <View
          style={{
            backgroundColor: '#F3B867',
            padding: 8,
            marginVertical: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: '700', color: '#000' }}>
            {t('wheel.check-in-dialog.check-in-record') || 'CHECK-IN RECORD'}
          </Text>
        </View>

        <View style={{ flexDirection: 'column', gap: 5 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              status="success"
              appearance="ghost"
              onPress={() => navigateMonth('prev')}
            >
              <Feather name="chevron-left" size={24} color="#fff" />
            </Button>
            <Text category="s1" style={{ fontWeight: '700' }}>
              {monthName}
            </Text>
            <Button
              status="success"
              appearance="ghost"
              onPress={() => navigateMonth('next')}
            >
              <Feather name="chevron-right" size={24} color="#fff" />
            </Button>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}
          >
            {daysOfWeek.map(day => (
              <Text
                key={day}
                appearance="hint"
                style={{ textAlign: 'center', fontWeight: '700' }}
              >
                {day}
              </Text>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 16,
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
          >
            {calendarCells.map(({ day, key }) => {
              const bgColor =
                day && checkInDates(day)
                  ? '#4caf50'
                  : isToday(day)
                  ? '#FFD700'
                  : dayPassed(day)
                  ? '#ccc'
                  : 'transparent';
              const color =
                day && checkInDates(day)
                  ? '#fff'
                  : isToday(day)
                  ? '#000'
                  : dayPassed(day)
                  ? '#fff'
                  : '#ccc';
              return (
                <View
                  key={key}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bgColor,
                  }}
                >
                  <Text style={{ color }}>{day || ''}</Text>
                </View>
              );
            })}
          </View>
          <View style={{ padding: 16 }}>
            <Text
              appearance="hint"
              style={{
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {t('wheel.check-in-dialog.take-note') ||
                "Take Note: Green: Indicates a successful login on that day. Gray: Indicates no login on that day. Gold: Represents today's date."}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
