import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getFaqData } from '../../../constants/faq';
import Accordion from './Accordion';

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const faqData = getFaqData(t);
  
  return (
    <View style={styles.container}>
      <Accordion data={faqData || []} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
});

export default FAQ;
