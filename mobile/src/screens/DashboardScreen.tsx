import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { WalletService } from '../services/WalletService';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BeneficiaryService } from '../services/api';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Refresh when tab is focused
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { theme, t } = useSettings();
  const isDark = theme === 'dark';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    async function setupWalletAndFetch() {
      try {
        const key = await WalletService.getOrGenerateWallet();
        setPublicKey(key);

        const data = await BeneficiaryService.getProfile(key);
        if (data) {
            setProfileData(data);
        }

        const txData = await BeneficiaryService.getTransactions(key);
        setRecentTransactions(txData.slice(0, 3));
      } catch (error) {
        console.error('Failed to refresh dashboard:', error);
      } finally {
        setRefreshing(false);
      }
    }
    setupWalletAndFetch();
  }, []);

  useEffect(() => {
    async function setupWalletAndFetch() {
      try {
        const key = await WalletService.getOrGenerateWallet();
        setPublicKey(key);

        // Fetch from API
        const data = await BeneficiaryService.getProfile(key);
        if (!data) {
          // Not registered, navigate to Registration
          navigation.reset({
            index: 0,
            routes: [{ name: 'Registration', params: { publicKey: key } } as never],
          });
          return;
        }
        setProfileData(data);

        // Fetch recent transactions
        const txData = await BeneficiaryService.getTransactions(key);
        setRecentTransactions(txData.slice(0, 3)); // Get top 3
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isFocused) {
      setupWalletAndFetch();
    }
  }, [isFocused]);

  const formatKey = (key: string) => {
    return `${key.slice(0, 6)}...${key.slice(-6)}`;
  };

  const handleCopy = () => {
    Alert.alert('Copied!', 'Your Account ID has been copied to clipboard.');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (isLoading && !profileData) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text className={`mt-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Syncing with DSWD Server...</Text>
      </View>
    );
  }

  const getGreetingKey = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'good_morning';
    if (hour < 18) return 'good_afternoon';
    return 'good_evening';
  };

  return (
    <ScrollView 
      className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`} 
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
      }
    >
      {/* Greeting */}
      <View className="mb-6 mt-8">
        <Text className={`text-lg ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>{t(getGreetingKey())},</Text>
        <Text className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {profileData?.profile?.fullName || 'Beneficiary'}
        </Text>
      </View>

      {/* Wallet Card */}
      <View className={`rounded-2xl p-6 shadow-lg border mb-6 relative overflow-hidden ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}>
        {/* Subtle background element */}
        <View className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></View>
        
        <View className="mb-4 relative z-10">
          <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Stellar Native (XLM)</Text>
          <Text className="text-emerald-500 text-3xl font-black tracking-tighter">
            {profileData ? `${profileData.balance.toFixed(2)} XLM` : '0.00 XLM'}
          </Text>
        </View>

        <View className="flex-row gap-4 mb-8 relative z-10">
          <View className={`flex-1 p-4 rounded-xl border border-emerald-500/20 ${isDark ? 'bg-zinc-900/50' : 'bg-emerald-50'}`}>
            <Text className={`text-xs font-bold tracking-wider mb-1 ${isDark ? 'text-zinc-400' : 'text-emerald-700'}`}>FOOD TOKEN</Text>
            <Text className={`text-xl font-black ${isDark ? 'text-white' : 'text-emerald-900'}`}>
              {profileData?.balances?.Food ? profileData.balances.Food.toFixed(2) : '0.00'}
            </Text>
          </View>
          <View className={`flex-1 p-4 rounded-xl border border-blue-500/20 ${isDark ? 'bg-zinc-900/50' : 'bg-blue-50'}`}>
            <Text className={`text-xs font-bold tracking-wider mb-1 ${isDark ? 'text-zinc-400' : 'text-blue-700'}`}>EDUC TOKEN</Text>
            <Text className={`text-xl font-black ${isDark ? 'text-white' : 'text-blue-900'}`}>
              {profileData?.balances?.Education ? profileData.balances.Education.toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>
        
        <Text className={`text-xs font-bold mb-2 tracking-widest relative z-10 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>STELLAR ACCOUNT ID</Text>
        <TouchableOpacity 
          onPress={handleCopy}
          className={`p-4 rounded-xl flex-row justify-between items-center border relative z-10 ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
        >
          <Text className="text-emerald-500 font-mono text-sm tracking-wider">
            {publicKey ? formatKey(publicKey) : 'Generating...'}
          </Text>
          <Ionicons name="copy-outline" size={18} color={isDark ? '#71717a' : '#9ca3af'} />
        </TouchableOpacity>
      </View>

      {/* Big Scanner Button */}
      <TouchableOpacity 
        className="bg-emerald-500 py-5 rounded-2xl flex-row items-center justify-center shadow-lg shadow-emerald-500/20 mb-4"
        onPress={() => navigation.navigate('Scanner' as never)}
      >
        <MaterialIcons name="qr-code-scanner" size={24} color={isDark ? '#18181b' : '#ffffff'} className="mr-3" />
        <Text className={`font-black text-lg ${isDark ? 'text-zinc-900' : 'text-white'}`}>{t('scan_to_pay')}</Text>
      </TouchableOpacity>

      {/* Compliance Tracker Widget */}
      <TouchableOpacity 
        className={`py-4 px-5 rounded-2xl flex-row items-center justify-between border shadow-sm mb-8 ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}
        onPress={() => navigation.navigate('Compliance' as never)}
      >
        <View className="flex-row items-center">
          <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
            <Ionicons name="clipboard" size={20} color="#3b82f6" />
          </View>
          <View>
            <Text className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Compliance</Text>
            <Text className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Track your 4Ps requirements</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#52525b' : '#9ca3af'} />
      </TouchableOpacity>

      {/* Recent Transactions */}
      <View>
        <View className="flex-row justify-between items-end mb-4">
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History' as never)}>
            <Text className="text-emerald-500 font-bold text-sm">See All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <View className={`p-8 rounded-2xl border items-center justify-center ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}>
            <MaterialIcons name="receipt-long" size={32} color={isDark ? '#52525b' : '#9ca3af'} className="mb-2" />
            <Text className={isDark ? 'text-zinc-500' : 'text-gray-400'}>No transactions yet.</Text>
          </View>
        ) : (
          <View className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}>
            {recentTransactions.map((tx, index) => (
              <View 
                key={tx.id || index} 
                className={`flex-row justify-between items-center p-4 ${index !== recentTransactions.length - 1 ? (isDark ? 'border-b border-zinc-700/50' : 'border-b border-gray-100') : ''}`}
              >
                <View className="flex-row items-center flex-1 pr-4">
                  <View className="w-12 h-12 bg-rose-500/10 rounded-full items-center justify-center mr-4 border border-rose-500/20">
                    <Ionicons name="arrow-up" size={20} color="#f43f5e" />
                  </View>
                  <View className="flex-1">
                    <Text className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
                      {tx.merchantName}
                    </Text>
                    <Text className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                      {formatDate(tx.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text className="text-rose-500 font-bold text-base">
                  -{parseFloat(tx.amount).toFixed(2)} XLM
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
