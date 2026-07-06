import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AnimatedSwitch = ({ value, onValueChange }: { value: boolean, onValueChange: (val: boolean) => void }) => {
  const translateX = useRef(new Animated.Value(value ? 26 : 2)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 26 : 2,
      useNativeDriver: true,
      bounciness: 10,
      speed: 12,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      className={`w-14 h-8 rounded-full justify-center ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
    >
      <Animated.View
        className="w-7 h-7 rounded-full bg-white shadow-sm items-center justify-center absolute"
        style={{ transform: [{ translateX }] }}
      >
        <Ionicons name={value ? "moon" : "sunny"} size={14} color={value ? "#3b82f6" : "#f59e0b"} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, language, setTheme, setLanguage, t } = useSettings();

  const isDark = theme === 'dark';

  const handleThemeChange = (val: boolean) => {
    // Smooth transition animation for the rest of the screen
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setTheme(val ? 'dark' : 'light');
  };

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`pt-16 pb-4 px-6 flex-row items-center border-b ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'}`}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#111827'} />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('settings')}
        </Text>
      </View>

      <View className="p-6">
        {/* Appearance */}
        <Text className={`text-sm font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Appearance
        </Text>
        <View className={`rounded-2xl mb-8 border ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'} overflow-hidden`}>
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => handleThemeChange(!isDark)}
            className={`p-4 flex-row justify-between items-center border-b ${isDark ? 'border-zinc-700/50' : 'border-gray-100'}`}
          >
            <View className="flex-row items-center">
              <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={isDark ? '#3b82f6' : '#f59e0b'} className="mr-3" />
              <Text className={`text-base font-medium ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
            </View>
            <AnimatedSwitch value={isDark} onValueChange={handleThemeChange} />
          </TouchableOpacity>
        </View>

        {/* Language */}
        <Text className={`text-sm font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          Language
        </Text>
        <View className={`rounded-2xl border ${isDark ? 'bg-zinc-800 border-zinc-700/50' : 'bg-white border-gray-200'} overflow-hidden`}>
          <TouchableOpacity 
            className={`p-4 flex-row justify-between items-center border-b ${isDark ? 'border-zinc-700/50' : 'border-gray-100'}`}
            onPress={() => setLanguage('en')}
          >
            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>English</Text>
            {language === 'en' && <Ionicons name="checkmark" size={20} color="#10b981" />}
          </TouchableOpacity>

          <TouchableOpacity 
            className={`p-4 flex-row justify-between items-center border-b ${isDark ? 'border-zinc-700/50' : 'border-gray-100'}`}
            onPress={() => setLanguage('ceb')}
          >
            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Cebuano (Bisaya)</Text>
            {language === 'ceb' && <Ionicons name="checkmark" size={20} color="#10b981" />}
          </TouchableOpacity>

          <TouchableOpacity 
            className="p-4 flex-row justify-between items-center"
            onPress={() => setLanguage('tl')}
          >
            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Tagalog</Text>
            {language === 'tl' && <Ionicons name="checkmark" size={20} color="#10b981" />}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
