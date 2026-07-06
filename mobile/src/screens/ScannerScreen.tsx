import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Automatically request permission if not determined
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View className="flex-1 bg-zinc-900" />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center p-6">
        <Ionicons name="camera-outline" size={64} color="#71717a" className="mb-4" />
        <Text className="text-white text-center text-lg mb-6">
          We need your permission to show the camera for QR scanning.
        </Text>
        <TouchableOpacity 
          className="bg-emerald-500 py-3 px-8 rounded-xl"
          onPress={requestPermission}
        >
          <Text className="text-zinc-900 font-bold text-lg">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Try to parse as Dynamic QR (JSON payload from Merchant POS)
      const payload = JSON.parse(data);
      if (payload.merchantId) {
        navigation.navigate('Payment', { merchantId: payload.merchantId, amount: payload.amount });
        return;
      }
    } catch (e) {
      // Not a JSON payload, fallback to treating the raw data as the merchantId (Static QR)
    }

    // Navigate to PaymentScreen with just the merchant wallet data
    navigation.navigate('Payment', { merchantId: data });
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      
      {/* Overlay UI */}
      <View className="flex-1 justify-between bg-black/60">
        
        {/* Header */}
        <View className="pt-16 pb-6 px-6 flex-row items-center justify-between bg-zinc-900/80">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Scan Merchant QR</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Scan Area Frame */}
        <View className="flex-1 items-center justify-center">
          <View className="w-64 h-64 border-2 border-emerald-400 rounded-3xl bg-transparent">
            {/* Corners overlay effect could go here */}
          </View>
          <Text className="text-zinc-300 mt-6 text-center px-8 text-base">
            Align the merchant's QR code within the frame to pay.
          </Text>
        </View>

        {/* Footer Area */}
        <View className="pb-12 pt-6 items-center bg-zinc-900/80">
          {scanned && (
            <TouchableOpacity 
              className="bg-emerald-500 py-3 px-8 rounded-xl flex-row items-center"
              onPress={() => setScanned(false)}
            >
              <Ionicons name="scan-outline" size={20} color="#18181b" className="mr-2" />
              <Text className="text-zinc-900 font-bold text-lg">Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
