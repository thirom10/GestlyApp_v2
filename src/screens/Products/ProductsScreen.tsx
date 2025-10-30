import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../shared/config/colors';
import { useProducts } from './hooks/useProducts';
import { ProductCard } from './components/ProductCard';
import { Product } from './services/productService';

export default function ProductsScreen() {
  const navigation = useNavigation();
  const {
    products,
    loading,
    error,
    refreshing,
    refreshProducts,
    deleteProduct,
    searchProducts,
    clearError,
  } = useProducts();
  
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Manejar búsqueda con debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      searchProducts(searchText);
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchText]);

  // Limpiar error cuando se monta el componente
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []);

  const handleAddProduct = () => {
    navigation.navigate('AddProduct' as never);
  };

  const handleViewProduct = (product: Product) => {
    navigation.navigate('AddProduct' as never, { 
      product, 
      mode: 'view' 
    } as never);
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate('AddProduct' as never, { 
      product, 
      mode: 'edit' 
    } as never);
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de que quieres eliminar "${product.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteProduct(product.id);
            if (!success) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onEdit={() => handleEditProduct(item)}
      onDelete={() => handleDeleteProduct(item)}
      onView={() => handleViewProduct(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={64} color={Colors.textTertiary} />
      <Text style={styles.emptyTitle}>
        {searchText ? 'No se encontraron productos' : 'No hay productos'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchText 
          ? 'Intenta con otros términos de búsqueda'
          : 'Agrega tu primer producto para comenzar'
        }
      </Text>
      {!searchText && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleAddProduct}
        >
          <Text style={styles.emptyButtonText}>Agregar Producto</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={Colors.textSecondary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor={Colors.textPlaceholder}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
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
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshProducts}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Botón flotante para agregar */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleAddProduct}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para el botón flotante
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
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
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});