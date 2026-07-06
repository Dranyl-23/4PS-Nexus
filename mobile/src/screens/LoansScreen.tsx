import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BeneficiaryService } from '../services/api';
import { WalletService } from '../services/WalletService';
import { useIsFocused } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';

export default function LoansScreen() {
  const isFocused = useIsFocused();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);

  const { theme, t } = useSettings();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function loadData() {
      try {
        const key = await WalletService.getOrGenerateWallet();
        setPublicKey(key);
        
        const data = await BeneficiaryService.getCreditScore(key);
        setScoreData(data);
      } catch (error) {
        console.error('Failed to load credit score:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const handleRequestLoan = async () => {
    if (!publicKey) return;
    
    setIsRequesting(true);
    try {
      const response = await BeneficiaryService.requestLoan(publicKey, '50');
      
      Alert.alert(
        'Loan Approved! 🎉', 
        '50 XLM has been disbursed to your wallet instantly via the Stellar Network.',
        [{ text: 'OK' }]
      );
      
      const data = await BeneficiaryService.getCreditScore(publicKey);
      setScoreData(data);
    } catch (error: any) {
      Alert.alert('Loan Request Failed', error.message || 'Unable to process loan at this time.');
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Evaluating Trust Score...</Text>
      </View>
    );
  }

  const score = scoreData?.score || 500;
  const isEligible = scoreData?.isEligible || false;
  
  // Design configuration based on score
  let scoreTheme = {
    gradient: ['#f43f5e', '#e11d48'], // rose-500 to rose-600
    text: 'text-rose-500',
    bgLight: 'bg-rose-500/10',
    bgDark: 'bg-rose-500/20',
    border: 'border-rose-500',
    label: 'Needs Improvement',
    icon: 'warning'
  };
  
  if (score >= 700) {
    scoreTheme = {
      gradient: ['#10b981', '#059669'], // emerald-500 to emerald-600
      text: 'text-emerald-500',
      bgLight: 'bg-emerald-500/10',
      bgDark: 'bg-emerald-500/20',
      border: 'border-emerald-500',
      label: 'Excellent',
      icon: 'star'
    };
  } else if (score >= 600) {
    scoreTheme = {
      gradient: ['#f59e0b', '#d97706'], // amber-500 to amber-600
      text: 'text-amber-500',
      bgLight: 'bg-amber-500/10',
      bgDark: 'bg-amber-500/20',
      border: 'border-amber-500',
      label: 'Good',
      icon: 'checkmark-circle'
    };
  }

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header Area */}
      <View className={`pt-16 pb-6 px-6 rounded-b-[40px] ${isDark ? 'bg-zinc-800 border-b border-zinc-700' : 'bg-white shadow-sm border-b border-zinc-100'}`}>
        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 bg-blue-500/10 rounded-full items-center justify-center mr-4 border border-blue-500/20">
            <Ionicons name="shield-checkmark" size={24} color="#3b82f6" />
          </View>
          <View>
            <Text className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{t('trust_score')}</Text>
            <Text className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t('powered_by_defi')}</Text>
          </View>
        </View>

        {/* Dynamic Score Dial */}
        <View className="items-center mt-4">
          <View className={`w-64 h-64 rounded-full items-center justify-center border-2 ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'} shadow-lg relative`}>
            {/* Outer Glowing Ring */}
            <View className={`absolute w-full h-full rounded-full border-4 ${scoreTheme.border} opacity-20`} style={{ transform: [{ scale: 1.05 }] }} />
            <View className={`absolute w-full h-full rounded-full border-2 ${scoreTheme.border} opacity-40`} style={{ transform: [{ scale: 1.02 }] }} />
            
            {/* Inner fill depending on theme */}
            <View className={`w-56 h-56 rounded-full items-center justify-center ${isDark ? scoreTheme.bgDark : scoreTheme.bgLight}`}>
              <Ionicons name={scoreTheme.icon as any} size={28} color={scoreTheme.gradient[0]} style={{ marginBottom: 4 }} />
              <Text className={`text-7xl font-black ${scoreTheme.text} tracking-tighter leading-none`}>{score}</Text>
              <Text className={`text-xs font-bold ${scoreTheme.text} mt-2 uppercase tracking-widest text-center px-4 leading-tight`}>{scoreTheme.label}</Text>
            </View>
          </View>
        </View>

        {/* Glassmorphism Eligibility Banner */}
        <View className={`mt-8 p-4 rounded-2xl flex-row items-center border ${isEligible ? (isDark ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-rose-500/20 border-rose-500/40' : 'bg-rose-50 border-rose-200')}`}>
          <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isEligible ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`}>
            <Ionicons name={isEligible ? 'lock-open' : 'lock-closed'} size={20} color={isEligible ? '#10b981' : '#f43f5e'} />
          </View>
          <View className="flex-1">
            <Text className={`font-bold text-sm ${isEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isEligible ? 'Emergency Loan Unlocked' : 'Emergency Loan Locked'}
            </Text>
            <Text className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {isEligible ? 'You are eligible to borrow up to ₱5,000.' : 'Increase your score to 600+ to unlock.'}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6 mt-8">
        <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-800'}`}>Score Factors</Text>
        
        <View className="flex-row gap-4 mb-8">
          {/* Good Actions Card */}
          <View className={`flex-1 rounded-3xl p-5 border shadow-sm ${isDark ? 'bg-zinc-800 border-emerald-500/20' : 'bg-white border-zinc-100'}`}>
            <View className="w-10 h-10 rounded-full bg-emerald-500/10 items-center justify-center mb-3">
              <Ionicons name="arrow-up" size={20} color="#10b981" />
            </View>
            <Text className={`text-3xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>{scoreData?.factors?.goodTransactions || 0}</Text>
            <Text className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Good Actions</Text>
            <Text className="text-[10px] mt-2 text-emerald-500 font-bold bg-emerald-500/10 self-start px-2 py-1 rounded-lg">+15 pts each</Text>
          </View>

          {/* Violations Card */}
          <View className={`flex-1 rounded-3xl p-5 border shadow-sm ${isDark ? 'bg-zinc-800 border-rose-500/20' : 'bg-white border-zinc-100'}`}>
            <View className="w-10 h-10 rounded-full bg-rose-500/10 items-center justify-center mb-3">
              <Ionicons name="warning" size={20} color="#f43f5e" />
            </View>
            <Text className={`text-3xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>{scoreData?.factors?.badTransactions || 0}</Text>
            <Text className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Violations</Text>
            <Text className="text-[10px] mt-2 text-rose-500 font-bold bg-rose-500/10 self-start px-2 py-1 rounded-lg">-50 pts each</Text>
          </View>
        </View>

        {/* Big Apply Button */}
        <TouchableOpacity 
          className="mt-2 overflow-hidden rounded-2xl"
          onPress={handleRequestLoan}
          disabled={!isEligible || isRequesting}
          activeOpacity={0.8}
        >
          {isEligible && !isRequesting ? (
            <View className={`py-5 px-6 items-center flex-row justify-center bg-blue-600`}>
              <Ionicons name="flash" size={24} color="#fff" className="mr-2" />
              <View>
                <Text className="text-white font-black text-lg text-center uppercase tracking-wider">
                  Apply for Loan
                </Text>
              </View>
            </View>
          ) : (
            <View className={`py-5 px-6 items-center flex-row justify-center ${isDark ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-200 border border-zinc-300'}`}>
              {isRequesting ? (
                <ActivityIndicator color={isDark ? '#fff' : '#000'} />
              ) : (
                <>
                  <Ionicons name="lock-closed" size={20} color={isDark ? '#52525b' : '#9ca3af'} className="mr-2" />
                  <Text className={`font-bold text-lg uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Locked
                  </Text>
                </>
              )}
            </View>
          )}
        </TouchableOpacity>
        
        {!isEligible && (
          <Text className={`text-center mt-3 text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
            Keep spending strictly on approved categories to unlock.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
