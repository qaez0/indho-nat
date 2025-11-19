import type { DialogProps } from '.';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Modal, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import Feather from '@react-native-vector-icons/feather';

const RulesDialog = ({ open, onClose }: DialogProps) => {
  const { t } = useTranslation();
  const rules = t('lucky-spin.rules.items', {
    returnObjects: true,
  }) as string[];

  return (
    <Modal
      visible={open}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClose}
      animationType="fade"
      style={{
        padding: 12,
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('lucky-spin.rules.title')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {rules.map((rule, index) => (
            <Text key={index} style={styles.ruleText}>
              {index + 1}. {rule}
            </Text>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default RulesDialog;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    width: '100%',
    maxHeight: 600,
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: '#323631',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '300',
  },
  closeBtn: {
    position: 'absolute',
    right: 8,
    padding: 8,
  },
  closeLabel: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 16,
  },
  ruleText: {
    color: '#d7d7d7',
    fontSize: 14,
    marginBottom: 5,
  },
  actionBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    minHeight: 44,
  },
});
