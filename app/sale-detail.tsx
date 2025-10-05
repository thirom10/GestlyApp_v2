import React from 'react';
import { View } from 'react-native';
import SaleDetailScreen from '@/src/screens/Reports/SaleDetailScreen';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SaleDetailModal() {
  return (
    <ProtectedRoute>
      <SaleDetailScreen />
    </ProtectedRoute>
  );
}