import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../context/AuthContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      
      // Auto trigger on load if supported
      if (compatible) {
        handleBiometricAuth();
      }
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      // We directly call authenticateAsync. 
      // If biometrics aren't enrolled, it will fallback to the device's PIN/Password/Pattern.
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock 4PS-Nexus',
        fallbackLabel: 'Use PIN/Password',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      if (biometricAuth.success) {
        login();
      } else {
        // Only show error if they didn't just cancel
        if (biometricAuth.error !== 'user_cancel') {
           Alert.alert('Authentication Failed', 'Please try again.');
        }
      }
    } catch (error) {
      console.log('Biometric auth error', error);
      Alert.alert('Error', 'An error occurred during authentication.');
    }
  };

  return (
    <View className="flex-1 bg-zinc-900 justify-center items-center p-6">
      <View className="mb-10 items-center">
        <View className="w-24 h-24 bg-emerald-500/20 rounded-full justify-center items-center mb-4">
          <MaterialCommunityIcons name="shield-check" size={48} color="#10b981" />
        </View>
        <Text className="text-white text-3xl font-bold">4PS-Nexus</Text>
        <Text className="text-zinc-400 mt-2 text-center">
          Secure Beneficiary Portal
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleBiometricAuth}
        className="w-full bg-emerald-500 py-4 rounded-xl flex-row justify-center items-center"
      >
        <MaterialCommunityIcons name={isBiometricSupported ? "fingerprint" : "lock"} size={24} color="white" style={{ marginRight: 8 }} />
        <Text className="text-white font-bold text-lg">
          {isBiometricSupported ? 'Login with Biometrics' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
