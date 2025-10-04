import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../shared/config/colors';

interface LowStockItemProps {
  item: {
    name: string;
    remain: number;
    icon: string;
  };
}

export function LowStockItem({ item }: LowStockItemProps) {
  return (
    <View style={styles.lowStockItem}>
      <View style={styles.lowLeft}>
        <View style={styles.iconCircle}>
          <Ionicons name="cart-outline" size={20} color={Colors.primary} />
        </View>
        <View style={styles.lowStockTextContainer}>
          <Text style={styles.lowName}>{item.name}</Text>
          <Text style={styles.lowRemain}>Quedan: {item.remain}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.restockButton}
        activeOpacity={0.8}
      >
        <Text style={styles.restockText}>Reponer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  lowStockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  lowLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowStockTextContainer: {
    marginLeft: 12
  },
  lowName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600'
  },
  lowRemain: {
    color: Colors.textSecondary,
    fontSize: 12
  },
  restockButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  restockText: {
    color: Colors.textPrimary,
    fontWeight: '600'
  }
});