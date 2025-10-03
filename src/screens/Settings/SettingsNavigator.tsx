import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
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
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen
        name="AppearanceModal"
        component={AppearanceModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
