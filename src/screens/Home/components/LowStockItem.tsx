import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/config/colors';
import { RestockModal } from './RestockModal';

interface LowStockItemProps {
  item: {
    id: string;
    name: string;
    remain: number;
    icon: string;
  };
  onStockUpdated: (productId: string, newStock: number) => Promise<void>;
}

export function LowStockItem({ item, onStockUpdated }: LowStockItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRestock = () => {
    setModalVisible(true);
  };

  const handleConfirmRestock = async (quantity: number) => {
    setLoading(true);
    try {
      const newStock = item.remain + quantity;
      await onStockUpdated(item.id, newStock);
      setModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRestock = () => {
    setModalVisible(false);
  };

  return (
    <>
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
          onPress={handleRestock}
        >
          <Text style={styles.restockText}>Reponer</Text>
        </TouchableOpacity>
      </View>

      <RestockModal
        visible={modalVisible}
        product={{
          id: item.id,
          name: item.name,
          stock: item.remain
        }}
        onConfirm={handleConfirmRestock}
        onCancel={handleCancelRestock}
        loading={loading}
      />
    </>
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