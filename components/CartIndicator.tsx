import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '@/src/shared/context/CartContext';
import { Colors } from '@/src/shared/config/colors';
import { router } from 'expo-router';

export function CartIndicator() {
  const { state } = useCart();

  if (state.totalItems === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Productos en el carrito: {state.totalItems}
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/(tabs)/carrito')}
      >
        <Text style={styles.buttonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});