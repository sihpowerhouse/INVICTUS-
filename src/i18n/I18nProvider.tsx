import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import en from './locales/en';
import te from './locales/te';
import hi from './locales/hi';

export type Language = 'EN' | 'TE' | 'HI';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries = {
  EN: en,
  TE: te,
  HI: hi
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('invictus_lang') as Language) || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('invictus_lang', language);
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const t = (key: string): string => {
    const dict = dictionaries[language] as Record<string, string>;
    const fallbackDict = dictionaries['EN'] as Record<string, string>;
    return dict[key] || fallbackDict[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
