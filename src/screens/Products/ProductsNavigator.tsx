import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../../shared/config/colors';
import ProductsScreen from './ProductsScreen';
import AddProductScreen from './AddProductScreen';

const Stack = createStackNavigator();

export default function ProductsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
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
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="ProductsList" 
        component={ProductsScreen}
        options={{
          headerTitle: 'Productos',
        }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={{
          headerTitle: 'Agregar Producto',
        }}
      />
    </Stack.Navigator>
  );
}