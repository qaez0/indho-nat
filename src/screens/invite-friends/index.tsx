import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Clipboard,
} from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';
import { getInviteLink } from '../../services/envelope.service';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../../hooks/useUser';

const InviteFriendsScreen = () => {
  const { isAuthenticated } = useUser();

  const { data } = useQuery({
    queryKey: ['invite-link'],
    queryFn: getInviteLink,
    enabled: isAuthenticated,
  });

  const details = [
    {
      title: 'Invitation Link',
      value: `https://11ic.pk/?i=${data?.data?.invite_code}`,
    },
    {
      title: 'Download APP',
      value: `https://11ic.pk/download/?i=${data?.data?.invite_code}`,
    },
    {
      title: 'Invitation Code',
      value: data?.data?.invite_code,
    },
  ];

  return (
    <ImageBackground
      source={require('../../assets/common/invite-friends/mob.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.titleGreen} category="h1">
              INVITE YOUR
            </Text>
            <Text style={styles.titleWhite} category="h1">
              FRIENDS NOW !
            </Text>
          </View>
          <View style={styles.bonusContainer}>
            <Text style={styles.bonusText}>EARN BONUS EVERYDAY</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <QRCode
            value={`https://11ic.pk/download/?i=${data?.data?.invite_code}`}
            size={128}
            backgroundColor="white"
            color="black"
            quietZone={4}
          />

          <View style={styles.detailsContainer}>
            {details.map(detail => (
              <LinkBox
                key={detail.title}
                title={detail.title}
                value={detail.value || ''}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default InviteFriendsScreen;

const LinkBox = ({ title, value }: { title: string; value: string }) => {
  const handleCopy = async () => {
    try {
      await Clipboard.setString(value);
      Toast.show({
        type: 'success',
        text1: 'Copied to clipboard',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to copy to clipboard',
      });
    }
  };

  return (
    <View style={styles.linkBox}>
      <View style={styles.linkContent}>
        <Text style={styles.linkTitle}>{title}</Text>
        <Text style={styles.linkValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Button
        onPress={handleCopy}
        style={styles.copyButton}
        appearance="filled"
        status="success"
      >
        {() => <Text style={styles.copyButtonText}>copy</Text>}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 40,
    display: 'flex',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  titleGreen: {
    fontSize: 36,
    color: '#66F318',
    lineHeight: 36,
    fontWeight: '900',
    fontFamily: 'Montserrat-Black',
  },
  titleWhite: {
    fontSize: 36,
    color: '#fff',
    lineHeight: 36,
    fontWeight: '900',
    fontFamily: 'Montserrat-Black',
  },
  bonusContainer: {
    backgroundColor: 'white',
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: 8,
    transform: [{ skewX: '-30deg' }],
  },
  bonusText: {
    fontFamily: 'Montserrat-Black',
    fontSize: 24,
    fontWeight: '900',
    color: '#3EAD00',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'column',
    gap: 13,
    width: '100%',
    maxWidth: 400,
  },
  linkBox: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linkContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.71)',
    gap: 8,
  },
  linkTitle: {
    fontFamily: 'Montserrat-Black',
    fontSize: 12,
    fontWeight: '900',
    color: '#6C6C6C',
    flexShrink: 0,
  },
  linkValue: {
    fontFamily: 'Montserrat-Black',
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    flex: 1,
  },
  copyButton: {
    backgroundColor: '#61B617',
    width: 60,
    height: '100%',
    borderRadius: 0,
    borderWidth: 0,
  },
  copyButtonText: {
    fontFamily: 'Montserrat-Black',
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
  },
});
