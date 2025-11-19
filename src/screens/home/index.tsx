import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FeatureBanners from './components/FeatureBanners';
// import LiveSports from './components/LiveSports';
import MostVisited from './components/MostVisited';
// import BlogSection from './components/BlogSection';
import { useHome } from '../../hooks/useHome';
import SiteFooter from './components/SiteFooter';
import Content from '../../components/Content';
import { useTranslation } from 'react-i18next';
import FireSvg from '../../assets/common/content-icons/most-visited.svg';
import CasinoSvg from '../../assets/common/content-icons/casino.svg';
import MiniGamesSvg from '../../assets/common/content-icons/mini-games.svg';
import RocketSvg from '../../assets/common/content-icons/rocket.svg';
import GamePreview from './components/GamePreview';
import BonusSection from './components/BonusSection';
import { getBannerData } from '../../constants/home';
import CustomCarousel from '../../components/CustomCarousel';
import { RootStackNav } from '../../types/nav';
import { usePopUp } from '../../store/useUIStore';
import { useEffect, useMemo, useCallback } from 'react';
import { useUser } from '../../hooks/useUser';
import { useUserStore } from '../../store/useUser';
import React from 'react';

export default function HomeScreen() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<RootStackNav>();
  const { isAuthenticated } = useUser();
  const token = useUserStore(s => s.token);
  const { openPopUp, lastLoginToken, markPopupShownForSession, isOpen } =
    usePopUp();
  const openedForTokenRef = React.useRef<string | null>(null);

  // Memoize callbacks to avoid dependency issues
  const handleOpenPopup = useCallback(() => {
    openPopUp();
  }, [openPopUp]);

  const handleMarkPopupShown = useCallback(
    (authToken: string) => {
      markPopupShownForSession(authToken);
    },
    [markPopupShownForSession],
  );

  useEffect(() => {
    // Only proceed if user is authenticated and has a token
    if (!isAuthenticated || !token?.auth_token) {
      openedForTokenRef.current = null;
      return;
    }

    const currentToken = token.auth_token;

    // If we've already opened for this token in this session, don't open again
    if (openedForTokenRef.current === currentToken) {
      return;
    }

    // If lastLoginToken matches current token, popup was already shown for this session
    // This handles the case where persisted state has loaded
    if (lastLoginToken === currentToken) {
      openedForTokenRef.current = currentToken;
      return;
    }

    // Only open if popup is not already open and lastLoginToken is different (new login)
    // We check lastLoginToken !== currentToken to ensure it's a new login, not just null from hydration
    if (!isOpen && lastLoginToken !== null && lastLoginToken !== currentToken) {
      // New login - mark as shown and open
      handleMarkPopupShown(currentToken);
      openedForTokenRef.current = currentToken;
      handleOpenPopup();
    } else if (!isOpen && lastLoginToken === null) {
      // First time or persisted state not loaded yet
      // Wait a bit to see if persisted state loads, then check again
      // If lastLoginToken is still null after a moment, it's a new login
      const timeoutId = setTimeout(() => {
        const state = usePopUp.getState();
        if (state.lastLoginToken === null || state.lastLoginToken !== currentToken) {
          // Still null or different - it's a new login
          handleMarkPopupShown(currentToken);
          openedForTokenRef.current = currentToken;
          if (!state.isOpen) {
            handleOpenPopup();
          }
        } else {
          // Persisted state loaded and matches - don't open
          openedForTokenRef.current = currentToken;
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [
    isAuthenticated,
    token?.auth_token,
    lastLoginToken,
    isOpen,
    handleOpenPopup,
    handleMarkPopupShown,
  ]);

  const {
    liveCasino,
    slotsGame,
    crashGame,
    isLoading,
    // blogs,
    refetch,
    isRefetching,
  } = useHome();

  // getBannerData uses i18n.language internally, so we depend on language changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bannerData = useMemo(() => getBannerData(), [i18n.language]);

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View style={styles.banner}>
        <CustomCarousel bannerData={bannerData} />
        <FeatureBanners />
      </View>
      {/* <Content
        title={t('content-title.live').toUpperCase()}
        icon={<LiveSvg />}
        more={{
          text: 'All',
          onClick: () =>
            navigation.navigate('main-tabs', {
              screen: 'tabs',
              params: {
                screen: 'sports',
                params: {
                  from: undefined,
                },
              },
            }),
        }}
      >
        <LiveSports />
      </Content> */}
      <Content
        title={t('content-title.slots').toUpperCase()}
        icon={
          <Image
            source={require('../../assets/common/home/slots-icon.png')}
            style={styles.imageIcon}
          />
        }
        more={{
          text: t('common-terms.all'),
          onClick: () =>
            navigation.navigate('main-tabs', {
              screen: 'tabs',
              params: {
                screen: 'slots',
                params: {
                  game_id: undefined,
                },
              },
            }),
        }}
      >
        <GamePreview games={slotsGame} isLoading={isLoading.gamesLoading} rows={3} />
      </Content>
      <Content
        title={t('content-title.most-visited').toUpperCase()}
        icon={<FireSvg />}
      >
        <MostVisited />
      </Content>
      <Content
        title={t('content-title.live-casino').toUpperCase()}
        icon={<CasinoSvg />}
        more={{
          text: t('common-terms.all'),
          onClick: () =>
            navigation.navigate('main-tabs', {
              screen: 'tabs',
              params: {
                screen: 'casino',
              },
            }),
        }}
      >
        <GamePreview games={liveCasino} isLoading={isLoading.gamesLoading} disableAutoSwipe={true} />
      </Content>
      
      <Content
        title={t('content-title.mini-games').toUpperCase()}
        icon={<MiniGamesSvg />}
        more={{
          text: t('common-terms.all'),
          onClick: () =>
            navigation.navigate('main-tabs', {
              screen: 'tabs',
              params: {
                screen: 'slots',
                params: {
                  game_id: 'SPRIBE',
                },
              },
            }),
        }}
      >
        <GamePreview games={crashGame} isLoading={isLoading.gamesLoading} disableAutoSwipe={true} />
      </Content>
      <Content
        title={t('content-title.bonuses').toUpperCase()}
        icon={<RocketSvg />}
        more={{
          text: t('common-terms.all'),
          onClick: () => navigation.navigate('bonus'),
        }}
      >
        <BonusSection />
      </Content>
      {/* <Content
        title={t('content-title.online-betting-blog').toUpperCase()}
        icon={
          <Image
            source={require('../../assets/common/content-icons/online-blogs.png')}
            style={styles.imageIcon}
          />
        }
        more={{
          text: t('common-terms.all'),
          onClick: () =>
            navigation.navigate('blog', {
              screen: 'blogs',
            }),
        }}
      >
        <BlogSection blogs={blogs} isLoading={isLoading.blogsLoading} />
      </Content> */}
      <SiteFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 20,
    padding: 15,
  },
  banner: {
    flexDirection: 'column',
    gap: 12,
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
});
