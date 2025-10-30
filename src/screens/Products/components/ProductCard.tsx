import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../shared/config/colors';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
  onDelete,
  onView,
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
    if (!dateString) return '-';
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
      onPress={onView || onPress}
      activeOpacity={0.8}
    >
      {/* Lápiz en esquina superior derecha */}
      {onEdit && (
        <TouchableOpacity
          style={styles.editCorner}
          onPress={onEdit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {/* Cambiar icono */}
          <Ionicons name="color-wand" size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {/* Header: nombre */}
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Trash (opcional) */}
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {/* Main row: Precio a la izquierda, Stock a la derecha */}
        <View style={styles.mainRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Precio</Text>
            <Text style={styles.salePrice}>{formatPrice(product.sale_price)}</Text>
          </View>

          <View style={styles.stockBlock}>
            <View style={styles.stockRow}>
              <View style={[styles.stockDot, { backgroundColor: stockStatus.color }]} />
              <Text style={styles.stockText}>{product.stock} unidades</Text>
            </View>

            <View style={[styles.stockBadge, { backgroundColor: `${stockStatus.color}22` }]}>
              <Text style={[styles.stockBadgeText, { color: stockStatus.color }]}>
                {stockStatus.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Additional info line */}
        <View style={styles.infoLine}>
          {weight && (
            <View style={styles.infoItem}>
              <Ionicons name="scale-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{weight}</Text>
            </View>
          )}

          {product.branch && (
            <View style={[styles.infoItem, { marginLeft: 14 }]}>
              <Ionicons name="business-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{product.branch}</Text>
            </View>
          )}

          {product.purchase_date && (
            <View style={[styles.infoItem, { marginLeft: 14 }]}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Comprado: {formatDate(product.purchase_date)}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.createdDate}>Agregado: {formatDate(product.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative', // para posicionar icono editCorner
  },
  content: {
    padding: 14,
  },

  /* esquina lápiz */
  editCorner: {
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 150, 255, 1)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 44, // espacio para el icono en esquina
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },

  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  priceBlock: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  salePrice: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700',
  },

  stockBlock: {
    alignItems: 'flex-end',
    minWidth: 110,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  stockText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
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
