import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getAffiliateData } from '../../../constants/affiliate';

const Affiliate: React.FC = () => {
  const { t } = useTranslation();
  const affiliateData = getAffiliateData(t);
  
  // Early return if no data
  if (!affiliateData || affiliateData.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <RNText style={styles.noDataText}>
          {t('information.affiliate.no-data-available')}
        </RNText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {affiliateData.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <RNText style={styles.itemText}>
              {index + 1}. {item.details}
            </RNText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  noDataContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  contentContainer: {
    gap: 16,
  },
  itemContainer: {
    backgroundColor: '#232323',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  itemText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});

export default Affiliate;
