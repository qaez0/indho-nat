import React, { type PropsWithChildren } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import InfoIcon from '../../../components/icons/InfoIcon';

type Props = PropsWithChildren & {
  title: string;
  onInfoClick: (purpose: "ID" | "BANK") => void;
};

const ContentHelper = ({ title, children, onInfoClick }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => onInfoClick("ID")} style={styles.infoButton}>
          <InfoIcon size={16} color="#F3B867" />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  infoButton: {
    padding: 4,
  },
});

export default ContentHelper;
