import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { imageHandler } from '../../utils/image-url';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { RootStackNav } from '../../types/nav';

// --- DATA ---
const commissionTiers = [
  { range: 'PKR 1 - 200,000', rate: '20%' },
  { range: 'PKR 200,001 - 3,000,000', rate: '30%' },
  { range: 'PKR 3,000,001 - 5,000,000', rate: '35%' },
  { range: 'PKR 5,000,001 - 30,000,000', rate: '40%' },
  { range: 'PKR 30,000,001 - 60,000,000', rate: '45%' },
  { range: 'PKR 60,000,001 - 100,000,000', rate: '50%' },
  { range: '> PKR 100,000,001', rate: '60%' },
];

const getHowItWorksData = (t: (key: string) => string) => [
  {
    title: t('affiliate.how-it-works.register'),
    desc: t(
      'affiliate.how-it-works.create',
    ),
  },
  {
    title: t('affiliate.how-it-works.promote'),
    desc: t(
      'affiliate.how-it-works.track',
    ),
  },
  {
    title: t('affiliate.how-it-works.high-commission'),
    desc: t(
      'affiliate.how-it-works.plan',
    ),
  },
  {
    title: t('affiliate.dashboard.title'),
    desc: t(
      'affiliate.dashboard.desc',
    ),
  },
];

const getFeaturesData = (t: (key: string) => string) => [
  t('affiliate.features.numerous-sports-book-choices'),
  t('affiliate.features.top-tier-casino-games'),
  t('affiliate.features.best-revenue-and-commission-offers'),
  t('affiliate.features.quick-transactions'),
  t('affiliate.features.monthly-commissions'),
  t('affiliate.features.its-all-about-you-with-us'),
];

interface Faq {
  q: string;
  a: string;
}

const getFaqsData = (t: (key: string) => string): Faq[] => [
  {
    q: t('affiliate.faq.what-makes-us-different'),
    a: t(
      'affiliate.faq.11ic-affiliates',
    ),
  },
  {
    q: t('affiliate.faq.how-calc'),
    a: t(
      'affiliate.faq.calc-desc',
    ),
  },
  {
    q: t('affiliate.faq.when-paid'),
    a: t(
      'affiliate.faq.when-desc',
    ),
  },
  {
    q: t(
      'affiliate.faq.where-banners',
    ),
    a: t(
      'affiliate.faq.banners-desc',
    ),
  },
  {
    q: t(
      'affiliate.faq.how-to-become-a-affiliate-agent',
    ),
    a: t(
      'affiliate.faq.step-1-register',
    ),
  },
];

// --- ICON COMPONENT ---
const ArrowIcon = ({ open }: { open: boolean }) => {
  return (
    <Svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
    >
      <Path
        d="M7 10l5 5 5-5H7z"
        fill="white"
      />
    </Svg>
  );
};


// --- SUBCOMPONENTS ---

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  
  const titleImage = useMemo(() => {
    return i18n.language === 'pk' 
      ? require('../../assets/common/affiliate/title2.png')
      : require('../../assets/common/affiliate/title1.png');
  }, [i18n.language]);
  
  return (
    <View style={styles.heroSection}>
      <View style={styles.heroImageContainer}>
        <Image
          source={{ uri: imageHandler('/images/common/affiliate/afff.png') }}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.heroTextContainer}>
        <Image
          source={titleImage}
          style={styles.heroTitleImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.partnerButton}
          onPress={() => Linking.openURL('https://aff.11ic.pk/signup')}
        >
          <Text style={styles.partnerButtonText}>
            {t('affiliate.hero-section.be-our-partner')}
          </Text>
          <Image
            source={{ uri: imageHandler('/images/common/affiliate/arrow.png') }}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.partnerInfoBox}>
          <Text style={styles.partnerInfoText}>
            {t(
              'affiliate.hero-section.being-a-partner-with-us-is-easy',
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const howItWorks = getHowItWorksData(t);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('affiliate.how-it-works.title')}
      </Text>
      {howItWorks.map(item => (
        <View key={item.title} style={styles.howItWorksItem}>
          <Text style={styles.howItWorksTitle}>{item.title}</Text>
          <Text style={styles.howItWorksDesc}>{item.desc}</Text>
        </View>
      ))}
    </View>
  );
};

