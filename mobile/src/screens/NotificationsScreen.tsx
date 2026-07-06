import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { useNotifications, AppNotification } from '../hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';
import { WalletService } from '../services/WalletService';

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export default function NotificationsScreen() {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  
  const [wallet, setWallet] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    WalletService.getPublicKey().then(setWallet);
  }, []);

  const { notifications, markAsRead, unreadCount } = useNotifications(wallet);

  useEffect(() => {
    // When screen mounts, mark as read
    if (unreadCount > 0) {
      markAsRead();
    }
  }, [unreadCount]);

  const getIconForType = (type: string) => {
    if (type.toLowerCase().includes('emergency')) return { name: 'warning', color: '#ef4444', bg: 'bg-red-500/10' };
    if (type.toLowerCase().includes('disbursement')) return { name: 'cash', color: '#10b981', bg: 'bg-emerald-500/10' };
    if (type.toLowerCase().includes('loan')) return { name: 'document-text', color: '#3b82f6', bg: 'bg-blue-500/10' };
    return { name: 'notifications', color: '#8b5cf6', bg: 'bg-purple-500/10' };
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const icon = getIconForType(item.type);
    
    return (
      <View className={`flex-row p-4 border-b ${item.isRead ? (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100') : (isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-blue-50/50 border-blue-100')}`}>
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${icon.bg}`}>
          <Ionicons name={icon.name as any} size={24} color={icon.color} />
        </View>
        <View className="flex-1 justify-center">
          <Text className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</Text>
          <Text className={`text-sm leading-5 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{item.message}</Text>
          <Text className={`text-xs mt-2 font-medium ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
            {formatTimeAgo(item.createdAt)}
          </Text>
        </View>
        {!item.isRead && (
          <View className="w-2 h-2 rounded-full bg-blue-500 self-center ml-2" />
        )}
      </View>
    );
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <View className={`flex-row items-center px-4 pt-14 pb-4 border-b ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
            <Ionicons name="notifications-off-outline" size={40} color={isDark ? '#52525b' : '#9ca3af'} />
          </View>
          <Text className={`text-lg font-bold ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>You're all caught up!</Text>
          <Text className={`text-center mt-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
            No new notifications or alerts from DSWD at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}
