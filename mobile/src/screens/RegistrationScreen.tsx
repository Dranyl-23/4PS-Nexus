import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BeneficiaryService } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function RegistrationScreen({ route }: any) {
  const navigation = useNavigation();
  const publicKey = route?.params?.publicKey;

  const [dswdId, setDswdId] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!publicKey) {
      Alert.alert('Error', 'Missing Wallet Key. Please restart the app.');
      return;
    }
    if (!dswdId || !fullName || !address) {
      Alert.alert('Incomplete', 'Please fill out all official fields.');
      return;
    }
    if (dswdId.length < 5) {
      Alert.alert('Invalid ID', 'Please enter a valid DSWD Household ID.');
      return;
    }

    setLoading(true);
    try {
      await BeneficiaryService.registerProfile(publicKey, fullName, address, dswdId);
      // Go to Dashboard and clear history so they can't go back to registration
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as never }],
      });
    } catch (error) {
      Alert.alert('Registration Failed', 'Could not save your profile. Try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-zinc-900" 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        
        {/* Header Icon */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 items-center justify-center mb-4">
            <Ionicons name="shield-checkmark" size={40} color="#10b981" />
          </View>
          <Text className="text-3xl font-black text-white tracking-tight text-center">4Ps Network</Text>
          <Text className="text-emerald-500 font-bold tracking-widest text-xs uppercase mt-1">Beneficiary Registration</Text>
        </View>

        <View className="mb-6">
          <Text className="text-zinc-400 text-center text-sm leading-relaxed">
            Link your digital wallet to the DSWD database to automatically receive and spend your monthly cash grants.
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-zinc-800 p-6 rounded-3xl border border-zinc-700 shadow-xl">
          
          <Text className="text-zinc-500 font-bold mb-2 text-xs uppercase tracking-widest">DSWD Household ID</Text>
          <View className="flex-row items-center bg-zinc-900 rounded-xl mb-5 border border-zinc-700 px-4">
            <Ionicons name="card" size={20} color="#71717a" className="mr-3" />
            <TextInput
              className="flex-1 text-white p-4 font-mono tracking-wider"
              placeholder="e.g. 123456789"
              placeholderTextColor="#52525b"
              keyboardType="number-pad"
              value={dswdId}
              onChangeText={setDswdId}
            />
          </View>

          <Text className="text-zinc-500 font-bold mb-2 text-xs uppercase tracking-widest">Full Name</Text>
          <View className="flex-row items-center bg-zinc-900 rounded-xl mb-5 border border-zinc-700 px-4">
            <Ionicons name="person" size={20} color="#71717a" className="mr-3" />
            <TextInput
              className="flex-1 text-white p-4"
              placeholder="Juan Dela Cruz"
              placeholderTextColor="#52525b"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <Text className="text-zinc-500 font-bold mb-2 text-xs uppercase tracking-widest">Complete Address</Text>
          <View className="flex-row items-center bg-zinc-900 rounded-xl mb-8 border border-zinc-700 px-4">
            <Ionicons name="location" size={20} color="#71717a" className="mr-3" />
            <TextInput
              className="flex-1 text-white p-4"
              placeholder="Brgy. San Jose, Cebu City"
              placeholderTextColor="#52525b"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity 
            className={`bg-emerald-500 py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-emerald-500/20 ${(!dswdId || !fullName || !address) ? 'opacity-50' : ''}`}
            onPress={handleRegister}
            disabled={loading || !dswdId || !fullName || !address}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-emerald-900 font-black uppercase tracking-widest text-base mr-2">Link Account</Text>
                <Ionicons name="arrow-forward" size={20} color="#064e3b" />
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <View className="mt-8 items-center bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
          <Text className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-1">Generated Wallet Key</Text>
          <Text className="text-emerald-500/70 font-mono text-xs">
            {publicKey ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : 'Generating securely...'}
          </Text>
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
