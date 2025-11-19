import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LanguageChoice {
  label: string;
  value: string;
}

interface LanguageState {
  CHOICES: LanguageChoice[];
  selected: LanguageChoice;
  setSelected: (choice: LanguageChoice) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      CHOICES: [
        {
          label: 'English',
          value: 'en',
        },
        {
          label: 'Pakistan',
          value: 'pk',
        },
      ],
      selected: {
        label: 'Pakistan',
        value: 'pk',
      },
      setSelected: choice => {
        set({ selected: choice });
        i18n.changeLanguage(choice.value);
      },
    }),
    {
      name: '11ic-native-language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      onRehydrateStorage: () => state => {
        if (state && state.selected) {
          i18n.changeLanguage(state.selected.value);
        } else {
          // If no stored state, ensure i18n is set to default 'pk'
          i18n.changeLanguage('pk');
        }
      },
    },
  ),
);
