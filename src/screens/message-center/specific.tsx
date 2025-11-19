import { Text } from '@ui-kitten/components';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MessageCenterParamList } from '../../types/nav';
import { markMessageAsRead } from '../../services/message.service';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../App';
import React, { useLayoutEffect, useMemo } from 'react';
import { useTranslateMessage } from '../../hooks/useTranslateMessage';
import { IMessageRecordItem } from '../../types/message';

const MessageCenterSpecificScreen = () => {
  const route = useRoute();
  const { detail } =
    route.params as MessageCenterParamList['message-center-specific'];

  // Translate message if language is Urdu
  // Memoize to prevent infinite re-renders
  const messageForTranslation: IMessageRecordItem | null = useMemo(() => {
    if (!detail) return null;
    return {
      id: detail.id || 0,
      title: detail.title || '',
      content: detail.content || '',
      create_time: detail.create_time || '',
      is_seen: detail.is_seen || false,
      status: '',
      read_time: '',
    };
  }, [detail]);

  const { translatedMessage, isTranslating } = useTranslateMessage(messageForTranslation);

  // Use translated message if available, otherwise use original
  const displayTitle = translatedMessage?.title || detail?.title || '';
  const displayContent = translatedMessage?.content || detail?.content || '';

  const markMessageAsReadMutation = useMutation({
    mutationFn: (messageId: number) => markMessageAsRead(messageId),
    onSuccess: response => {
      if (response.data) {
        queryClient.invalidateQueries({
          queryKey: ['message-center'],
        });
        queryClient.invalidateQueries({
          queryKey: ['panel-info'],
        });
      }
    },
  });

  useLayoutEffect(() => {
    if (detail?.id && !detail?.is_seen) {
      markMessageAsReadMutation.mutate(detail.id);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text category="h6" style={{ color: '#ffffff' }}>
          {displayTitle}
        </Text>
        <Text category="c2" style={{ color: '#ffffff60' }}>
          {detail?.create_time}
        </Text>
      </View>
      <Text category="p2" style={{ color: '#ffffff80' }}>
        {displayContent}
      </Text>
    </ScrollView>
  );
};

export default MessageCenterSpecificScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
});
