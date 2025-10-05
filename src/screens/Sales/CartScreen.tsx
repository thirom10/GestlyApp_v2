import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../shared/config/colors';
import { useCart, CartItem } from '../../shared/context/CartContext';
import { salesService } from '../../shared/services/salesService';
import { useAuthContext } from '../../shared/context/AuthContext';

interface CartItemComponentProps {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({ 
  item, 
  onQuantityChange, 
  onRemove 
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      onQuantityChange(item.id, item.quantity + 1);
    } else {
      Alert.alert('Stock insuficiente', `Solo hay ${item.stock} unidades disponibles`);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de que quieres eliminar "${item.name}" del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onRemove(item.id) },
      ]
    );
  };

  const subtotal = item.price * item.quantity;

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
          <Text style={styles.itemStock}>Stock disponible: {item.stock}</Text>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.itemFooter}>
        <View style={styles.quantityControls}>
          <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
            <Ionicons name="remove" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityText}>{item.quantity}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.quantityButton, styles.quantityButtonAdd]} 
            onPress={handleIncrease}
          >
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Subtotal:</Text>
          <Text style={styles.subtotalAmount}>${subtotal.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

export default function CartScreen() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de que quieres vaciar todo el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleBackToSales = () => {
    router.back();
  };

  const { user } = useAuthContext();
  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        router.push('/(auth)/login');
        return;
      }

      if (state.items.length === 0) {
        return;
      }

      const result = await salesService.createSale({
        userId: user.id,
        items: state.items,
        totalAmount: state.totalAmount,
      });

      if (result.success) {
        clearCart();
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('Error en el proceso de compra:', error);
      Alert.alert('Error', 'No se pudo procesar la compra. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartItemComponent
      item={item}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemoveItem}
    />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cart-outline" size={64} color={Colors.textTertiary} />
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptySubtitle}>
        Agrega productos desde la sección de Ventas para comenzar
      </Text>
      <TouchableOpacity style={styles.backToSalesButton} onPress={handleBackToSales}>
        <Text style={styles.backToSalesButtonText}>Ir a Ventas</Text>
      </TouchableOpacity>
    </View>
  );

  if (state.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToSales}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Carrito</Text>
          <View style={styles.headerSpacer} />
        </View>

        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToSales}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Carrito</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Lista de productos en el carrito */}
      <FlatList
        data={state.items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer con resumen y botones */}
      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de productos:</Text>
            <Text style={styles.summaryValue}>{state.totalItems}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total a pagar:</Text>
            <Text style={styles.summaryTotal}>${state.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.continueShoppingButton]} 
            onPress={handleBackToSales}
          >
            <Text style={styles.continueShoppingButtonText}>Seguir Comprando</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.checkoutButton,
              isLoading && styles.checkoutButtonDisabled
            ]} 
            onPress={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemStock: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  removeButton: {
    padding: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quantityButtonAdd: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quantityDisplay: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subtotalContainer: {
    alignItems: 'flex-end',
  },
  subtotalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  footer: {
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summary: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueShoppingButton: {
    backgroundColor: Colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  continueShoppingButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
  },
  checkoutButtonDisabled: {
    backgroundColor: Colors.textTertiary,
    opacity: 0.7,
  },
  checkoutButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  backToSalesButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToSalesButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});