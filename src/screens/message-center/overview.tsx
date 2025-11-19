import { Button, Text } from '@ui-kitten/components';
import { useState } from 'react';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import NotificationItem from './component/NotificationItem';
import { getMessageRecord } from '../../services/message.service';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { MessageCenterParamList } from '../../types/nav';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IMessageRecord } from '../../types/message';
import CustomPagination from '../../components/Pagination';
import { useTranslation } from 'react-i18next';
import { useTranslateMessages } from '../../hooks/useTranslateMessage';

type MessageCenterScreeProps =
  NativeStackNavigationProp<MessageCenterParamList>;
const MessageCenterOverviewScreen = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'unread' | 'history'>('unread');
  const [pagination, setPagination] = useState<IMessageRecord>({
    page: 1,
    pagesize: 100, // Fetch all messages to filter client-side
    read_status: undefined, // Fetch all messages
  });
  const displayPageSize = 10; // Items per page for display
  const navigation = useNavigation<MessageCenterScreeProps>();

  const { data, isLoading, isFetching, isRefetching, refetch } = useQuery({
    queryKey: ['message-center', pagination],
    queryFn: () => getMessageRecord(pagination),
  });

  const isProcessing = isLoading || isFetching || isRefetching;

  // Filter messages based on is_seen field
  const filteredMessages = React.useMemo(() => {
    if (!data?.data?.data) return [];
    
    if (activeTab === 'unread') {
      // Unread Messages: is_seen = false
      return data.data.data.filter(item => item.is_seen === false);
    } else {
      // Message History: is_seen = true
      return data.data.data.filter(item => item.is_seen === true);
    }
  }, [data?.data?.data, activeTab]);

  // Client-side pagination for filtered messages
  const [displayPage, setDisplayPage] = useState(1);
  const paginatedMessages = React.useMemo(() => {
    const startIndex = (displayPage - 1) * displayPageSize;
    const endIndex = startIndex + displayPageSize;
    return filteredMessages.slice(startIndex, endIndex);
  }, [filteredMessages, displayPage]);

  // Translate messages if language is Urdu
  const { translatedMessages } = useTranslateMessages(paginatedMessages);
  const displayMessages = translatedMessages.length > 0 ? translatedMessages : paginatedMessages;

  // Reset to page 1 when switching tabs
  React.useEffect(() => {
    setDisplayPage(1);
  }, [activeTab]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={style.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View style={style.filterContainer}>
        <Button
          onPress={() => setActiveTab('unread')}
          style={style.filterButton}
          appearance="filled"
          status={activeTab === 'unread' ? 'success' : 'primary'}
        >
          {t('message-center.unread-messages')}
        </Button>
        <Button
          onPress={() => setActiveTab('history')}
          style={style.filterButton}
          appearance="filled"
          status={activeTab === 'history' ? 'success' : 'primary'}
        >
          {t('message-center.message-history')}
        </Button>
      </View>
      {displayMessages && displayMessages.length > 0 ? (
        <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displayMessages.map((item, index) => (
            <NotificationItem
              key={index}
              {...item}
              purpose="list"
              onPress={() =>
                navigation.navigate('message-center-specific', {
                  detail: item,
                })
              }
            />
          ))}
        </View>
      ) : (
        <View style={style.noDataContainer}>
          {isProcessing ? (
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 5,
              }}
            >
              <ActivityIndicator size="small" color="#ffffff" />
              <Text category="h6" style={{ color: '#ffffff60' }}>
                {t('common-terms.loading')}
              </Text>
            </View>
          ) : (
            <Text category="h6" style={{ color: '#ffffff60' }}>
              {t('message-center.no-messages-found')}
            </Text>
          )}
        </View>
      )}
      {filteredMessages && filteredMessages.length > displayPageSize && (
        <CustomPagination
          totalItems={filteredMessages.length}
          pageSize={displayPageSize}
          onPageChange={page => {
            setDisplayPage(page);
          }}
          currentPage={displayPage}
        />
      )}
    </ScrollView>
  );
};

export default MessageCenterOverviewScreen;

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    minHeight: 40,
  },
  noDataContainer: {
    minHeight: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
