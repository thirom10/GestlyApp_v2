import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../shared/config/colors';

// Importar las pantallas
import HomeScreen from './Home/HomeScreen';
import ProductsScreen from './Products/ProductsScreen';
import ReportsScreen from './Reports/ReportsScreen';
import SettingsNavigator from './Settings/SettingsNavigator'; // <-- Paso de SettingsScreen a SettingsNavigator

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Productos') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Reporte') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Usuario') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.backgroundSecondary,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: Colors.textPrimary,
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: Colors.textPrimary,
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
          headerTitle: 'Gestly',
        }}
      />
      <Tab.Screen 
        name="Productos" 
        component={ProductsScreen}
        options={{
          headerTitle: 'Productos',
        }}
      />
      <Tab.Screen 
        name="Reporte" 
        component={ReportsScreen}
        options={{
          headerTitle: 'Reportes',
        }}
      />
      <Tab.Screen 
        name="Usuario" 
        component={SettingsNavigator} // ← CAMBIO AQUÍ: usar SettingsNavigator en lugar de SettingsScreen
        options={{
          headerShown: false, // ← IMPORTANTE: ocultar el header del tab para que use el del stack
        }}
      />
    </Tab.Navigator>
  );
}