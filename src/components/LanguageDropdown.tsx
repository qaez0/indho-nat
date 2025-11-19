import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useLanguageStore, LanguageChoice } from '../store/useLanguageStore';
import CountryFlag from '../assets/common/flag.svg';
import { useTranslation } from 'react-i18next';
import Feather from '@react-native-vector-icons/feather';
import { useUser } from '../hooks/useUser';
import i18n from 'i18next';

  interface LanguageDropdownProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
  }

  const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ visible, onClose, onLogout }) => {
    const { CHOICES, selected, setSelected } = useLanguageStore();
    const { t } = useTranslation();
    const { isAuthenticated } = useUser();

    // Sync store with current i18n language on mount
    useEffect(() => {
      const currentLanguage = i18n.language;
      const currentChoice = CHOICES.find(choice => choice.value === currentLanguage);
      if (currentChoice && selected.value !== currentLanguage) {
        setSelected(currentChoice);
      }
    }, [CHOICES, selected.value, setSelected]);

    const handleLanguageSelect = (choice: LanguageChoice) => {
      setSelected(choice);
      onClose();
    };

              const handleLogout = () => {
                onLogout();
              };

    if (!visible) return null;

    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.dropdownContainer}>
                <View style={styles.dropdownContent}>
          {CHOICES.map((choice) => (
            <TouchableOpacity
              key={choice.value}
              style={[
                styles.languageItem,
                selected.value === choice.value && styles.selectedItem,
              ]}
              onPress={() => handleLanguageSelect(choice)}
              accessibilityLabel={`Select ${choice.value === 'en' ? t('language.english') : t('language.pakistan')} language`}
              accessibilityHint="Double tap to select this language"
            >
              <CountryFlag width={20} height={20} />
              <Text
                style={[
                  styles.languageText,
                  selected.value === choice.value && styles.selectedText,
                ]}
              >
                {choice.value === 'en' ? t('language.english') : t('language.pakistan')}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Show logout option only for authenticated users */}
          {isAuthenticated && (
            <>
              {/* Divider */}
              <View style={styles.divider} />
              
              {/* Logout Option */}
              <TouchableOpacity
                style={styles.logoutItem}
                onPress={handleLogout}
                accessibilityLabel="Logout"
                accessibilityHint="Double tap to logout"
              >
                <Feather name="log-out" size={20} color="#ff6b6b" />
                <Text style={styles.logoutText}>
                  {t('language.logout')}
                </Text>
              </TouchableOpacity>
            </>
          )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: 50,
      paddingRight: 15,
    },
    dropdownContainer: {
      backgroundColor: '#2a2a2a',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      minWidth: 150,
    },
    dropdownContent: {
      padding: 8,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginBottom: 4,
    },
    selectedItem: {
      backgroundColor: '#404040',
    },
    languageText: {
      marginLeft: 12,
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },
    selectedText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: '#404040',
      marginVertical: 8,
    },
    logoutItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginTop: 4,
    },
    logoutText: {
      marginLeft: 12,
      color: '#ff6b6b',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  export default LanguageDropdown;
