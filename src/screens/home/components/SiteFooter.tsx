import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { imageHandler } from '../../../utils/image-url';
import { RootStackNav } from '../../../types/nav';
import Content from '../../../components/Content';
import { useLiveChat } from '../../../store/useUIStore';

const partners = [
  imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/logo_jazzcash_pk/public"),
  imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/logo_ubl_pk/public"),
  imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/logo_easypaisa_pk/public"),
  imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/logo_tether_pk/public"),
  imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/logo_visa_pk/public"),
  imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/logo_mastercard_pk/public"),
];

const SiteFooter = () => {
  const navigation = useNavigation<RootStackNav>();
  const { t } = useTranslation();
  const toggleLiveChatModalVisibility = useLiveChat(
    state => state.toggleLiveChatModalVisibility,
  );

  const socialLinks = [
    {
      name: "Livechat",
      image: imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_livechat_socialnet/public"),
      url: "https://direct.lc.chat/12355815",
      onClick: () => toggleLiveChatModalVisibility(),
    },
    {
      name: "Telegram",
      image: imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_telegram_socialnet/public"),
      url: "",
    },
    {
      name: "Instagram",
      image: imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_instagram_socialnet/public"),
      url: "",
    },
    {
      name: "Facebook",
      image: imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_facebook_socialnet/public"),
      url: "",
    },
    {
      name: "Youtube",
      image: imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_youtube_socialnet/public"),
      url: "",
    },
    {
      name: "WhatsApp",
      image: imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_whatsapp_socialnet/public"),
      url: "https://whatsapp.com/channel/0029VbAedqqKWEKzsg1oKx00",
    },
    {
      name: "Twitter",
      image: imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_twitter_socialnet/public"),
      url: "",
    },
  ];

  const infoLinks = [
    {
      name: t('footer.about-us'),
      tab: 'about' as const,
    },
    {
      name: t('footer.faq'),
      tab: 'faq' as const,
    },
    {
      name: t('footer.privacy-policy'),
      tab: 'privacy' as const,
    },
    {
      name: t('footer.terms-and-conditions'),
      tab: 'terms' as const,
    },
    {
      name: t('footer.affiliate-program'),
      tab: 'affiliate' as const,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Social Networks Section */}
      <Content title={t('footer.social-networks')}>
        <View style={styles.socialContainer}>
          {socialLinks.map(link => (
            <TouchableOpacity
              key={link.name}
              style={[styles.socialButton, { backgroundColor: 'transparent' }]}
              onPress={() => {
                if (link.onClick) {
                  link.onClick();
                } else if (link.url && link.url.trim() !== '') {
                  Linking.openURL(link.url);
                }
              }}
            >
              <Image source={{ uri: link.image }} style={styles.socialIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </Content>

      {/* Info Links Section */}
      <View style={styles.infoLinksContainer}>
        <View style={styles.infoLinkRowGrid}>
          {infoLinks.slice(0, 3).map((link, idx) => (
            <React.Fragment key={link.name}>
              <View style={styles.infoLinkWrapper}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('main-tabs', {
                    screen: 'tabs',
                    params: {
                      screen: 'information',
                      params: { tab: link.tab },
                    },
                  })}
                >
                  <Text style={styles.infoLink}>{link.name}</Text>
                </TouchableOpacity>
              </View>
              {idx < 2 && (
                <View
                  style={[styles.divider, { backgroundColor: '#ffffff30' }]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.infoLinkRow}>
          {infoLinks.slice(3).map((link, idx) => (
            <React.Fragment key={link.name}>
              <TouchableOpacity
                onPress={() => navigation.navigate('main-tabs', {
                  screen: 'tabs',
                  params: {
                    screen: 'information',
                    params: { tab: link.tab },
                  },
                })}
              >
                <Text style={styles.infoLink}>{link.name}</Text>
              </TouchableOpacity>
              {idx < infoLinks.slice(3).length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: '#ffffff30' }]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={[styles.fullDivider, { backgroundColor: '#444' }]} />

      {/* Partners Section */}
      <View style={styles.partnersContainer}>
        <View style={styles.partnerRow}>
          {partners.slice(0, 4).map(partner => (
            <Image
              key={partner}
              source={{ uri: partner }}
              style={styles.partnerImage}
              resizeMode="contain"
            />
          ))}
        </View>
        <View style={styles.partnerRow}>
          {partners.slice(4).map(partner => (
            <Image
              key={partner}
              source={{ uri: partner }}
              style={styles.partnerImage}
              resizeMode="contain"
            />
          ))}
        </View>
      </View>

      {/* Copyright Section */}
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>
          {t('footer.copyright')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    gap: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  infoLinksContainer: {
    alignItems: 'center',
    gap: 8,
  },
  infoLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  infoLinkRowGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  infoLinkWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  infoLink: {
    color: '#504E4E',
    fontSize: 13,
    fontWeight: '400',
  },
  divider: {
    width: 1,
    height: 15,
  },
  fullDivider: {
    width: '100%',
    height: 1,
    marginVertical: 8,
  },
  partnersContainer: {
    gap: 16,
  },
  partnerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  partnerImage: {
    height: 25,
    width: 'auto',
    aspectRatio: 3,
  },
  copyrightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyrightText: {
    color: '#ffffff20',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SiteFooter;
