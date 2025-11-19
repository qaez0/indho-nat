import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useUser } from '../hooks/useUser';
import { useUserStore } from '../store/useUser';
import { BASE_URL, MICROSERVICE_URL } from '@env';
import { getBasicDeviceInfo } from '../services/device.service';
import { useLastRequestPayload } from '../store/useUIStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DebugFloatingUIProps {
  isVisible: boolean;
  onToggle: () => void;
}

const DebugFloatingUI: React.FC<DebugFloatingUIProps> = ({
  isVisible,
  onToggle,
}) => {
  const { user, balance, isLoading, isAuthenticated } = useUser();
  const userStore = useUserStore();
  const lastRequestPayload = useLastRequestPayload(state => state.payload);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [deviceLoading, setDeviceLoading] = useState(false);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      setDeviceLoading(true);
      try {
        const device = await getBasicDeviceInfo();
        setDeviceInfo(device);
      } catch (error) {
        console.error('Failed to fetch device info:', error);
        setDeviceInfo({ error: 'Failed to fetch device info' });
      } finally {
        setDeviceLoading(false);
      }
    };

    if (isVisible) {
      fetchDeviceInfo();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleButtonText}>🐛</Text>
      </TouchableOpacity>
    );
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  const copyToClipboard = (data: any, label: string) => {
    const textToCopy = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
    Clipboard.setString(textToCopy);
  };

  const renderSectionHeader = (title: string, data: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity
        style={styles.copyButton}
        onPress={() => copyToClipboard(data, title)}
        activeOpacity={0.7}
      >
        <Text style={styles.copyButtonText}>📋</Text>
      </TouchableOpacity>
    </View>
  );

  const renderObject = (obj: any, title: string) => {
    if (!obj) return <Text style={styles.valueText}>null</Text>;

    return (
      <View style={styles.objectContainer}>
        <Text style={styles.objectTitle}>{title}</Text>
        {Object.entries(obj).map(([key, value]) => (
          <View key={key} style={styles.objectItem}>
            <Text style={styles.objectKey}>{key}:</Text>
            <Text style={styles.objectValue}>{formatValue(value)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Debug User State</Text>
        <TouchableOpacity onPress={onToggle} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.section}>
          {renderSectionHeader('Authentication', {
            isAuthenticated,
            token: userStore.token
          })}
          <Text style={styles.valueText}>
            isAuthenticated: {isAuthenticated ? 'true' : 'false'}
          </Text>
          <Text style={styles.valueText}>
            token: {formatValue(userStore.token)}
          </Text>
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Environment', {
            BASE_URL,
            MICROSERVICE_URL
          })}
          <Text style={styles.valueText}>BASE_URL: {BASE_URL}</Text>
          <Text style={styles.valueText}>
            MICROSERVICE_URL: {MICROSERVICE_URL}
          </Text>
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Last Request Payload', lastRequestPayload)}
          {lastRequestPayload ? (
            <View style={styles.objectContainer}>
              {Object.entries(lastRequestPayload).map(([key, value]) => (
                <View key={key} style={styles.objectItem}>
                  <Text style={styles.objectKey}>{key}:</Text>
                  <Text style={styles.objectValue}>{formatValue(value)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.valueText}>No request payload available</Text>
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Device Info', deviceInfo)}
          {deviceLoading ? (
            <Text style={styles.valueText}>Loading device info...</Text>
          ) : deviceInfo ? (
            <View style={styles.objectContainer}>
              {Object.entries(deviceInfo).map(([key, value]) => (
                <View key={key} style={styles.objectItem}>
                  <Text style={styles.objectKey}>{key}:</Text>
                  <Text style={styles.objectValue}>{formatValue(value)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.valueText}>No device info available</Text>
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Loading States', isLoading)}
          <Text style={styles.valueText}>
            balance loading: {isLoading.balance ? 'true' : 'false'}
          </Text>
          <Text style={styles.valueText}>
            panel info loading: {isLoading.panelInfo ? 'true' : 'false'}
          </Text>
        </View>

        <View style={styles.section}>
          {renderSectionHeader('User Info', user?.player_info)}
          {user?.player_info ? (
            <View style={styles.objectContainer}>
              <Text style={styles.objectTitle}>Player Details</Text>
              {Object.entries(user.player_info).map(([key, value]) => (
                <View key={key} style={styles.objectItem}>
                  <Text style={styles.objectKey}>{key}:</Text>
                  <Text style={styles.objectValue}>{formatValue(value)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.valueText}>No user data</Text>
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Balance', balance)}
          {balance ? (
            <View style={styles.objectContainer}>
              {Object.entries(balance).map(([key, value]) => (
                <View key={key} style={styles.objectItem}>
                  <Text style={styles.objectKey}>{key}:</Text>
                  <Text style={styles.objectValue}>{formatValue(value)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.valueText}>No balance data</Text>
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Transaction Info', user?.transaction_info)}
          {user?.transaction_info ? (
            <View style={styles.objectContainer}>
              {Object.entries(user.transaction_info).map(([key, value]) => (
                <View key={key} style={styles.objectItem}>
                  <Text style={styles.objectKey}>{key}:</Text>
                  <Text style={styles.objectValue}>{formatValue(value)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.valueText}>No transaction data</Text>
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader('VIP Data', user?.vip)}
          {user?.vip ? (
            <View style={styles.objectContainer}>
              {Object.entries(user.vip).map(([key, value]) => (
                <View key={key} style={styles.objectItem}>
                  <Text style={styles.objectKey}>{key}:</Text>
                  <Text style={styles.objectValue}>{formatValue(value)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.valueText}>No VIP data</Text>
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Other Store Data', {
            ip: userStore.ip,
            adjust_id: userStore.adjust_id,
            unread_message_count: user?.unread_message_count || 0
          })}
          <Text style={styles.valueText}>IP: {formatValue(userStore.ip)}</Text>
          <Text style={styles.valueText}>
            Adjust ID: {formatValue(userStore.adjust_id)}
          </Text>
          <Text style={styles.valueText}>
            Unread Messages: {user?.unread_message_count || 0}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: screenWidth * 0.85,
    maxHeight: screenHeight * 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 9999,
  },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    flex: 1,
  },
  copyButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  copyButtonText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  valueText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  objectContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  objectTitle: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  objectItem: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  objectKey: {
    color: '#81C784',
    fontSize: 11,
    fontWeight: 'bold',
    minWidth: 120,
  },
  objectValue: {
    color: '#fff',
    fontSize: 11,
    flex: 1,
    fontFamily: 'monospace',
  },
});

export default DebugFloatingUI;
