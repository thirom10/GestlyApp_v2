import ProtectedRoute from '@/components/ProtectedRoute';
import ReportsScreen from '@/src/screens/Reports/ReportsScreen';
import React from 'react';

export default function ReporteTab() {
  return (
    <ProtectedRoute>
      <ReportsScreen />
    </ProtectedRoute>
  );
}