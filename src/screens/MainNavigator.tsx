import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../shared/config/colors';
import { useCart } from '../shared/context/CartContext';

// Importar las pantallas
import HomeScreen from './Home/HomeScreen';
import ProductsNavigator from './Products/ProductsNavigator';
import ReportsScreen from './Reports/ReportsScreen';
import SalesScreen from './Sales/SalesScreen';
import SettingsNavigator from './Settings/SettingsNavigator';

const Tab = createBottomTabNavigator();

function SalesButton({ onPress }: { onPress: () => void }) {
  const { state } = useCart();
  
  return (
    <View style={styles.salesButtonContainer}>
      {/* Contador del carrito */}
      {state.totalItems > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{state.totalItems}</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.salesButton} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.salesButtonInner}>
          <Ionicons name="add" size={24} color="#000000" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

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
          } else if (route.name === 'Ventas') {
            return null; // El botón personalizado se renderiza por separado
          } else if (route.name === 'Reporte') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Usuario') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarButton: (props) => {
          if (props.accessibilityRole === 'button' && props.children) {
            // Para la pestaña de Ventas, renderizar el botón personalizado
            if (props.to === '/Ventas') {
              return (
                <SalesButton 
                  onPress={() => {
                    if (props.onPress) {
                      props.onPress();
                    }
                  }} 
                />
              );
            }
          }
          return <TouchableOpacity {...props} />;
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
        component={ProductsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Ventas" 
        component={SalesScreen}
        options={{
          headerTitle: 'Ventas',
          tabBarLabel: '',
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
        component={SettingsNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  salesButtonContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -25,
    right: 0,
    left: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  cartBadgeText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  salesButton: {
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
  },
  salesButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});