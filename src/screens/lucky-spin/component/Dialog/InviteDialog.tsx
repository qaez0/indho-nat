import { Modal, Text, useTheme } from '@ui-kitten/components';
import { useRef, useState } from 'react';
import {
  Linking,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import Logo from '../../../../assets/logo.svg';
import Feather from '@react-native-vector-icons/feather';
import QRCode from 'react-native-qrcode-svg';
import type { DialogProps } from '.';
import { useQuery } from '@tanstack/react-query';
import { useLuckySpin } from '../../useLuckySpin';
import { getInvitationCards } from '../../../../constants/lucky-spin';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { hasAndroidPermission } from '../../../../utils/permissions';
import toastConfig from '../../../../components/toast';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

const InviteDialog = ({ open, onClose }: DialogProps) => {
  const [activeAction, setActiveAction] = useState<boolean>(false);
  const { getInviteLink } = useLuckySpin();
  const viewShotRef = useRef<ViewShot | null>(null);

  const { data } = useQuery({
    queryKey: ['invite-link'],
    queryFn: getInviteLink,
    enabled: open,
  });

  const saveToGallery = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      Toast.show({
        type: 'error',
        text1: 'Permission not granted',
      });
      return;
    }
    const node = viewShotRef.current;
    if (!node || typeof (node as any).capture !== 'function') {
      return;
    }
    try {
      const uri = await (node as any).capture();
      await CameraRoll.save(uri, { type: 'photo' });
      Toast.show({ type: 'success', text1: 'Saved to gallery' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to save image' });
    }
  };

  const handleShare = (platform: string) => {
    const inviteUrl = `https://11ic.pk/download/?i=${data?.data?.invite_code}`;
    const shareText =
      "Join 11ic and get 1000 rupees FREE bonus! Play games and withdraw real money! Don't miss this opportunity!";

    if (!inviteUrl) {
      Toast.show({
        type: 'error',
        text1: 'Invite link not available',
      });
      onClose();
      return;
    }

    const fullMessage = `${shareText}\n\n${inviteUrl}`;

    switch (platform) {
      case 'whatsapp': {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          fullMessage,
        )}`;
        Linking.openURL(whatsappUrl);
        break;
      }

      case 'facebook': {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          inviteUrl,
        )}&quote=${encodeURIComponent(shareText)}`;
        Linking.openURL(facebookUrl);
        break;
      }

      case 'telegram': {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
          inviteUrl,
        )}&text=${encodeURIComponent(shareText)}`;
        Linking.openURL(telegramUrl);
        break;
      }

      case 'instagram': {
        Linking.openURL('https://www.instagram.com/direct/inbox/');
        break;
      }

      case 'tiktok': {
        Linking.openURL('https://www.tiktok.com/messages');
        break;
      }

      case 'youtube': {
        Linking.openURL('https://www.youtube.com/@c11betph');
        break;
      }
      case 'sms': {
        const smsUrl = `sms:&body=${encodeURIComponent(fullMessage)}`;
        Linking.openURL(smsUrl);
        break;
      }
      case 'email': {
        const emailSubject = 'Check out this amazing opportunity!';
        const emailUrl = `mailto:?subject=${encodeURIComponent(
          emailSubject,
        )}&body=${encodeURIComponent(fullMessage)}`;
        Linking.openURL(emailUrl);
        break;
      }
      default:
        Toast.show({
          type: 'error',
          text1: 'Platform not supported',
        });
    }
    onClose();
  };

  return (
    <Modal
      visible={open}
      backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onBackdropPress={onClose}
      animationType="fade"
    >
      <View style={{ gap: 12 }}>
        <CardCarousel
          inviteLink={`https://11ic.pk/download/?i=${data?.data?.invite_code}`}
          viewShotRef={viewShotRef}
        />
        <InviteHandler
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          handleSaveImage={saveToGallery}
          handleShare={handleShare}
          inviteLink={`https://11ic.pk/download/?i=${data?.data?.invite_code}`}
        />
        <ShareActionDrawer
          open={activeAction}
          onClose={() => setActiveAction(false)}
          handleShare={handleShare}
        />
      </View>
      <Toast config={toastConfig} position="top" visibilityTime={3000} />
    </Modal>
  );
};

export default InviteDialog;

