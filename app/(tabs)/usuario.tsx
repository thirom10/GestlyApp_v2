import ProtectedRoute from '@/components/ProtectedRoute';
import SettingsNavigator from '@/src/screens/Settings/SettingsNavigator';
import React from 'react';

export default function UsuarioTab() {
  return (
    <ProtectedRoute>
      <SettingsNavigator />
    </ProtectedRoute>
  );
}