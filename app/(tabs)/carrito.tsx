import ProtectedRoute from '@/components/ProtectedRoute';
import CartScreen from '@/src/screens/Sales/CartScreen';
import React from 'react';

export default function CarritoTab() {
  return (
    <ProtectedRoute>
      <CartScreen />
    </ProtectedRoute>
  );
}