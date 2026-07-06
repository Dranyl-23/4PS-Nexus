import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function PaymentSuccessScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { amount, merchantId, merchantName } = route.params as { amount: string; merchantId: string; merchantName?: string };

  const handleBackToDashboard = () => {
    // Reset the navigation stack back to Main to prevent going "back" to Success
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' as never }],
    });
  };

  return (
    <View className="flex-1 bg-zinc-900 justify-center items-center p-6">
      <ConfettiCannon 
        count={200} 
        origin={{ x: -10, y: 0 }} 
        autoStart={true} 
        fadeOut={true} 
        explosionSpeed={350} 
        fallSpeed={3000} 
      />

      <View className="items-center mb-12">
        <View className="w-24 h-24 bg-emerald-500/20 rounded-full items-center justify-center border-4 border-emerald-500 mb-6 shadow-xl shadow-emerald-500/30">
          <Ionicons name="checkmark-sharp" size={64} color="#10b981" />
        </View>

        <Text className="text-white text-3xl font-black mb-2 tracking-tight">Payment Successful!</Text>
        <Text className="text-zinc-400 text-base text-center mb-8">
          You have successfully sent funds.
        </Text>

        <View className="bg-zinc-800 border border-zinc-700/50 rounded-2xl w-full p-6 shadow-lg mb-8 items-center">
          <Text className="text-zinc-500 text-xs font-bold tracking-widest mb-2">AMOUNT SENT</Text>
          <Text className="text-emerald-400 text-5xl font-black mb-6">₱{amount}</Text>

          <View className="w-full h-[1px] bg-zinc-700/50 mb-6" />

          <Text className="text-zinc-500 text-xs font-bold tracking-widest mb-2">PAID TO MERCHANT</Text>
          {merchantName ? (
            <Text className="text-white font-bold text-center text-lg mb-1" numberOfLines={1}>
              {merchantName}
            </Text>
          ) : null}
          <Text className={`text-zinc-400 font-mono text-center ${merchantName ? 'text-[10px]' : 'text-sm'}`} numberOfLines={2}>
            {merchantId}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        className="bg-emerald-500 w-full py-4 rounded-xl flex-row justify-center items-center absolute bottom-10"
        onPress={handleBackToDashboard}
      >
        <Text className="text-zinc-900 font-bold text-lg">Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
