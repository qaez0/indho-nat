import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TabsParamList } from '../../types/nav';
import About from './components/About';
import FAQ from './components/FAQ';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Affiliate from './components/Affiliate';

type TabValue = 'about' | 'privacy' | 'terms' | 'faq' | 'affiliate';
interface TabProps {
  title: string;
  value: TabValue;
}

type InformationRouteProp = RouteProp<TabsParamList, 'information'>;

const Information: React.FC = () => {
  const route = useRoute<InformationRouteProp>();
  const { t } = useTranslation();
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;

  // Get the tab from route params or default to 'about'
  const initialTab = route.params?.tab || 'about';
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  
  // Ref for ScrollView to reset scroll position when tab changes
  const contentScrollRef = useRef<ScrollView>(null);
  
  // Ref to track if this is the initial mount or a navigation change
  const isInitialMount = useRef(true);
  const previousTabParam = useRef(route.params?.tab);

  // Update active tab when route params change (e.g., when navigating from footer links)
  // But only if the param actually changed, not on every render
  useEffect(() => {
    const currentTabParam = route.params?.tab;
    
    // On initial mount, set the tab from params
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (currentTabParam) {
        setActiveTab(currentTabParam);
      }
      previousTabParam.current = currentTabParam;
      return;
    }
    
    // Only update if the route param changed (navigation from external link)
    // and it's different from the current active tab
    if (currentTabParam && 
        currentTabParam !== previousTabParam.current && 
        currentTabParam !== activeTab) {
      setActiveTab(currentTabParam);
      previousTabParam.current = currentTabParam;
    }
  }, [route.params?.tab]);

  const tabs: TabProps[] = useMemo(
    () => [
      { title: t('information.tabs.about'), value: 'about' },
      { title: t('information.tabs.privacy'), value: 'privacy' },
      { title: t('information.tabs.terms'), value: 'terms' },
      { title: t('information.tabs.faq'), value: 'faq' },
      { title: t('information.tabs.affiliate'), value: 'affiliate' },
    ],
    [t],
  );

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'about':
        return <About />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      case 'faq':
        return <FAQ />;
      case 'affiliate':
        return <Affiliate />;
      default:
        return <About />;
    }
  };

  const handleTabChange = (tabValue: TabValue) => {
    setActiveTab(tabValue);
    // Reset scroll position when tab changes
    contentScrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  // Reset scroll position when activeTab changes (including initial mount)
  useEffect(() => {
    contentScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeTab]);

  return (
    <View style={[styles.container, { backgroundColor: '#181818' }]}>
      <View style={styles.content}>
        {isLargeScreen ? (
          // Desktop/Tablet Layout
          <View style={styles.desktopLayout}>
            {/* Sidebar */}
            <View style={[styles.sidebar, { backgroundColor: '#292929' }]}>
              <ScrollView style={styles.sidebarScroll}>
                {tabs.map(tabItem => (
                  <TouchableOpacity
                    key={tabItem.value}
                    onPress={() => handleTabChange(tabItem.value)}
                    style={[
                      styles.sidebarButton,
                      activeTab === tabItem.value
                        ? { backgroundColor: '#F3B867' }
                        : { backgroundColor: 'transparent' },
                    ]}
                  >
                    <View style={styles.sidebarButtonContent}>
                      <Text
                        style={[
                          styles.sidebarButtonText,
                          activeTab === tabItem.value
                            ? { color: 'black', fontWeight: '900' }
                            : { color: '#d1d1d1' },
                        ]}
                      >
                        {tabItem.title}
                      </Text>
                      <Text
                        style={[
                          styles.chevron,
                          activeTab === tabItem.value
                            ? { color: 'black' }
                            : { color: '#d1d1d1' },
                        ]}
                      >
                        ›
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Content Area */}
            <View
              style={[styles.desktopContent, { backgroundColor: '#292929' }]}
            >
              <ScrollView
                ref={contentScrollRef}
                style={styles.contentScroll}
                showsVerticalScrollIndicator={false}
              >
                {renderActiveComponent()}
              </ScrollView>
            </View>
          </View>
        ) : (
          // Mobile Layout
          <View style={styles.mobileLayout}>
            {/* Mobile Tab Navigation */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mobileTabContainer}
              contentContainerStyle={styles.mobileTabContent}
            >
              {tabs.map(tabItem => (
                <TouchableOpacity
                  key={tabItem.value}
                  onPress={() => handleTabChange(tabItem.value as TabValue)}
                  style={[
                    styles.mobileTabButton,
                    activeTab === tabItem.value
                      ? { backgroundColor: '#F3B867' }
                      : {
                          backgroundColor: 'transparent',
                          borderColor: '#d1d1d1',
                          borderWidth: 1,
                        },
                  ]}
                >
                  <Text
                    style={[
                      styles.mobileTabText,
                      activeTab === tabItem.value
                        ? { color: 'black', fontWeight: '900' }
                        : { color: '#d1d1d1' },
                    ]}
                  >
                    {tabItem.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Mobile Content Area */}
            <ScrollView
              ref={contentScrollRef}
              style={styles.mobileContent}
              showsVerticalScrollIndicator={false}
            >
              {renderActiveComponent()}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  desktopLayout: {
    flexDirection: 'row',
    gap: 24,
    flex: 1,
  },
  sidebar: {
    width: 320,
    borderRadius: 8,
    padding: 16,
  },
  sidebarScroll: {
    flex: 1,
  },
  sidebarButton: {
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
  },
  sidebarButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarButtonText: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    fontSize: 16,
  },
  desktopContent: {
    flex: 1,
    borderRadius: 8,
    padding: 24,
  },
  contentScroll: {
    flex: 1,
  },
  mobileLayout: {
    flex: 1,
    gap: 16,
  },
  mobileTabContainer: {
    maxHeight: 60,
  },
  mobileTabContent: {
    gap: 8,
    paddingHorizontal: 4,
  },
  mobileTabButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileTabText: {
    fontSize: 14,
    textAlign: 'center',
  },
  mobileContent: {
    flex: 1,
  },
});

export default Information;
