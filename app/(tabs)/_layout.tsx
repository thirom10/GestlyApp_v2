import React from 'react';
import MainNavigator from '@/src/screens/MainNavigator';
import ProtectedRoute from './ProtectedRoute';

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <MainNavigator />
    </ProtectedRoute>
  );
}
