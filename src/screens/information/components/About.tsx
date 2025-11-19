import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getAboutData } from '../../../constants/about';
import Accordion from './Accordion';

const About: React.FC = () => {
  const { t } = useTranslation();
  const aboutData = getAboutData(t);
  
  return (
    <View style={styles.container}>
      <Accordion data={aboutData || []} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
});

export default About;
