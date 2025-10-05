import { Stack } from 'expo-router';
import { useAuthContext } from '@/src/shared/context/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthLayout() {
  const { user } = useAuthContext();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir a las tabs principales
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
        presentation: 'modal',
        gestureEnabled: false, // Evitar que el usuario pueda hacer swipe para volver
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}