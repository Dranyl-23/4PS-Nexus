import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import DashboardScreen from '../screens/DashboardScreen';
import MerchantMapScreen from '../screens/MerchantMapScreen';
import ScannerScreen from '../screens/ScannerScreen';
import PaymentScreen from '../screens/PaymentScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

import LoansScreen from '../screens/LoansScreen';

import { useSettings } from '../context/SettingsContext';
import SettingsScreen from '../screens/SettingsScreen';
import { useNotifications } from '../hooks/useNotifications';
import { WalletService } from '../services/WalletService';
import ComplianceScreen from '../screens/ComplianceScreen';

const Tab = createBottomTabNavigator();

function NotificationBell() {
  const [wallet, setWallet] = React.useState<string | null>(null);
  const { unreadCount } = useNotifications(wallet);
  const navigation = useNavigation<any>();
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  React.useEffect(() => {
    WalletService.getPublicKey().then(setWallet);
  }, []);

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Notifications')}
      className="mr-4 relative"
    >
      <Ionicons name="notifications-outline" size={26} color={isDark ? '#fff' : '#111827'} />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center border border-white">
          <Text className="text-white text-[9px] font-bold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function MainTabs() {
  const { theme, t } = useSettings();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? '#18181b' : '#f9fafb' }, // zinc-900 or gray-50
        headerTintColor: isDark ? '#fff' : '#111827',
        tabBarStyle: { backgroundColor: isDark ? '#18181b' : '#ffffff', borderTopColor: isDark ? '#27272a' : '#e5e7eb' },
        tabBarActiveTintColor: '#10b981', // emerald-500
        tabBarInactiveTintColor: isDark ? '#a1a1aa' : '#9ca3af', // zinc-400 or gray-400
        headerRight: () => <NotificationBell />
      }}
    >
      <Tab.Screen 
        name={t('dashboard')} 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name={t('history')} 
        component={TransactionHistoryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name={t('loans')} 
        component={LoansScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="trending-up" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name={t('merchants')} 
        component={MerchantMapScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="store" size={size - 4} color={color} />
        }}
      />
      <Tab.Screen 
        name={t('profile')} 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

export type RootStackParamList = {
  Main: undefined;
  Scanner: undefined;
  Payment: { merchantId: string; amount?: string };
  PaymentSuccess: { merchantId: string; amount: string; merchantName?: string };
  Registration: { publicKey: string };
  Settings: undefined;
  Notifications: undefined;
  Compliance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
      />
      <Stack.Screen 
        name="Compliance" 
        component={ComplianceScreen} 
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ presentation: 'formSheet' }}
      />
      <Stack.Screen 
        name="PaymentSuccess" 
        component={PaymentSuccessScreen} 
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  );
}
