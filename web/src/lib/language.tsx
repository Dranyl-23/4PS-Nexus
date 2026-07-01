'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'english' | 'tagalog' | 'cebuano';

export const translations = {
  english: {
    dashboard: 'Dashboard',
    transfer: 'Transfer',
    merchants: 'Merchants',
    compliance: 'Compliance',
    account: 'Account',
    transactions: 'Transactions',
    settings: 'Settings',
    scanToPay: 'Scan to Pay',
    availableBalance: 'Available Balance',
    verified: 'KYC Verified',
    audited: 'DSWD Audited',
    verifyingAccess: 'Verifying access...',
    totalBalance: 'Total Balance',
    foodBudget: 'Food Budget',
    educationBudget: 'Education Budget',
    healthBudget: 'Health Budget',
    recentActivity: 'Recent Activity',
    noTransactions: 'No transactions yet.',
    // Settings page
    settingsTitle: 'Settings',
    settingsSubtitle: 'Preferences',
    settingsDesc: 'Manage your account details, notifications, and security.',
    personalInfo: 'Personal Info',
    notifications: 'Notifications',
    security: 'Security',
    language: 'Language',
    personalInformation: 'Personal Information',
    dswdId: 'DSWD ID / Household ID',
    accountStatus: 'Account Status',
    connectedWallet: 'Connected Wallet (Stellar Public Key)',
    copy: 'Copy',
    infoNote: 'Info can only be updated via DSWD LGU offices.',
    notificationPreferences: 'Notification Preferences',
    allSystemsActive: 'All Systems Active',
    smsAlerts: 'SMS Alerts',
    smsAlertsDesc: 'Receive texts for payouts & emergency funds',
    emailAlerts: 'Email Alerts',
    emailAlertsDesc: 'Get monthly digital statements',
    networkAlerts: 'Stellar Network Alerts',
    networkAlertsDesc: 'Push notifications for on-chain deposits & transfers',
    complianceReminders: 'Compliance Reminders',
    complianceRemindersDesc: 'Get notified 5 days before document deadlines',
    accountSecurity: 'Account Security',
    passkeyAuth: 'Passkey Authentication',
    passkeyDesc: 'Your account is secured using WebAuthn Passkeys. No passwords required.',
    enabledOnDevice: 'Enabled on this device',
    emergencyFreeze: 'Emergency Freeze',
    emergencyFreezeDesc: 'If your phone is lost or stolen, you can instantly freeze your Soroban Smart Wallet. This blocks all outgoing transactions until you verify your identity at a DSWD office.',
    freezeWalletNow: 'Freeze Wallet Now',
    languagePreferences: 'Language Preferences',
    languageNote: 'Changes will be applied across the entire application.',
    freezeConfirmTitle: 'Freeze Wallet?',
    freezeConfirmDesc: 'This action will invoke a Soroban Smart Contract function to lock your funds. You will need to visit a DSWD office with your ID to unlock it.',
    cancel: 'Cancel',
    yesFreezeIt: 'Yes, Freeze It',
    callingContract: 'Calling Smart Contract...',
    lockingFunds: 'Locking your 4P-Tokens on the Stellar blockchain.',
    walletFrozen: 'Wallet Frozen!',
    frozenDesc: 'Your funds are now safe. Please visit the nearest DSWD LGU office with a valid ID to request an account recovery.',
    close: 'Close',
  },
  tagalog: {
    dashboard: 'Dashboard',
    transfer: 'Paglipat',
    merchants: 'Mga Mangangalakal',
    compliance: 'Pagsunod',
    account: 'Account',
    transactions: 'Mga Transaksyon',
    settings: 'Mga Setting',
    scanToPay: 'I-scan para Magbayad',
    availableBalance: 'Natitirang Balanse',
    verified: 'KYC Verified',
    audited: 'DSWD Audited',
    verifyingAccess: 'Bine-verify ang access...',
    totalBalance: 'Kabuuang Balanse',
    foodBudget: 'Budget sa Pagkain',
    educationBudget: 'Budget sa Edukasyon',
    healthBudget: 'Budget sa Kalusugan',
    recentActivity: 'Kamakailang Aktibidad',
    noTransactions: 'Wala pang mga transaksyon.',
    // Settings page
    settingsTitle: 'Mga Setting',
    settingsSubtitle: 'Mga Kagustuhan',
    settingsDesc: 'Pamahalaan ang iyong account, mga notipikasyon, at seguridad.',
    personalInfo: 'Personal na Impormasyon',
    notifications: 'Mga Abiso',
    security: 'Seguridad',
    language: 'Wika',
    personalInformation: 'Personal na Impormasyon',
    dswdId: 'DSWD ID / Household ID',
    accountStatus: 'Katayuan ng Account',
    connectedWallet: 'Konektadong Wallet (Stellar Public Key)',
    copy: 'Kopyahin',
    infoNote: 'Ang impormasyon ay maaari lamang i-update sa pamamagitan ng DSWD LGU offices.',
    notificationPreferences: 'Mga Kagustuhan sa Abiso',
    allSystemsActive: 'Lahat ng Sistema ay Aktibo',
    smsAlerts: 'Mga SMS Alert',
    smsAlertsDesc: 'Tumanggap ng mga text para sa mga payout at emergency funds',
    emailAlerts: 'Mga Email Alert',
    emailAlertsDesc: 'Makakuha ng buwanang digital na pahayag',
    networkAlerts: 'Mga Alerto sa Stellar Network',
    networkAlertsDesc: 'Push notifications para sa on-chain deposits at transfers',
    complianceReminders: 'Mga Paalala sa Pagsunod',
    complianceRemindersDesc: 'Maabisuhan 5 araw bago ang mga deadline ng dokumento',
    accountSecurity: 'Seguridad ng Account',
    passkeyAuth: 'Passkey Authentication',
    passkeyDesc: 'Ang iyong account ay secured gamit ang WebAuthn Passkeys. Hindi kailangan ng password.',
    enabledOnDevice: 'Pinagana sa device na ito',
    emergencyFreeze: 'Emergency Freeze',
    emergencyFreezeDesc: 'Kung nawala o nanakaw ang iyong telepono, maaari mong agad na i-freeze ang iyong Soroban Smart Wallet. Ito ay humahadlang sa lahat ng papalabas na transaksyon hanggang ma-verify mo ang iyong pagkakakilanlan sa isang DSWD office.',
    freezeWalletNow: 'I-freeze ang Wallet Ngayon',
    languagePreferences: 'Mga Kagustuhan sa Wika',
    languageNote: 'Ang mga pagbabago ay ilalapat sa buong application.',
    freezeConfirmTitle: 'I-freeze ang Wallet?',
    freezeConfirmDesc: 'Ang aksyong ito ay mag-i-invoke ng Soroban Smart Contract function para i-lock ang iyong mga pondo. Kailangan mong bisitahin ang isang DSWD office na may valid na ID para i-unlock ito.',
    cancel: 'Kanselahin',
    yesFreezeIt: 'Oo, I-freeze Ito',
    callingContract: 'Tinatawagan ang Smart Contract...',
    lockingFunds: 'Ino-lock ang iyong 4P-Tokens sa Stellar blockchain.',
    walletFrozen: 'Na-freeze ang Wallet!',
    frozenDesc: 'Ligtas na ang iyong mga pondo. Bisitahin ang pinakamalapit na DSWD LGU office na may valid na ID para humiling ng account recovery.',
    close: 'Isara',
  },
  cebuano: {
    dashboard: 'Dashboard',
    transfer: 'Pagpadala',
    merchants: 'Mga Negosyo',
    compliance: 'Pagsunod',
    account: 'Account',
    transactions: 'Mga Transaksyon',
    settings: 'Mga Setting',
    scanToPay: 'I-Scan para Mubayad',
    availableBalance: 'Nabilin nga Balanse',
    verified: 'KYC Verified',
    audited: 'DSWD Audited',
    verifyingAccess: 'Gisusi ang access...',
    totalBalance: 'Tibuok Balanse',
    foodBudget: 'Budget sa Pagkaon',
    educationBudget: 'Budget sa Edukasyon',
    healthBudget: 'Budget sa Kalusugan',
    recentActivity: 'Bag-ong Kalihokan',
    noTransactions: 'Walay transaksyon pa.',
    // Settings page
    settingsTitle: 'Mga Setting',
    settingsSubtitle: 'Mga Kagustuhan',
    settingsDesc: 'I-manage ang imong account, mga notipikasyon, ug seguridad.',
    personalInfo: 'Personal nga Impormasyon',
    notifications: 'Mga Abiso',
    security: 'Seguridad',
    language: 'Sinultian',
    personalInformation: 'Personal nga Impormasyon',
    dswdId: 'DSWD ID / Household ID',
    accountStatus: 'Status sa Account',
    connectedWallet: 'Konektadong Wallet (Stellar Public Key)',
    copy: 'Kopyahon',
    infoNote: 'Ang impormasyon ma-update lang pinaagi sa DSWD LGU offices.',
    notificationPreferences: 'Mga Kagustuhan sa Abiso',
    allSystemsActive: 'Aktibo ang Tanang Sistema',
    smsAlerts: 'Mga SMS Alert',
    smsAlertsDesc: 'Makadawat og text para sa mga payout ug emergency funds',
    emailAlerts: 'Mga Email Alert',
    emailAlertsDesc: 'Makakuha og buwanang digital nga pahayag',
    networkAlerts: 'Mga Alerto sa Stellar Network',
    networkAlertsDesc: 'Push notifications para sa on-chain deposits ug transfers',
    complianceReminders: 'Mga Paalala sa Pagsunod',
    complianceRemindersDesc: 'Maabisuhan 5 ka adlaw sa wala pa mag-deadline ang mga dokumento',
    accountSecurity: 'Seguridad sa Account',
    passkeyAuth: 'Passkey Authentication',
    passkeyDesc: 'Ang imong account gi-secure gamit ang WebAuthn Passkeys. Wala kinahanglana nga password.',
    enabledOnDevice: 'Gi-enable sa kining device',
    emergencyFreeze: 'Emergency Freeze',
    emergencyFreezeDesc: 'Kung mawala o makawat ang imong telepono, pwede nimo dayon i-freeze ang imong Soroban Smart Wallet. Magbabara kini sa tanang paggawas nga transaksyon hangtud ma-verify nimo ang imong pagka-iya sa usa ka DSWD office.',
    freezeWalletNow: 'I-freeze ang Wallet Karon',
    languagePreferences: 'Mga Kagustuhan sa Sinultian',
    languageNote: 'Ang mga pagbabago ipatuman sa tibuok application.',
    freezeConfirmTitle: 'I-freeze ang Wallet?',
    freezeConfirmDesc: 'Kining aksyon mag-invoke sa Soroban Smart Contract function para i-lock ang imong mga pondo. Kinahanglan mong moduaw sa usa ka DSWD office nga adunay valid ID para ma-unlock kini.',
    cancel: 'Kanselahon',
    yesFreezeIt: 'Oo, I-freeze Kini',
    callingContract: 'Gitawag ang Smart Contract...',
    lockingFunds: 'Gi-lock ang imong 4P-Tokens sa Stellar blockchain.',
    walletFrozen: 'Na-freeze ang Wallet!',
    frozenDesc: 'Luwas na ang imong mga pondo. Bisitaha ang pinakaduol nga DSWD LGU office nga adunay valid ID para mahangyo og account recovery.',
    close: 'Sirado',
  },
};

type Translations = typeof translations.english;

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'english',
  setLang: () => {},
  t: translations.english,
});

export function LanguageProvider({ children, wallet }: { children: ReactNode; wallet: string | null }) {
  const [lang, setLangState] = useState<Lang>('english');

  // Load from localStorage first (instant), then sync from DB
  useEffect(() => {
    const saved = localStorage.getItem('4ps_lang') as Lang | null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  useEffect(() => {
    if (!wallet) return;
    fetch(`/api/beneficiary/profile?wallet=${wallet}`)
      .then(r => r.json())
      .then(data => {
        const dbLang = data?.profile?.language as Lang;
        if (dbLang && translations[dbLang]) {
          setLangState(dbLang);
          localStorage.setItem('4ps_lang', dbLang);
        }
      })
      .catch(() => {});
  }, [wallet]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('4ps_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
