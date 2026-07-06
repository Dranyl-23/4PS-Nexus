import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';

import { SettingsProvider } from './src/context/SettingsContext';

function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AppNavigator /> : <LoginScreen />;
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SettingsProvider>
  );
}
