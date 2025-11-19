import i18n from 'i18next';
import { useLanguageStore } from '../store/useLanguageStore';

interface NotificationTranslation {
  title: string;
  content: string;
}

// Common notification patterns and their translations
const notificationPatterns = {
  // Welcome messages
  'Welcome to Lucky Envelope': 'लकी लिफाफा में आपका स्वागत है',
  'Welcome to': 'में आपका स्वागत है',
  
  // Deposit messages
  'Deposit of': 'जमा राशि',
  'Deposit amount': 'जमा राशि',
  'Completed': 'पूर्ण',
  'successfully deposited': 'सफलतापूर्वक जमा किया गया',
  'You have successfully deposited': 'आपने सफलतापूर्वक जमा किया है',
  'has been successfully deposited': 'सफलतापूर्वक जमा किया गया है',
  
  // Withdrawal messages
  'Withdrawal of': 'निकासी राशि',
  'successfully withdrawn': 'सफलतापूर्वक निकाला गया',
  'You have successfully withdrawn': 'आपने सफलतापूर्वक निकाला है',
  
  // Expiring messages
  'Expiring Soon!': 'जल्दी समाप्त हो रहा है!',
  'expiring soon': 'जल्दी समाप्त हो रहा है',
  'left in the Lucky Envelope Event': 'लकी लिफाफा इवेंट में बचा है',
  'Just': 'केवल',
  'hour left': 'घंटा बचा',
  'hours left': 'घंटे बचे',
  'minute left': 'मिनट बचा',
  'minutes left': 'मिनट बचे',
  'to complete it and withdraw': 'इसे पूरा करने और निकालने के लिए',
  'to go': 'बचा',
  'to complete and withdraw': 'पूरा करने और निकालने के लिए',
  
  // Bonus messages
  'Bonus': 'बोनस',
  'bonus': 'बोनस',
  'received': 'प्राप्त',
  'You have received': 'आपको प्राप्त हुआ है',
  
  // Time units
  'hour': 'घंटा',
  'hours': 'घंटे',
  'minute': 'मिनट',
  'minutes': 'मिनट',
  'day': 'दिन',
  'days': 'दिन',
  
  // Common words
  'Event': 'इवेंट',
  'event': 'इवेंट',
  'Lucky Envelope': 'लकी लिफाफा',
  'lucky envelope': 'लकी लिफाफा',
  'Only': 'केवल',
  'only': 'केवल',
  'left': 'बचा',
  'remaining': 'शेष',
  'You\'ve joined the': 'आपने शामिल हो गए हैं',
  'You have': 'आपके पास',
  'to complete it': 'इसे पूरा करने के लिए',
  'and withdraw your': 'और अपनी निकालें',
  'Invite a friend now': 'अभी एक दोस्त को आमंत्रित करें',
  'to get': 'पाने के लिए',
  'free spin': 'मुफ्त स्पिन',
  'instantly': 'तुरंत',
  'Invite friends to earn': 'दोस्तों को आमंत्रित करके कमाएं',
  'extra spins too': 'अतिरिक्त स्पिन भी',
  'A free spin is ready for you': 'आपके लिए एक मुफ्त स्पिन तैयार है',
  'Spin now and move closer to': 'अभी स्पिन करें और करीब आएं',
  'Invite Now': 'अभी आमंत्रित करें',
  '1 invite = 1 spin': '1 आमंत्रण = 1 स्पिन',
  'Your Free Spin Awaits': 'आपका मुफ्त स्पिन इंतजार कर रहा है',
  
  // Status messages
  'pending': 'लंबित',
  'processing': 'प्रसंस्करण',
  'failed': 'असफल',
  'cancelled': 'रद्द',
  'approved': 'अनुमोदित',
  'rejected': 'अस्वीकृत',
  'Approved': 'अनुमोदित',
  'Declined': 'अस्वीकृत',
  'Verification': 'सत्यापन',
  'verification': 'सत्यापन',
  'has been successfully verified': 'सफलतापूर्वक सत्यापित किया गया है',
  'has been declined': 'अस्वीकृत किया गया है',
  'Unfortunately': 'दुर्भाग्य से',
  'Please re-upload and try again': 'कृपया फिर से अपलोड करें और पुनः प्रयास करें',
  'Congratulations': 'बधाई हो',
  'Your': 'आपका',
  'has been': 'हो गया है',
  'BANK': 'बैंक',
  'ID': 'आईडी',
  'Cashback Coming': 'कैशबैक आ रहा है',
  'Monday': 'सोमवार',
  'Play more this weekend': 'इस सप्ताहांत और खेलें',
  'and enjoy up to': 'और आनंद लें',
  'cashback on your losses': 'आपकी हानि पर कैशबैक',
  'More games, more rewards waiting for you': 'अधिक गेम, अधिक पुरस्कार आपका इंतजार कर रहे हैं',
  
  // Additional specific patterns from the notification examples
  'You\'ve joined the Lucky Envelope Event!': 'आपने लकी लिफाफा इवेंट में शामिल हो गए हैं!',
  'You have 72 hours to complete it and withdraw your': 'आपके पास इसे पूरा करने और अपनी निकालने के लिए 72 घंटे हैं',
  'to go!': 'बचा!',
  'Invite a friend now to get 1 free spin instantly.': 'अभी एक दोस्त को आमंत्रित करें और तुरंत 1 मुफ्त स्पिन पाएं।',
  'A free spin is ready for you in the Lucky Envelope Event!': 'लकी लिफाफा इवेंट में आपके लिए एक मुफ्त स्पिन तैयार है!',
  'Spin now and move closer to withdrawing your': 'अभी स्पिन करें और अपनी निकालने के लिए करीब आएं',
  'Invite friends to earn extra spins too!': 'अतिरिक्त स्पिन कमाने के लिए दोस्तों को भी आमंत्रित करें!',
  'Play more this weekend and enjoy up to 8% cashback on your losses.': 'इस सप्ताहांत और खेलें और अपनी हानि पर 8% तक कैशबैक का आनंद लें।',
  'Congratulations! Your BANK has been successfully verified.': 'बधाई हो! आपका बैंक सफलतापूर्वक सत्यापित किया गया है।',
  'Congratulations! Your ID has been successfully verified.': 'बधाई हो! आपकी आईडी सफलतापूर्वक सत्यापित की गई है।',
  'Unfortunately, your BANK verification has been declined.': 'दुर्भाग्य से, आपका बैंक सत्यापन अस्वीकृत कर दिया गया है।',
  'Unfortunately, your ID verification has been declined.': 'दुर्भाग्य से, आपकी आईडी सत्यापन अस्वीकृत कर दी गई है।',
  'Please re-upload and try again.': 'कृपया फिर से अपलोड करें और पुनः प्रयास करें।',
};

