import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../shared/config/colors';

interface StatCardProps {
  item: {
    label: string;
    value: string;
  };
}

export function StatCard({ item }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{item.label}</Text>
      <Text style={styles.statValue}>{item.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: 14,
    borderRadius: 12,
    marginRight: 10,
    minHeight: 90,
  },
  statLabel: { 
    color: Colors.textSecondary, 
    fontSize: 12, 
    marginBottom: 6 
  },
  statValue: { 
    color: Colors.textPrimary, 
    fontSize: 18, 
    fontWeight: '700' 
  },
});