const CommissionPlanSection = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('affiliate.commission.title')}
      </Text>
      <Text style={styles.commissionNote}>
        {t(
          'affiliate.commission.note',
        )}
      </Text>
      <View style={styles.commissionTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>
            {t(
              'affiliate.commission.net-revenue',
            )}
          </Text>
          <Text style={styles.tableHeaderText}>
            {t('affiliate.commission.rate')}
          </Text>
        </View>
        {commissionTiers.map((tier, idx) => (
          <View key={tier.range} style={styles.tableRow}>
            <Text style={styles.tableCell}>{tier.range}</Text>
            <Text style={styles.tableCell}>{tier.rate}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.commissionDisclaimer}>
        {t(
          'affiliate.commission.please-note',
        )}
      </Text>
    </View>
  );
};

const WhyBecomeAffiliateSection = () => {
  const { t } = useTranslation();
  const features = getFeaturesData(t);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('affiliate.why-join.title')}
      </Text>
      <Text style={styles.whyJoinDesc}>
        {t(
          'affiliate.why-join.desc',
        )}
      </Text>
      <View style={styles.featuresList}>
        {features.map(feature => (
          <Text key={feature} style={styles.featureItem}>
            • {feature}
          </Text>
        ))}
      </View>
    </View>
  );
};

const FaqSection = () => {
  const { t } = useTranslation();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const faqs = getFaqsData(t);

  const handleFaqClick = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>FAQ</Text>
      {faqs.map((faq, idx) => (
        <View key={faq.q} style={styles.faqItem}>
          <TouchableOpacity
            style={styles.faqQuestionContainer}
            onPress={() => handleFaqClick(idx)}
          >
            <Text style={styles.faqQuestion}>{faq.q}</Text>
            <ArrowIcon open={openFAQ === idx} />
          </TouchableOpacity>
          {openFAQ === idx && (
            <View style={{ alignItems: 'flex-start', width: '100%' }}>
              {faq.a.split('\n').map((line, lineIdx) => (
                <Text key={lineIdx} style={styles.faqAnswer}>
                  {line.trim()}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const ContactSection = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNav>();
  return (
    <View style={styles.contactSection}>
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => Linking.openURL('https://direct.lc.chat/12355815')}
      >
        <Text style={styles.contactButtonText}>
          {t('affiliate.contact.title')}
        </Text>
        <Image
          source={{ uri: imageHandler('/images/common/affiliate/arrow.png') }}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('main-tabs', {
            screen: 'tabs',
            params: {
              screen: 'information',
              params: { tab: 'affiliate' },
            },
          });
        }}
      >
        <Text style={styles.termsLink}>
          {t('affiliate.contact.terms')}
        </Text>
      </TouchableOpacity>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.facebook.com/11indiacricket')
          }
        >
          <Image
            source={{
              uri: imageHandler('/images/common/affiliate/facebook.png'),
            }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.instagram.com/11indiacricket/')
          }
        >
          <Image
            source={{
              uri: imageHandler('/images/common/affiliate/instagram.png'),
            }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- MAIN COMPONENT ---
const AffiliateScreen = () => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  return (
    <ImageBackground
      source={{ uri: imageHandler('/images/common/affiliate/h5bg.png') }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView ref={scrollViewRef}>
        <HeroSection />
        <View style={styles.container}>
          <HowItWorksSection />
          <CommissionPlanSection />
          <WhyBecomeAffiliateSection />
          <FaqSection />
          <ContactSection />
      </View>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
    marginTop: 30,
    fontFamily: 'Roboto-Bold',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -10,
  },
  heroImageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1.25,
  },
  heroTextContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  heroTitleImage: {
    width: '100%',
    height: 180,
    marginBottom: 4,
  },
  partnerButton: {
    backgroundColor: '#FDD160',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginVertical: 20,
  },
  partnerButtonText: {
    color: '#03331f',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  arrowIcon: {
    width: 8,
    height: 8,
    marginLeft: 8,
  },
  partnerInfoBox: {
    backgroundColor: '#ffffff20',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff40',
  },
  partnerInfoText: {
    color: '#E0E0E0',
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 21,
    fontFamily: 'Roboto-Regular',
  },
  // How It Works
  howItWorksItem: {
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ffffff40',
  },
  howItWorksTitle: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Roboto-Bold',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  howItWorksDesc: {
    color: '#E0E0E0',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  // Commission Plan
  commissionNote: {
    color: 'white',
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 26,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  commissionTable: {
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffffff40',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff40',
  },
  tableHeaderText: {
    flex: 1,
    padding: 8,
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff40',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    color: '#ffffff90',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  commissionDisclaimer: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 16,
    lineHeight: 28,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  // Why Become Affiliate
  whyJoinDesc: {
    color: '#E0E0E0',
    marginBottom: 12,
    lineHeight: 21,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  featuresList: {
    marginLeft: 0,
  },
  featureItem: {
    color: '#E0E0E0',
    marginBottom: 4,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  // FAQ
  faqItem: {
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffff40',
    alignItems: 'flex-start',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'Roboto-Bold',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  faqAnswer: {
    color: '#ffffff80',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 28,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    writingDirection: 'ltr',
    alignSelf: 'flex-start',
    width: '100%',
  },
  // Contact
  contactSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  contactButton: {
    backgroundColor: '#FDD160',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  contactButtonText: {
    color: '#03331f',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  termsLink: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
});

export default AffiliateScreen;