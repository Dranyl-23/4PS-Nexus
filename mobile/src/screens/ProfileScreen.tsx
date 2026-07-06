import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WalletService } from '../services/WalletService';
import { BeneficiaryService } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { theme, t } = useSettings();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function loadProfile() {
      try {
        const key = await WalletService.getPublicKey();
        if (key) {
          setPublicKey(key);
          const data = await BeneficiaryService.getProfile(key);
          setProfileData(data?.profile);
        }
      } catch (error) {
        console.error('Failed to load profile for ProfileScreen:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleCopy = () => {
    Alert.alert('Copied!', 'Your full Account ID has been copied to clipboard.');
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App & Clear Wallet',
      'Are you sure you want to delete your device wallet? This is for testing purposes. You will be redirected to the Registration screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              await WalletService.clearWallet();
              // Reset navigation stack to trigger a fresh check
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' as never }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to clear wallet.');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`} contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      {/* Header */}
      <View className="items-center mt-8 mb-8">
        <View className="w-24 h-24 bg-emerald-500/20 rounded-full items-center justify-center border-2 border-emerald-500/50 mb-4">
          <Ionicons name="person" size={48} color="#34d399" />
        </View>
        <Text className={`text-2xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {profileData?.fullName || 'Beneficiary'}
        </Text>
        <View className="flex-row items-center mt-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <MaterialIcons name="verified-user" size={14} color="#10b981" />
          <Text className="text-emerald-500 font-bold text-xs ml-1 uppercase tracking-wider">KYC Verified</Text>
        </View>
      </View>

      {/* Info Cards */}
      <View className={`rounded-2xl p-5 border mb-6 ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}>
        <Text className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{t('registered_address')}</Text>
        <Text className={`text-base mb-6 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
          {profileData?.address || 'No address registered.'}
        </Text>

        <Text className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{t('program_category')}</Text>
        <Text className={`text-base mb-6 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
          4Ps Education & Health Subsidy
        </Text>

        <Text className={`text-xs font-bold mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{t('stellar_account')}</Text>
        <TouchableOpacity 
          onPress={handleCopy}
          className={`p-4 rounded-xl flex-row items-center justify-between border ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
        >
          <Text className="text-emerald-500 font-mono text-xs w-[85%] leading-5">
            {publicKey || 'Loading...'}
          </Text>
          <Ionicons name="copy-outline" size={20} color={isDark ? '#71717a' : '#9ca3af'} />
        </TouchableOpacity>
      </View>

      {/* App Settings */}
      <View className="mt-2">
        <Text className={`text-xs font-bold uppercase tracking-widest mb-4 ml-2 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>Application</Text>
        <TouchableOpacity 
          className={`p-4 rounded-2xl flex-row items-center justify-between border ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <View className="flex-row items-center">
            <Ionicons name="settings-outline" size={24} color={isDark ? '#fff' : '#111827'} className="mr-3" />
            <Text className={`font-bold ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('settings')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#71717a' : '#9ca3af'} />
        </TouchableOpacity>
      </View>

      {/* Developer Actions */}
      <View className="mt-8">
        <Text className={`text-xs font-bold uppercase tracking-widest mb-4 ml-2 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>{t('developer_testing')}</Text>
        <TouchableOpacity 
          className="bg-rose-500/10 p-4 rounded-2xl flex-row items-center justify-between border border-rose-500/20"
          onPress={handleResetApp}
        >
          <View className="flex-row items-center">
            <Ionicons name="trash-outline" size={24} color="#f43f5e" className="mr-3" />
            <Text className="text-rose-500 font-bold ml-2">{t('reset_app')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#f43f5e" />
        </TouchableOpacity>
      </View>

      <Text className={`text-center mt-12 text-xs font-bold tracking-widest uppercase ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
        Powered by Stellar Network
      </Text>
    </ScrollView>
  );
}
