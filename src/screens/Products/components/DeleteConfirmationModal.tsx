import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/config/colors';
import { Product } from '../services/productService';

interface DeleteConfirmationModalProps {
  visible: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  product,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header con icono de advertencia */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="warning" size={32} color={Colors.error} />
            </View>
            <Text style={styles.title}>Eliminar Producto</Text>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <Text style={styles.message}>
              ¿Estás seguro de que quieres eliminar el producto{' '}
              <Text style={styles.productName}>"{product.name}"</Text>?
            </Text>
            <Text style={styles.warning}>
              Esta acción no se puede deshacer.
            </Text>
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton, loading && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Ionicons 
                name="trash" 
                size={16} 
                color={Colors.textPrimary} 
                style={styles.buttonIcon}
              />
              <Text style={styles.deleteButtonText}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    width: Math.min(width - 40, 400),
    maxWidth: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.error}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  productName: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  warning: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: Colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});