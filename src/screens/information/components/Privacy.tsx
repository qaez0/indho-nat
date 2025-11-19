import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getPrivacyData } from '../../../constants/privacy';
import Accordion from './Accordion';

const Privacy: React.FC = () => {
  const { t } = useTranslation();
  const privacyData = getPrivacyData(t);
  
  return (
    <View style={styles.container}>
      <Accordion data={privacyData || []} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
});

export default Privacy;
