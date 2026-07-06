import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BeneficiaryService } from '../services/api';
import { WalletService } from '../services/WalletService';
import { useSettings } from '../context/SettingsContext';

export default function TransactionHistoryScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { theme, t } = useSettings();
  const isDark = theme === 'dark';

  const fetchTransactions = async () => {
    try {
      const publicKey = await WalletService.getPublicKey();
      if (publicKey) {
        const data = await BeneficiaryService.getTransactions(publicKey);
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchTransactions();
  };

  const renderTransaction = ({ item }: { item: any }) => {
    const isReceive = item.type === 'receive' || item.type === 'disbursement';
    
    return (
      <View className={`p-4 rounded-2xl mb-3 border flex-row items-center ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}>
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isReceive ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          <Ionicons 
            name={isReceive ? "arrow-down" : "arrow-up"} 
            size={24} 
            color={isReceive ? "#34d399" : "#f87171"} 
          />
        </View>
        <View className="flex-1">
          <Text className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
            {isReceive ? 'DSWD Subsidy' : item.merchant}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
            {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
        <View className="items-end">
          <Text className={`font-black text-lg ${isReceive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isReceive ? '+' : '-'}₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md mt-1 border border-emerald-500/20">
            {item.status || 'Completed'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <View className={`pt-16 pb-4 px-6 border-b flex-row items-center ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}>
        <Ionicons name="time" size={24} color="#34d399" className="mr-3" />
        <Text className={`text-xl font-bold ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('history')}</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className={`mt-4 font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Loading ledger...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderTransaction}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#10b981" />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons name="receipt-outline" size={48} color={isDark ? '#52525b' : '#9ca3af'} />
              <Text className={`mt-4 text-center ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                {t('no_transactions')}{'\n'}Your spending will appear here.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
