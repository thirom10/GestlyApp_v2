import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/config/colors';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatWeight = () => {
    if (!product.net_weight || !product.weight_unit) return null;
    return `${product.net_weight}${product.weight_unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { color: Colors.error, text: 'Sin stock' };
    } else if (product.stock < 10) {
      return { color: Colors.warning, text: 'Stock bajo' };
    }
    return { color: Colors.success, text: 'En stock' };
  };

  const stockStatus = getStockStatus();
  const weight = formatWeight();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Header con nombre y acciones */}
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onEdit}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="pencil" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onDelete}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Información principal */}
        <View style={styles.mainInfo}>
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Compra:</Text>
              <Text style={styles.purchasePrice}>{formatPrice(product.purchase_price)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Venta:</Text>
              <Text style={styles.salePrice}>{formatPrice(product.sale_price)}</Text>
            </View>
          </View>

          <View style={styles.stockSection}>
            <View style={styles.stockRow}>
              <Text style={styles.stockLabel}>Stock:</Text>
              <Text style={styles.stockValue}>{product.stock}</Text>
            </View>
            <View style={[styles.stockStatus, { backgroundColor: stockStatus.color + '20' }]}>
              <Text style={[styles.stockStatusText, { color: stockStatus.color }]}>
                {stockStatus.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.additionalInfo}>
          {weight && (
            <View style={styles.infoItem}>
              <Ionicons name="scale-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{weight}</Text>
            </View>
          )}
          
          {product.branch && (
            <View style={styles.infoItem}>
              <Ionicons name="business-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{product.branch}</Text>
            </View>
          )}
          
          {product.purchase_date && (
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Comprado: {formatDate(product.purchase_date)}</Text>
            </View>
          )}
        </View>

        {/* Footer con fecha de creación */}
        <View style={styles.footer}>
          <Text style={styles.createdDate}>
            Agregado: {formatDate(product.created_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceSection: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: 60,
  },
  purchasePrice: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  salePrice: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  stockSection: {
    alignItems: 'flex-end',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  stockValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  stockStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  additionalInfo: {
    gap: 6,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  createdDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
});