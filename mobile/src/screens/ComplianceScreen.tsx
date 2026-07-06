import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { BeneficiaryService } from '../services/api';
import { WalletService } from '../services/WalletService';
import { useNavigation } from '@react-navigation/native';

export default function ComplianceScreen() {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const wallet = await WalletService.getPublicKey();
        if (wallet) {
          const compliance = await BeneficiaryService.getComplianceStatus(wallet);
          setData(compliance);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const renderChecklistItem = (title: string, desc: string, isCompliant: boolean, iconName: string) => {
    return (
      <View className={`flex-row items-center p-4 mb-4 rounded-2xl border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'} shadow-sm`}>
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isCompliant ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
          <Ionicons name={iconName as any} size={24} color={isCompliant ? '#10b981' : '#f59e0b'} />
        </View>
        <View className="flex-1">
          <Text className={`font-bold text-lg ${isDark ? 'text-white' : 'text-zinc-900'}`}>{title}</Text>
          <Text className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{desc}</Text>
        </View>
        <View>
          <Ionicons name={isCompliant ? 'checkmark-circle' : 'time'} size={28} color={isCompliant ? '#10b981' : '#f59e0b'} />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Fetching DSWD Records...</Text>
      </View>
    );
  }

  const fds = data?.fdsAttended || false;
  const health = data?.healthCheck || false;
  const school = data?.schoolAttended || false;
  const overallCompliant = data?.isCompliant || false;
  const month = data?.month || 'Current Month';

  let completedCount = 0;
  if (fds) completedCount++;
  if (health) completedCount++;
  if (school) completedCount++;

  const progressPercent = (completedCount / 3) * 100;

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View className={`pt-14 pb-8 px-6 rounded-b-[40px] ${isDark ? 'bg-zinc-800 border-b border-zinc-700' : 'bg-white shadow-sm border-b border-zinc-100'}`}>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 w-10 h-10 rounded-full items-center justify-center bg-zinc-100 dark:bg-zinc-700">
            <Ionicons name="arrow-back" size={20} color={isDark ? '#fff' : '#111827'} />
          </TouchableOpacity>
          <Text className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Compliance Tracker</Text>
        </View>
        
        <View className="items-center mt-2 mb-2">
          <Text className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{month}</Text>
          <Text className={`text-6xl font-black mt-2 tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>{completedCount} <Text className="text-3xl text-zinc-400">/ 3</Text></Text>
          <Text className={`text-sm font-bold mt-2 uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Requirements Met</Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="px-6 mt-6">
        
        {/* Status Banner */}
        <View className={`p-4 rounded-2xl flex-row items-center mb-6 border ${overallCompliant ? (isDark ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-amber-500/20 border-amber-500/40' : 'bg-amber-50 border-amber-200')}`}>
          <Ionicons name={overallCompliant ? 'cash' : 'warning'} size={24} color={overallCompliant ? '#10b981' : '#f59e0b'} className="mr-3" />
          <View className="flex-1 ml-2">
            <Text className={`font-bold ${overallCompliant ? 'text-emerald-600' : 'text-amber-600'}`}>
              {overallCompliant ? 'Cash Grant Triggered' : 'Cash Grant Pending'}
            </Text>
            <Text className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {overallCompliant 
                ? 'All conditions met. Smart contract will automatically disburse your monthly allowance.' 
                : 'Complete all requirements below to unlock your monthly cash grant.'}
            </Text>
          </View>
        </View>

        <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-800'}`}>Checklist</Text>

        {renderChecklistItem('Family Development Session', 'Attended the monthly FDS meeting.', fds, 'people')}
        {renderChecklistItem('Health & Nutrition', 'Monthly checkup for pregnant women & children 0-5 y/o.', health, 'medical')}
        {renderChecklistItem('Education', '85% monthly school attendance for children.', school, 'school')}

      </View>
    </ScrollView>
  );
}
