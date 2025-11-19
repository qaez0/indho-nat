import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';

interface ContentProps {
  hide?: boolean;
  children: React.ReactNode;
  title: string | React.ReactNode;
  icon?: React.ReactNode;
  more?:
    | {
        text: string;
        onClick: () => void;
      }
    | React.ReactNode;
}

const Content = ({
  children,
  title,
  more,
  icon,
  hide = false,
}: ContentProps) => {
  if (hide) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && icon}
          {typeof title === 'string' ? (
            <Text category="s1" style={{ fontWeight: '700' }}>
              {title}
            </Text>
          ) : (
            title
          )}
        </View>

        {typeof more === 'object' && more && 'onClick' in more ? (
          <TouchableOpacity
            onPress={more.onClick}
            style={styles.moreButton}
            activeOpacity={0.7}
          >
            <Text style={styles.moreText}>{more.text}</Text>
            <Feather
              name="chevron-right"
              size={16}
              color="#fff"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        ) : (
          more
        )}
      </View>
      {children}
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moreButton: {
    margin: 0,
    padding: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  moreText: {
    fontFamily: 'var(--font-montserrat)',
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  chevronIcon: {
    width: 16,
    height: 16,
  },
});
