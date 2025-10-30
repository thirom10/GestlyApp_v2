import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../../shared/config/colors';

interface FeaturedCardProps {
  product: {
    id?: string;
    name: string;
    subtitle: string;
  };
}

export function FeaturedCard({ product }: FeaturedCardProps) {
  const handleNavigateToProductDetail = () => {
    if (product.id) {
      router.push({
        pathname: `/product/${product.id}`,
        params: { name: product.name }
      });
    }
  };

  return (
    <View style={styles.featuredCard}>
      <View style={styles.featuredLeft}>
        <View style={styles.featuredImagePlaceholder}>
          <Ionicons name="cart-outline" size={22} color={Colors.primary} />
        </View>
        <View style={styles.featuredTextContainer}>
          <Text style={styles.featuredTitle}>{product.name}</Text>
          <Text style={styles.featuredSubtitle}>{product.subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.smallSquare}
        onPress={handleNavigateToProductDetail}
        disabled={!product.id}
      >
        <Ionicons name="arrow-forward" size={18} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  featuredLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  featuredImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTextContainer: {
    marginLeft: 12
  },
  featuredTitle: { 
    color: Colors.textPrimary, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  featuredSubtitle: { 
    color: Colors.textSecondary, 
    fontSize: 12 
  },
  smallSquare: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});