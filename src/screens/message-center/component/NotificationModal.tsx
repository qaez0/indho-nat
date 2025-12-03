import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, Modal, Text, useTheme } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';
import { Fragment } from 'react';
import React from 'react';
import NotificationItem from './NotificationItem';
import { useNotificationModal } from '../../../hooks/useUIHelpers';
import { IMessageRecordItem } from '../../../types/message';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getMessageRecord,
  markMessageAsRead,
} from '../../../services/message.service';
import { queryClient } from '../../../App';
import { useTranslation } from 'react-i18next';
import { useTranslateMessages } from '../../../hooks/useTranslateMessage';

interface NotificationModalProps {
  onSeeAllNotifications: () => void;
  onViewSpecificNotification: (detail: Partial<IMessageRecordItem>) => void;
}

const NotificationModal = ({
  onSeeAllNotifications,
  onViewSpecificNotification,
}: NotificationModalProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const visible = useNotificationModal(s => s.visible);
  const closeModal = useNotificationModal(s => s.closeModal);

  const pagination = { page: 1, pagesize: 100, read_status: undefined }; // Fetch all messages

  const {
    data: messageRecord,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ['message-center', pagination],
    queryFn: () => getMessageRecord(pagination),
    enabled: visible,
    staleTime: 0, // Always fetch fresh data when modal opens
    refetchOnMount: true,
  });

  const isProcessing = isLoading || isFetching || isRefetching;

  // Filter to show only unread messages (is_seen = false)
  const unreadMessagesRaw = React.useMemo(() => {
    if (!messageRecord?.data?.data) return [];
    return messageRecord.data.data.filter(item => item.is_seen === false);
  }, [messageRecord?.data?.data]);

  // Translate messages if language is Urdu
  const { translatedMessages, isTranslating } =
    useTranslateMessages(unreadMessagesRaw);
  const unreadMessages = translatedMessages;

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return markMessageAsRead('all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-center'] });
      queryClient.invalidateQueries({ queryKey: ['panel-info'] });
    },
  });

  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      shouldUseContainer={false}
      onBackdropPress={closeModal}
      animationType="fade"
    >
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme['bg-secondary'],
            top: insets.top + 50,
          },
        ]}
      >
        <View style={styles.header}>
          <Text category="h6" style={{ fontSize: 16 }}>
            {t('message-center.notifications')}
          </Text>
          {unreadMessages && unreadMessages.length > 0 && (
            <TouchableOpacity
              style={styles.headerRight}
              onPress={() => markAllAsReadMutation.mutate()}
            >
              <Text
                category="c2"
                style={{
                  textDecorationLine: 'underline',
                  color: '#E78F07',
                }}
              >
                {t('message-center.mark-all-as-read')}
              </Text>
              <Feather name="check-circle" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <Divider
          style={{ width: '100%', height: 1, backgroundColor: '#FFFFFF15' }}
        />
        {isProcessing || isTranslating ? (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text category="s1" style={{ color: '#FFFFFF80' }}>
              {t('common-terms.loading')}
            </Text>
          </View>
        ) : unreadMessages && unreadMessages.length > 0 ? (
          <Fragment>
            {unreadMessages.slice(0, 3).map((item, index) => (
              <NotificationItem
                key={index}
                {...item}
                onPress={detail => {
                  closeModal();
                  onViewSpecificNotification(detail);
                }}
              />
            ))}
            <Divider
              style={{ width: '100%', height: 1, backgroundColor: '#FFFFFF15' }}
            />
            <TouchableOpacity
              onPress={() => {
                closeModal();
                onSeeAllNotifications();
              }}
            >
              <Text
                category="h6"
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                  fontSize: 14,
                }}
              >
                {t('message-center.see-all-notifications')}
              </Text>
            </TouchableOpacity>
          </Fragment>
        ) : (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <Text category="s1" style={{ color: '#FFFFFF80' }}>
              {t('message-center.no-new-notifications')}
            </Text>


            <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: '#FFFFFF15', paddingTop: 16 }}>
            <TouchableOpacity
              onPress={() => {
                closeModal();
                onSeeAllNotifications();
              }}
            >
              <Text
                category="h6"
                style={{
                  color: '#E78F07',
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                  fontSize: 14,
              
                }}
              >
                {t('message-center.see-all-notifications')}
              </Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 0,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
