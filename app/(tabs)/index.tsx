import React from 'react';
import HomeScreen from '@/src/screens/Home/HomeScreen';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HomeTab() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  );
}
