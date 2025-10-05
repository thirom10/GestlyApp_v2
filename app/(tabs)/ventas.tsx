import ProtectedRoute from '@/components/ProtectedRoute';
import SalesScreen from '@/src/screens/Sales/SalesScreen';
import React from 'react';

export default function VentasTab() {
  return (
    <ProtectedRoute>
      <SalesScreen />
    </ProtectedRoute>
  );
}