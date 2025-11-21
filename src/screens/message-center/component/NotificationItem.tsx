import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { IMessageRecordItem } from '../../../types/message';
import { convertToPakistanTime } from '../../../utils/pktime';

interface NotificationItemProps {
  id: number;
  title: string;
  content: string;
  create_time: string;
  is_seen: boolean;
  purpose?: 'modal' | 'list';
  onPress: (detail: Partial<IMessageRecordItem>) => void;
}
const NotificationItem = ({
  id,
  title,
  content,
  create_time,
  is_seen,
  purpose = 'modal',
  onPress,
}: NotificationItemProps) => {
  // Note: Translation is handled at the parent component level (NotificationModal/MessageCenterOverviewScreen)
  // to avoid multiple API calls and improve performance
  return (
    <TouchableOpacity
      onPress={() =>
        onPress({
          id,
          title,
          content,
          create_time,
          is_seen,
        })
      }
      style={[
        styles.notificationItem,
        is_seen
          ? { backgroundColor: '#ffffff09' }
          : { backgroundColor: '#2E2E2E', paddingLeft: 25 },
      ]}
    >
      <Text
        category={purpose === 'modal' ? 'h6' : 's1'}
        style={{ color: '#fff', lineHeight: 21 }}
        numberOfLines={purpose === 'modal' ? 1 : 2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <Text
        category="c2"
        style={{
          color: purpose === 'modal' ? '#fff' : '#ffffff60',
          lineHeight: 21,
        }}
        numberOfLines={purpose === 'modal' ? 1 : 3}
        ellipsizeMode="tail"
      >
        {content}
      </Text>
      {purpose === 'modal' && (
        <Text category="c2" style={{ color: '#FFFFFF40' }}>
          { create_time?.replace?.('T', ' ') ?? ''}
        </Text>
      )}
      {!is_seen && <View style={styles.isReadDot} />}
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  notificationItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    paddingVertical: 15,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 8,
  },
  isReadDot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: 'red',
    position: 'absolute',
    left: 10,
    top: 10,
  },
});
