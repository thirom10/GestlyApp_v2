import { Colors } from '@/src/shared/config/colors';
import { useCart } from '@/src/shared/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SalesButton() {
  const { state } = useCart();
  
  return (
    <View style={{
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Contador del carrito */}
      {state.totalItems > 0 && (
        <View style={{
          position: 'absolute',
          top: -25,
          right: 5,
          backgroundColor: Colors.primary,
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          borderWidth: 2,
          borderColor: Colors.background,
        }}>
          <Text style={{
            color: Colors.textPrimary,
            fontSize: 12,
            fontWeight: '700',
            paddingHorizontal: 4,
          }}>{state.totalItems}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={{
          top: -20,
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
        onPress={() => router.push('/(tabs)/ventas')}
        activeOpacity={0.8}
      >
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons name="add" size={24} color="#000000" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.backgroundSecondary,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            paddingBottom: insets.bottom || 5,
            paddingTop: 5,
            height: 60 + (insets.bottom || 0),
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
        }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: 'Gestly',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Productos',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ventas"
        options={{
          title: '',
          headerTitle: 'Ventas',
          tabBarButton: () => <SalesButton />,
        }}
      />
      <Tabs.Screen
        name="reporte"
        options={{
          title: 'Reporte',
          headerTitle: 'Reportes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="usuario"
        options={{
          title: 'Usuario',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          href: null, // Ocultar de la barra de navegación
        }}
      />
    </Tabs>
    </>
  );
}
