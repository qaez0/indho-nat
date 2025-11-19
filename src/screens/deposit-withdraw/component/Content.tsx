import { View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { Text as UIText, Spinner } from '@ui-kitten/components';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IContent {
  label: string;
  subLabel?: string;
  content: React.ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
}

const Content = ({
  label,
  content,
  labelStyle,
  isLoading,
  subLabel,
}: IContent) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.highligh} />
        <UIText style={[styles.label, labelStyle]}>{label}</UIText>
        {subLabel && <UIText style={styles.subLabel}>{subLabel}</UIText>}
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingInner}>
            <UIText style={styles.label}>{t('common-terms.please-wait')}</UIText>
            <Spinner size="small" />
          </View>
        </View>
      ) : (
        content
      )}
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minHeight: 12,
  },
  highligh: {
    width: 2,
    height: '100%',
    backgroundColor: '#FFAA06',
  },
  label: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 197,
  },
  loadingInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subLabel: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 10,
    fontWeight: '400',
    color: '#FFAA06',
  },
});
