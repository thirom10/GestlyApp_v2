import React, { useEffect } from 'react';
import { useAuthContext } from '@/src/shared/context/AuthContext';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !user) {
      // Si no hay usuario autenticado, redirigir al login
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Si no hay usuario, no renderizar nada (se redirigirá)
  if (!user) {
    return null;
  }

  // Si hay usuario autenticado, renderizar los children
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});