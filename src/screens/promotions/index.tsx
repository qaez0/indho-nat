import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { imageHandler } from '../../utils/image-url';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';


interface Promotion {
  id: number;
  titleKey: string;
  descriptionKey: string;
  cardImage: string;
  detailImage: string | number;
  endDate: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PromotionsScreen() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { t , i18n } = useTranslation();
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (selectedPromotion?.detailImage) {
      if (typeof selectedPromotion.detailImage === 'string') {
        const uri = imageHandler(selectedPromotion.detailImage);
        Image.getSize(uri, (width, height) => {
          setImageSize({ width, height });
        });
      } else {
        // For local images (require), get size from the asset
        const image = Image.resolveAssetSource(selectedPromotion.detailImage);
        if (image) {
          setImageSize({ width: image.width, height: image.height });
        }
      }
    }
  }, [selectedPromotion]);
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );
  const promotions: Promotion[] = [

    {
      id: 1,
      titleKey: t("promotions.title-6"),
      descriptionKey: t("promotions.description-6"),
      cardImage: i18n.language === "en"
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/11%25_promotion_page/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_11%25pk_banner/public"
          ),
      detailImage: i18n.language === "pk"
      ? require('../../assets/common/promotions/11lossback.jpg')
      : require('../../assets/common/promotions/11lossback.jpg'),
      endDate: "2025-01-01",
    },
    {
      id: 2,
      titleKey: t("promotions.title-7"),
      descriptionKey: t("promotions.description-7"),
      cardImage: i18n.language === "en"
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/holiday_promo_page/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/home_holidaypk_banner/public"
          ),
      detailImage: i18n.language === "pk"
      ? require('../../assets/common/promotions/100holdep.jpg')
      : require('../../assets/common/promotions/100holdep.jpg'),
      endDate: "2025-01-01",
    },
    {
      id: 3,
      titleKey: t("promotions.title-2"),
      descriptionKey: t("promotions.description-2"),
      cardImage: i18n.language === "en"
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_100%25_banner1/public"
          )
        : "https://11ic.fun/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner2/public",
      detailImage: i18n.language === "pk"
        ? require('../../assets/common/promotions/promotions-first-deposit-v2.jpg')
        : require('../../assets/common/promotions/promotions-first-deposit.jpg'),
      endDate: "2025-01-01",
    },
    {
      id: 4,
      titleKey: t("promotions.title-3"),
      descriptionKey: t("promotions.description-3"),
      cardImage: i18n.language === "en"
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_T20_banner2/public "
          )
        : "https://11ic.fun/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner3/public",
        detailImage: i18n.language === "pk"
        ? require('../../assets/common/promotions/promotions-t20cashback-v2.jpg')
        : require('../../assets/common/promotions/promotions-t20cashback.jpg'),
      endDate: "Apply Now!",
    },
    {
      id: 5,
      titleKey: t("promotions.title-5"),
      descriptionKey: t("promotions.description-5"),
      cardImage: i18n.language === "en"
      ? imageHandler(
          "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner1/public"
        )
      :  imageHandler("/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner1/public"),
      detailImage: i18n.language === "pk"
      ? require('../../assets/common/promotions/promotions-affiliate-v2.jpg')
      : require('../../assets/common/promotions/promotions-affiliate-pkt.jpg'),

      endDate: "Apply Now!",
    },
  ];

  const PromotionCard = ({ promotion }: { promotion: Promotion }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image
          source={{ uri: promotion.cardImage }}
          style={styles.cardImage}
          resizeMode="stretch"
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTextContainer}>
              <View style={styles.cardTextContainerTop}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {t(promotion.titleKey)}
                </Text>
                <TouchableOpacity
                  style={[styles.detailsButton, { backgroundColor: '#f3b867' }]}
                  onPress={() => setSelectedPromotion(promotion)}
                >
                  <Text style={styles.detailsButtonText}>
                    {t('promotions.check-details')}
                  </Text>
                  <Image
                    source={require('../../assets/common/promotions/arrowright.png')}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.cardTextContainerTop}>
                <Text style={styles.cardDescription} numberOfLines={1}>
                  {t(promotion.descriptionKey)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const PromotionDetailModal = () => (
    <Modal
      visible={!!selectedPromotion}
      animationType="fade"
      onRequestClose={() => setSelectedPromotion(null)}
      backdropColor="rgba(0,0,0,0.4)"
    >
      <View
        style={{
          height: screenHeight * 0.5,
          margin: 20,
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {selectedPromotion && (
          <ScrollView
            style={{
              flex: 1,
            }}
          >
            <Image
              source={
                typeof selectedPromotion.detailImage === 'string'
                  ? { uri: imageHandler(selectedPromotion.detailImage) }
                  : selectedPromotion.detailImage
              }
              style={{
                width: screenWidth - 20,
                height: imageSize
                  ? (screenWidth - 20) * (imageSize.height / imageSize.width)
                  : 300,
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />
          </ScrollView>
        )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedPromotion(null)}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme['bg-primary'] }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.promotionsGrid}>
          {promotions.map(promotion => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </View>
      </ScrollView>
      <PromotionDetailModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  promotionsGrid: {
    gap: 16,
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    boxSizing: 'border-box',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#474747',
    paddingTop: 0,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: (screenWidth - 32) / 2,
    marginTop: -2,
    alignSelf: 'flex-start',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTextContainerTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  detailsButtonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  arrowIcon: {
    width: 8,
    height: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
