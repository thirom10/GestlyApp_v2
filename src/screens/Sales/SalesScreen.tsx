import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../shared/config/colors';
import { useCart } from '../../shared/context/CartContext';
import { useProducts } from '../Products/hooks/useProducts';
import { Product } from '../Products/types/Product';

interface SalesItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const SalesItem: React.FC<SalesItemProps> = ({ product, quantity, onQuantityChange }) => {
  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      onQuantityChange(quantity + 1);
    } else {
      Alert.alert('Stock insuficiente', `Solo hay ${product.stock} unidades disponibles`);
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{product.name}</Text>
        <Text style={styles.itemPrice}>${product.sale_price?.toLocaleString()}</Text>
        <Text style={styles.itemStock}>Stock: {product.stock}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, quantity === 0 && styles.quantityButtonDisabled]}
          onPress={handleDecrease}
          disabled={quantity === 0}
        >
          <Ionicons 
            name="remove" 
            size={20} 
            color={quantity === 0 ? Colors.textTertiary : Colors.textPrimary} 
          />
        </TouchableOpacity>
        
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.quantityButton, styles.quantityButtonAdd]}
          onPress={handleIncrease}
        >
          <Ionicons name="add" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function SalesScreen() {
  const { products, loading, error, loadProducts } = useProducts();
  const { state, updateQuantity, getItemQuantity, addItem } = useCart();
  const [localQuantities, setLocalQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Sincronizar cantidades locales con el carrito
    const quantities: { [key: string]: number } = {};
    products.forEach(product => {
      quantities[product.id] = getItemQuantity(product.id);
    });
    setLocalQuantities(quantities);
  }, [products, state.items]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setLocalQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));

    if (newQuantity > 0 && !state.items.find(item => item.id === productId)) {
      // Si es la primera vez que se agrega el producto
      addItem({
        id: product.id,
        name: product.name,
        price: product.sale_price || 0,
        stock: product.stock
      });
    } else {
      // Si ya existe, actualizar la cantidad
      updateQuantity(productId, newQuantity);
    }
  };

  const handleViewCart = () => {
    router.push('/(tabs)/carrito');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <SalesItem
      product={item}
      quantity={localQuantities[item.id] || 0}
      onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={64} color={Colors.textTertiary} />
      <Text style={styles.emptyTitle}>No hay productos disponibles</Text>
      <Text style={styles.emptySubtitle}>
        Agrega productos desde la sección de Productos para comenzar a vender
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
          <Text style={styles.errorTitle}>Error al cargar productos</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header con título y descripción */}
      <View style={styles.header}>
        <Text style={styles.title}>Ventas</Text>
        <Text style={styles.subtitle}>Selecciona productos para agregar al carrito</Text>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          products.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Contador del carrito y botón Ver */}
      {state.totalItems > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartInfo}>
            <View style={styles.cartIconContainer}>
              <Ionicons name="cart-outline" size={24} color={Colors.primary} />
              <Text style={styles.cartBadge}>{state.totalItems}</Text>
            </View>
            <Text style={styles.cartCount}>
              {state.totalItems} {state.totalItems === 1 ? 'producto' : 'productos'} en el carrito
            </Text>
          </View>
          <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
            <Text style={styles.viewCartButtonText}>Ver Carrito</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textPrimary} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  itemStock: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
    borderColor: Colors.textTertiary,
  },
  quantityButtonAdd: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quantityDisplay: {
    width: 50,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cartFooter: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 1000,
  },
  cartInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  cartCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  viewCartButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
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
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  errorSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});