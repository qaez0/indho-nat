import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import { imageHandler } from '../../utils/image-url';
import SiteFooter from '../home/components/SiteFooter';
import CustomCarousel from '../../components/CustomCarousel';
import { firstSponsorSlide, secondSponsorSlide } from '../../constants/sponsor';
import { useTranslation } from 'react-i18next';
const SponsorScreen = () => {
  const { t } = useTranslation();
  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <Image
      source={require('../../assets/common/sponsor/sponsor1.png')}
        style={styles.mainImage}
        resizeMode="contain"
      />

      <Text style={styles.introText}>
        {t('sponsor.intro')}
      </Text>

      <View style={{ flexDirection: 'column', gap: 5 }}>
        <Image
          source={{
            uri: imageHandler(
              '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/ipl-customer-service/public',
            ),
          }}
          style={styles.officeImage as any}
          resizeMode="cover"
        />
        <Text style={styles.officeTitle}>{t('sponsor.office-title')}</Text>
      </View>

      <Text style={styles.mobileDescriptionText}>
      {t('sponsor.office-description')}
        {'\n\n'}
      {t('sponsor.office-description-2')}
      </Text>

      <View style={{ flexDirection: 'column', gap: 5 }}>
        <Image
          source={{
            uri: imageHandler(
              '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/ipl-game-dev/public',
            ),
          }}
          style={styles.officeImage}
          resizeMode="cover"
        />
        <Text style={styles.officeTitle}>
          {t('sponsor.game-development-department-office')}
        </Text>
      </View>

      <View style={styles.sponsorshipSection}>
        <Text style={styles.sponsorshipTitle}>{t('sponsor.sponsorship-title')}</Text>
        <Image
          source={require('../../assets/common/sponsor/frame1.png')}
          style={styles.sponsorshipLogo}
          resizeMode="contain"
        />
        <Text style={styles.sponsorshipDescription}>
          {t('sponsor.sponsorship-description')}
        </Text>
      </View>

      <CustomCarousel
        bannerData={firstSponsorSlide}
        customCarouselHeight={180}
      />

      <View style={styles.sponsorshipSection}>
        <Text style={styles.sponsorshipTitle}>{t('sponsor.sponsorship-title-2')}</Text>
        <Image
          source={require('../../assets/common/sponsor/frame2.png')}
          style={styles.sponsorshipLogo}
          resizeMode="contain"
        />
        <Text style={styles.sponsorshipDescription}>
          {t('sponsor.sponsorship-description-2')}
        </Text>
      </View>

      <CustomCarousel
        bannerData={secondSponsorSlide}
        customCarouselHeight={180}
      />

      <SiteFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'column',
    gap: 10,
    padding: 15,
  },

  // Main Image Styles
  mainImageContainer: {
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: 260,
  },

  // Introduction Text
  introText: {
    color: '#dfdfdf',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'left',
  },
  // Office Section

  officeImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  officeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },
  mobileDescriptionText: {
    color: '#dfdfdf',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  // Sponsorship Section
  sponsorshipSection: {
    alignItems: 'center',
  },
  sponsorshipTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  sponsorshipLogo: {
    width: '90%',
    height: 80,
  },
  sponsorshipDescription: {
    color: '#dfdfdf',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '100%',
  },
});

export default SponsorScreen;