// Function to translate notification text
export const translateNotification = (title: string, content: string): NotificationTranslation => {
  const currentLanguage = i18n.language;
  const languageStore = useLanguageStore.getState();
  const isHindi = currentLanguage === 'hi' || languageStore.selected.value === 'hi';
  
  // Debug logging (uncomment for debugging)
  // console.log('Translation Debug:', {
  //   currentLanguage,
  //   languageStore: languageStore.selected.value,
  //   isHindi,
  //   originalTitle: title,
  //   originalContent: content,
  // });
  
  // If language is not Hindi, return original text
  if (!isHindi) {
    return { title, content };
  }
  
  let translatedTitle = title;
  let translatedContent = content;
  
  // Apply pattern-based translations in order of specificity (longer patterns first)
  const sortedPatterns = Object.entries(notificationPatterns).sort((a, b) => b[0].length - a[0].length);
  
  sortedPatterns.forEach(([english, hindi]) => {
    const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    
    translatedTitle = translatedTitle.replace(regex, hindi);
    translatedContent = translatedContent.replace(regex, hindi);
    
    // Debug specific replacements (uncomment for debugging)
    // if (beforeTitle !== translatedTitle || beforeContent !== translatedContent) {
    //   console.log(`Replaced "${english}" with "${hindi}"`);
    // }
  });
  
  // Additional specific pattern handling
  // Handle currency amounts with better formatting
  translatedTitle = translatedTitle.replace(/Rs(\d+(?:\.\d{2})?)/g, 'रुपये $1');
  translatedContent = translatedContent.replace(/Rs(\d+(?:\.\d{2})?)/g, 'रुपये $1');
  
  // Handle time patterns
  translatedContent = translatedContent.replace(/(\d+)\s+hours?\s+to\s+complete/g, '$1 घंटे पूरा करने के लिए');
  translatedContent = translatedContent.replace(/(\d+)\s+hour\s+left/g, '$1 घंटा बचा');
  translatedContent = translatedContent.replace(/(\d+)\s+hours?\s+left/g, '$1 घंटे बचे');
  
  // Debug translation result (uncomment for debugging)
  // console.log('Translation Result:', {
  //   translatedTitle,
  //   translatedContent,
  // });
  
  return {
    title: translatedTitle,
    content: translatedContent,
  };
};

// Function to translate specific notification types
export const translateNotificationType = (type: string): string => {
  const currentLanguage = i18n.language;
  const languageStore = useLanguageStore.getState();
  const isHindi = currentLanguage === 'hi' || languageStore.selected.value === 'hi';
  
  if (!isHindi) {
    return type;
  }
  
  const typeTranslations: { [key: string]: string } = {
    'deposit': 'जमा',
    'withdrawal': 'निकासी',
    'bonus': 'बोनस',
    'promotion': 'प्रचार',
    'lucky_envelope': 'लकी लिफाफा',
    'welcome': 'स्वागत',
    'expiry': 'समाप्ति',
    'reminder': 'अनुस्मारक',
  };
  
  return typeTranslations[type.toLowerCase()] || type;
};

// Function to format currency in Hindi
export const formatCurrencyForHindi = (text: string): string => {
  const currentLanguage = i18n.language;
  const languageStore = useLanguageStore.getState();
  const isHindi = currentLanguage === 'hi' || languageStore.selected.value === 'hi';
  
  if (!isHindi) {
    return text;
  }
  
  // Replace Rs symbol with "रुपये" for better Hindi readability
  return text.replace(/Rs/g, 'रुपये ');
};