const CardCarousel = ({
  inviteLink,
  viewShotRef,
}: {
  inviteLink: string;
  viewShotRef: React.MutableRefObject<ViewShot | null>;
}) => {
  const { t } = useTranslation();
  const invitationCard = getInvitationCards(t);
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { width: screenWidth } = Dimensions.get('window');

  const cardWidth = 280;
  const cardHeight = 498;

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View
      style={{
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ViewShot
        ref={viewShotRef}
        options={{
          fileName: `11ic-invite-card-${index}`,
          format: 'jpg',
          quality: 0.9,
        }}
        style={{
          height: cardHeight,
          width: cardWidth,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        <ImageBackground
          source={{ uri: item.src }}
          style={{ flex: 1, height: '100%', width: '100%' }}
        >
          <LinearGradient
            colors={['#00000010', '#000000']}
            start={{ x: 0, y: 0.7 }}
            end={{ x: 0, y: 1 }}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: 5,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#fff',
                textAlign: 'center',
                lineHeight: 16,
                textShadowColor: '#000',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 1,
              }}
            >
              {item.text}
            </Text>
          </LinearGradient>
        </ImageBackground>
        <View
          style={{
            height: 118,
            backgroundColor: '#000',
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <Logo width={83} height={32} />
          {inviteLink ? (
            <QRCode value={inviteLink} size={80} quietZone={3} />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 10, color: '#aaa' }}>Loading…</Text>
            </View>
          )}
        </View>
      </ViewShot>
    </View>
  );

  return (
    <View style={{ gap: 12 }}>
      <Carousel
        ref={carouselRef}
        loop
        width={screenWidth}
        height={cardHeight}
        data={invitationCard}
        scrollAnimationDuration={1000}
        onProgressChange={progress}
        renderItem={renderItem}
        autoPlay={true}
        autoPlayInterval={3000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.95,
          parallaxScrollingOffset: 160,
          parallaxAdjacentItemScale: 0.8,
        }}
      />

      <Pagination.Custom
        data={invitationCard}
        progress={progress}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
        }}
        activeDotStyle={{
          backgroundColor: '#F3B867',
          width: 24,
        }}
        containerStyle={{ gap: 5 }}
        onPress={onPressPagination}
        horizontal
      />
    </View>
  );
};

interface InviteHandlerProps {
  activeAction: boolean;
  setActiveAction: (activeAction: boolean) => void;
  handleSaveImage: () => void;
  handleShare: (platform: string) => void;
  inviteLink: string;
}
const InviteHandler = ({
  setActiveAction,
  handleSaveImage,
  inviteLink,
}: InviteHandlerProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => setActiveAction(true)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        <Feather name="share-2" size={20} color="#fff" />
        <Text style={{ fontSize: 12, fontWeight: '600' }}>Share</Text>
      </TouchableOpacity>
      <View
        style={{
          width: 1,
          height: 16,
          backgroundColor: 'rgba(255,255,255,0.1)',
        }}
      />
      <TouchableOpacity
        onPress={handleSaveImage}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        <Feather name="download" size={20} color="#fff" />
        <Text style={{ fontSize: 12, fontWeight: '600' }}>Save Image</Text>
      </TouchableOpacity>
      <View
        style={{
          width: 1,
          height: 16,
          backgroundColor: 'rgba(255,255,255,0.1)',
        }}
      />
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        onPress={() => {
          if (!inviteLink) {
            Toast.show({
              type: 'error',
              text1: 'Invite link not available',
            });
            return;
          }
          Clipboard.setString(inviteLink);
        }}
      >
        <Feather name="link" size={20} color="#fff" />
        <Text style={{ fontSize: 12, fontWeight: '600' }}>Copy Link</Text>
      </TouchableOpacity>
    </View>
  );
};

export const ShareActionDrawer = ({
  open,
  onClose,
  handleShare,
}: {
  open: boolean;
  onClose: () => void;
  handleShare: (platform: string) => void;
}) => {
  const theme = useTheme();
  if (!open) return null;
  return (
    <Modal
      visible={open}
      backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onBackdropPress={onClose}
      animationType="fade"
    >
      <View
        style={{
          width: 320,
          borderRadius: 16,
          backgroundColor: theme['bg-secondary'] ?? '#323631',
          padding: 16,
          gap: 16,
        }}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text category="s1" style={{ fontWeight: '700' }}>
            Share and Earn
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{ position: 'absolute', right: 0 }}
          >
            <Feather name="x" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 12,
          }}
        >
          {[
            { platform: 'facebook', icon: 'facebook-f', iconStyle: 'brand' },
            { platform: 'whatsapp', icon: 'whatsapp', iconStyle: 'brand' },
            { platform: 'instagram', icon: 'instagram', iconStyle: 'brand' },
            { platform: 'tiktok', icon: 'tiktok', iconStyle: 'brand' },
            { platform: 'youtube', icon: 'youtube', iconStyle: 'brand' },
            { platform: 'telegram', icon: 'telegram', iconStyle: 'brand' },
            { platform: 'sms', icon: 'comment-sms', iconStyle: 'solid' },
            { platform: 'email', icon: 'envelope', iconStyle: 'solid' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleShare(item.platform)}
              style={{ width: '22%', alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#F3B867',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <FontAwesome6
                  iconStyle={item.iconStyle as any}
                  name={item.icon as any}
                  size={20}
                  color="#000"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};
