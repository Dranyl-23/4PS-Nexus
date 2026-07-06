import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, Dimensions, Platform, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { api, BeneficiaryService } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { darkMapStyle, calculateDistance } from '../utils/mapHelpers';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_INSET = (width - CARD_WIDTH) / 2;

// Simple cache to avoid spamming Nominatim API
const geocodeCache: Record<string, { lat: number; lon: number } | null> = {};

export default function MerchantMapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mapRef = useRef<MapView>(null);
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // 1. Get Location Permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // 2. Get User Location
        let userLoc = await Location.getCurrentPositionAsync({});
        setLocation(userLoc);

        // 3. Fetch Approved Merchants from our Backend
        const merchantsData = await BeneficiaryService.getMerchants();

        // 4. Geocode Merchant Addresses using OpenStreetMap (Nominatim)
        const geocodedMerchants = await Promise.all(
          merchantsData.map(async (m: any) => {
            if (!m.location) return { ...m, coords: null };

            // EXACT OVERRIDES FOR PERFECT DEMO
            if (m.businessName?.toLowerCase().includes('gmall')) {
              return { ...m, coords: { lat: 7.0865, lon: 125.6139 } }; // Exact Gmall Davao
            }
            if (m.businessName?.toLowerCase().includes('lynard')) {
              return { ...m, coords: { lat: 6.6946, lon: 125.3340 } }; // Exact Cabligan, Hagonoy
            }

            // Check cache
            if (geocodeCache[m.location] !== undefined) {
              return { ...m, coords: geocodeCache[m.location] };
            }

            try {
              // Geocode via our Next.js backend proxy
              const response = await api.get(`/geocode?q=${encodeURIComponent(m.location + ', Philippines')}`);
              const data = response.data;
              
              if (data && data.length > 0) {
                const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                geocodeCache[m.location] = coords;
                return { ...m, coords };
              }
            } catch (err) {
              console.warn('Geocoding failed for', m.location);
            }
            
            geocodeCache[m.location] = null;
            return { ...m, coords: null };
          })
        );

        // Filter out merchants we couldn't geocode
        const validMerchants = geocodedMerchants.filter((m: any) => m.coords !== null);
        
        // Calculate distance and sort
        if (userLoc) {
          validMerchants.forEach((m: any) => {
            m.distance = calculateDistance(
              userLoc.coords.latitude, userLoc.coords.longitude,
              m.coords.lat, m.coords.lon
            );
          });
          validMerchants.sort((a, b) => a.distance - b.distance);
        }

        setMerchants(validMerchants);
      } catch (err: any) {
        console.error('Error in MapScreen:', err);
        setErrorMsg('Failed to load map data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const item = viewableItems[0].item;
      mapRef.current?.animateToRegion({
        latitude: item.coords.lat,
        longitude: item.coords.lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text className={`mt-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Loading Real-time Map & Merchants...</Text>
      </View>
    );
  }

  if (errorMsg && !location) {
    return (
      <View className={`flex-1 items-center justify-center p-6 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
        <Text className="text-red-500 text-lg text-center">{errorMsg}</Text>
      </View>
    );
  }

  // Default to a central PH location if user location fails but we still want to show the map
  const defaultLocation = {
    latitude: location ? location.coords.latitude : 10.3157, // Cebu City default
    longitude: location ? location.coords.longitude : 123.8854,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const filteredMerchants = merchants.filter(m => 
    m.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={defaultLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
        customMapStyle={isDark ? darkMapStyle : []}
        userInterfaceStyle={isDark ? "dark" : "light"}
      >
        {filteredMerchants.map((merchant, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: merchant.coords.lat,
              longitude: merchant.coords.lon,
            }}
            pinColor="#10b981" // Emerald color for 4P merchants
          />
        ))}
      </MapView>

      {/* Floating Functional Search Bar */}
      <View className="absolute top-12 w-full px-4 flex-row justify-center">
        <View className={`rounded-full flex-row px-4 py-1 shadow-lg items-center border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'} w-full max-w-sm`}>
          <Ionicons name="search" size={20} color={isDark ? '#a1a1aa' : '#9ca3af'} />
          <TextInput 
            className={`flex-1 ml-2 py-3 font-medium ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}
            placeholder="Find Approved Stores..."
            placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
              <Ionicons name="close-circle" size={18} color={isDark ? '#71717a' : '#9ca3af'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredMerchants.length > 0 ? (
        <FlatList
          horizontal
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          contentInset={{
            top: 0,
            left: CARD_INSET - 10,
            bottom: 0,
            right: CARD_INSET - 10,
          }}
          contentContainerStyle={{ paddingHorizontal: Platform.OS === 'android' ? CARD_INSET - 10 : 0 }}
          data={filteredMerchants}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          style={{ position: 'absolute', bottom: 20, left: 0, right: 0 }}
          renderItem={({ item }) => (
            <View className={`mx-[10px] rounded-3xl p-5 shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700/80' : 'bg-white border-gray-100'}`} style={{ width: CARD_WIDTH }}>
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-full bg-blue-500/10 items-center justify-center mr-3 border border-blue-500/20">
                   <Ionicons name={item.category?.includes('Medicines') ? 'medical' : 'storefront'} size={24} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>{item.businessName}</Text>
                  <Text className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{item.category || 'General Store'}</Text>
                </View>
              </View>
              <Text className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`} numberOfLines={2}>{item.location}</Text>
              
              {item.distance !== undefined && (
                <View className={`flex-row items-center justify-between p-3 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <View className="flex-row items-center">
                    <Ionicons name="navigate" size={16} color="#10b981" className="mr-2" />
                    <Text className="text-emerald-500 font-bold">{item.distance < 1 ? `${(item.distance * 1000).toFixed(0)} meters away` : `${item.distance.toFixed(1)} km away`}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#10b981" />
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <View className={`absolute bottom-10 self-center px-6 py-4 rounded-2xl shadow-lg border flex-row items-center ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'}`}>
          <Ionicons name="alert-circle" size={24} color={isDark ? '#a1a1aa' : '#9ca3af'} />
          <Text className={`ml-3 font-medium ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>No merchants found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
