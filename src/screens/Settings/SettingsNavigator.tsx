import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Colors } from '../../shared/config/colors';
import AccountScreen from './AccountScreen';
import SettingsScreen from './SettingsScreen';
import SubscriptionScreen from './SubscriptionScreen';
import AppearanceModal from './components/AppearanceModal';
import { SettingsStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Usuario',
        }}
      />
      
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          title: 'Información de cuenta',
          headerBackTitle: 'Atrás',
        }}
      />
      
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{
          title: 'Gestionar Suscripción',
          headerBackTitle: 'Atrás',
        }}
      />
      
      <Stack.Screen
        name="AppearanceModal"
        component={AppearanceModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          title: 'Cambiar Apariencia',
        }}
      />
    </Stack.Navigator>
  );
}