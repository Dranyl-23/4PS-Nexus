import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type Theme = 'dark' | 'light';
type Language = 'en' | 'ceb' | 'tl';

interface SettingsContextData {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    profile: 'Profile',
    loans: 'Loans',
    merchants: 'Merchants',
    history: 'History',
    scan_to_pay: 'Scan QR to Pay',
    offline_qr: 'Generate Offline QR',
    available_balance: 'Available Balance',
    subsidies: 'Subsidies',
    good_morning: 'Good Morning',
    good_afternoon: 'Good Afternoon',
    good_evening: 'Good Evening',
    view_profile: 'View Profile',
    settings: 'Settings',
    trust_score: 'Trust Score',
    powered_by_defi: 'Powered by DeFi',
    current_score: 'Current Score',
    recent_transactions: 'Recent Transactions',
    see_all: 'See All',
    no_transactions: 'No transactions yet.',
    emergency_loan: 'Emergency Micro-Loan',
    apply_receive: 'Apply & Receive Now',
    requires_score: 'Requires 700 Score',
    registered_address: 'REGISTERED ADDRESS',
    program_category: 'PROGRAM CATEGORY',
    stellar_account: 'FULL STELLAR ACCOUNT ID',
    developer_testing: 'Developer / Testing',
    reset_app: 'Reset App & Clear Wallet',
  },
  ceb: {
    dashboard: 'Dasbord',
    profile: 'Paghulagway',
    loans: 'Utang',
    merchants: 'Tindahan',
    history: 'Kasaysayan',
    scan_to_pay: 'I-scan para Mubayad',
    offline_qr: 'Himo-og Offline QR',
    available_balance: 'Magamit nga Balanse',
    subsidies: 'Ayuda',
    good_morning: 'Maayong Buntag',
    good_afternoon: 'Maayong Hapon',
    good_evening: 'Maayong Gabii',
    view_profile: 'Tan-awa ang Profile',
    settings: 'Mga Settings',
    trust_score: 'Trust Score',
    powered_by_defi: 'Gipadagan sa DeFi',
    current_score: 'Karon nga Score',
    recent_transactions: 'Bag-ong mga Transaksyon',
    see_all: 'Tan-awa Tanan',
    no_transactions: 'Wala pay transaksyon.',
    emergency_loan: 'Emergency nga Utang',
    apply_receive: 'Apply & Dawata Karon',
    requires_score: 'Kinahanglan 700 Score',
    registered_address: 'REHISTRADONG ADDRESS',
    program_category: 'KATEGORYA SA PROGRAMA',
    stellar_account: 'TIBUOK STELLAR ACCOUNT ID',
    developer_testing: 'Developer / Para Test',
    reset_app: 'I-reset & Papasa ang Wallet',
  },
  tl: {
    dashboard: 'Dashboard',
    profile: 'Profile',
    loans: 'Pautang',
    merchants: 'Tindahan',
    history: 'Kasaysayan',
    scan_to_pay: 'I-scan para Magbayad',
    offline_qr: 'Bumuo ng Offline QR',
    available_balance: 'Magagamit na Balanse',
    subsidies: 'Ayuda',
    good_morning: 'Magandang Umaga',
    good_afternoon: 'Magandang Hapon',
    good_evening: 'Magandang Gabi',
    view_profile: 'Tingnan ang Profile',
    settings: 'Mga Setting',
    trust_score: 'Trust Score',
    powered_by_defi: 'Pinapagana ng DeFi',
    current_score: 'Kasalukuyang Score',
    recent_transactions: 'Mga Kamakailang Transaksyon',
    see_all: 'Tingnan Lahat',
    no_transactions: 'Wala pang transaksyon.',
    emergency_loan: 'Emergency Micro-Loan',
    apply_receive: 'Mag-apply & Tanggapin Ngayon',
    requires_score: 'Kailangan ng 700 Score',
    registered_address: 'NAKAREHISTRONG ADDRESS',
    program_category: 'KATEGORYA NG PROGRAMA',
    stellar_account: 'BUONG STELLAR ACCOUNT ID',
    developer_testing: 'Developer / Para sa Test',
    reset_app: 'I-reset & Burahin ang Wallet',
  }
};

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [language, setLanguageState] = useState<Language>('ceb'); // Default to Bisaya for local impact

  useEffect(() => {
    async function loadSettings() {
      const savedTheme = await SecureStore.getItemAsync('app_theme');
      const savedLang = await SecureStore.getItemAsync('app_lang');
      if (savedTheme === 'light' || savedTheme === 'dark') setThemeState(savedTheme);
      if (savedLang === 'en' || savedLang === 'ceb' || savedLang === 'tl') setLanguageState(savedLang);
    }
    loadSettings();
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    SecureStore.setItemAsync('app_theme', newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    SecureStore.setItemAsync('app_lang', newLang);
  };

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
