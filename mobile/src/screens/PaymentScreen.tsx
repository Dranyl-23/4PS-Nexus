import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Switch, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WalletService } from '../services/WalletService';
import { BeneficiaryService } from '../services/api';
import QRCode from 'react-native-qrcode-svg';

export default function PaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { merchantId, amount: scannedAmount } = route.params as { merchantId: string, amount?: string };
  
  const [amount, setAmount] = useState(scannedAmount || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [merchantProfile, setMerchantProfile] = useState<any>(null);
  const [isLoadingMerchant, setIsLoadingMerchant] = useState(true);
  
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlinePayload, setOfflinePayload] = useState<string | null>(null);

  useEffect(() => {
    async function loadMerchant() {
      try {
        const profile = await BeneficiaryService.getMerchantProfile(merchantId);
        setMerchantProfile(profile);
      } catch (error) {
        console.error('Failed to load merchant:', error);
      } finally {
        setIsLoadingMerchant(false);
      }
    }
    loadMerchant();
  }, [merchantId]);

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setIsProcessing(true);
    try {
      let assetCode = 'native';
      if (merchantProfile?.category) {
        const cat = merchantProfile.category.toLowerCase();
        if (cat.includes('food') || cat.includes('grocery')) assetCode = 'FOOD';
        else if (cat.includes('education') || cat.includes('school') || cat.includes('book')) assetCode = 'EDUC';
      }
      
      if (isOfflineMode) {
        // Generate Dynamic QR Payload
        const payload = await WalletService.generateOfflineTransaction(merchantId, amount, assetCode);
        setOfflinePayload(payload);
      } else {
        // Normal Online Payment
        await WalletService.sendPayment(merchantId, amount, assetCode);
        navigation.navigate('PaymentSuccess', { 
          merchantId, 
          amount, 
          merchantName: merchantProfile?.businessName 
        });
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      Alert.alert('Payment Failed', error.message || 'Something went wrong while sending payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (offlinePayload) {
    return (
      <View className="flex-1 bg-zinc-900 justify-center items-center p-8">
        <Text className="text-white text-2xl font-black text-center mb-2 tracking-tight">Offline Payment Ready</Text>
        <Text className="text-zinc-400 text-center mb-8">
          Ipakita kining QR Code ngadto sa tindahan aron i-scan nila ug ma-proseso ang imong bayad.
        </Text>
        
        <View className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 mb-8 items-center justify-center">
          <QRCode
            value={offlinePayload}
            size={240}
            color="#18181b"
            backgroundColor="white"
          />
        </View>

        <Text className="text-emerald-400 font-bold text-2xl mb-2">₱{amount}</Text>
        <Text className="text-zinc-500 font-medium mb-12">to {merchantProfile?.businessName}</Text>

        <TouchableOpacity 
          className="bg-zinc-800 border border-zinc-700 py-4 px-8 rounded-xl w-full items-center"
          onPress={() => navigation.navigate('Dashboard' as never)}
        >
          <Text className="text-white font-bold">Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-900">
      {/* Header */}
      <View className="pt-16 pb-4 px-6 flex-row items-center justify-between bg-zinc-800 border-b border-zinc-700/50">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Send Payment</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-zinc-400 text-xs font-bold mr-2 uppercase tracking-wider">Offline Mode</Text>
          <Switch 
            value={isOfflineMode} 
            onValueChange={setIsOfflineMode}
            trackColor={{ false: '#3f3f46', true: '#10b981' }}
            thumbColor={isOfflineMode ? '#fff' : '#a1a1aa'}
          />
        </View>
      </View>

      <View className="p-6 flex-1">
        {/* Merchant Info */}
        <View className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700/50 mb-8 items-center relative">
          {isOfflineMode && (
            <View className="absolute top-4 right-4 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 flex-row items-center">
              <Ionicons name="wifi-outline" size={12} color="#f59e0b" style={{ marginRight: 4 }} />
              <Text className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Offline</Text>
            </View>
          )}
          <View className="w-16 h-16 bg-emerald-500/20 rounded-full items-center justify-center mb-4">
            <Ionicons name="storefront" size={32} color="#34d399" />
          </View>
          <Text className="text-zinc-400 text-sm mb-1">Paying to Merchant</Text>
          
          {isLoadingMerchant ? (
            <ActivityIndicator color="#10b981" size="small" />
          ) : merchantProfile ? (
            <>
              <Text className="text-white font-bold text-xl text-center mb-1">
                {merchantProfile.businessName}
              </Text>
              <Text className="text-zinc-500 text-xs text-center uppercase tracking-widest mb-3">
                {merchantProfile.category}
              </Text>
              <Text className="text-zinc-600 font-mono text-center text-[10px] px-4" numberOfLines={1}>
                {merchantId}
              </Text>
            </>
          ) : (
            <Text className="text-white font-mono text-center text-xs px-4" numberOfLines={2}>
              {merchantId}
            </Text>
          )}
        </View>

        {/* Amount Input */}
        <Text className="text-zinc-400 text-sm font-medium mb-2">Amount to Pay (PHP)</Text>
        <View className="bg-zinc-800 rounded-2xl flex-row items-center px-4 border border-zinc-700/50 focus:border-emerald-500 mb-8">
          <Text className="text-emerald-400 text-2xl font-bold mr-2">₱</Text>
          <TextInput
            className="flex-1 text-white text-4xl font-bold py-4"
            placeholder="0.00"
            placeholderTextColor="#52525b"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        <View className="flex-1" />

        {/* Anti-Bisyo Lock / Action Button */}
        {merchantProfile && ['liquor', 'gambling', 'tobacco', 'entertainment'].some(cat => merchantProfile.category.toLowerCase().includes(cat)) ? (
          <View className="bg-red-500/20 p-4 rounded-xl border border-red-500/50 mb-4 items-center">
            <Ionicons name="warning-outline" size={32} color="#ef4444" style={{ marginBottom: 8 }} />
            <Text className="text-red-400 font-bold text-center text-lg mb-1">RESTRICTED</Text>
            <Text className="text-red-300/80 text-center text-sm px-2">
              Ang 4Ps Subsidy dili pwedeng gamiton sa niining tindahan (Liquor / Gambling / Tobacco).
            </Text>
          </View>
        ) : (
          <TouchableOpacity 
            className={`py-4 rounded-xl items-center flex-row justify-center ${
              isProcessing || !amount ? 'bg-emerald-500/50' : 'bg-emerald-500'
            }`}
            onPress={handlePayment}
            disabled={isProcessing || !amount}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator color="#18181b" className="mr-2" />
                <Text className="text-zinc-900 font-bold text-lg">Verifying Passkey...</Text>
              </>
            ) : (
              <>
                <Ionicons name="finger-print" size={20} color="#18181b" style={{ marginRight: 8 }} />
                <Text className="text-zinc-900 font-bold text-lg">
                  {isOfflineMode ? 'Generate Offline QR' : 'Sign & Send Payment'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Full-Screen Loading Overlay */}
      <Modal visible={isProcessing} transparent={true} animationType="fade">
        <View className="flex-1 bg-zinc-900/90 justify-center items-center">
          <View className="bg-zinc-800 p-8 rounded-3xl items-center border border-zinc-700/50 shadow-2xl">
            <ActivityIndicator size="large" color="#10b981" style={{ transform: [{ scale: 1.5 }] }} />
            <Text className="text-white font-bold text-xl mt-6">Processing Payment</Text>
            <Text className="text-zinc-400 text-sm mt-2 text-center">
              Please wait while we secure your{'\n'}transaction on the blockchain...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
