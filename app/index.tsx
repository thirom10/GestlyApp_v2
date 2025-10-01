import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthContext } from '@/src/shared/context/AuthContext';

export default function IndexScreen() {
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuario autenticado, redirigir a las tabs principales
        router.replace('/(tabs)');
      } else {
        // Usuario no autenticado, redirigir al login
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  // Mostrar loading mientras se verifica la autenticación
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});