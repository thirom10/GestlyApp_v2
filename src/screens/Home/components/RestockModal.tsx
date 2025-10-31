import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../shared/config/colors';

interface RestockModalProps {
  visible: boolean;
  product: {
    id: string;
    name: string;
    stock: number;
  } | null;
  onConfirm: (newStock: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  visible,
  product,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [stockToAdd, setStockToAdd] = useState('');

  if (!product) return null;

  const handleConfirm = () => {
    const addAmount = parseInt(stockToAdd);
    if (isNaN(addAmount) || addAmount <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida mayor a 0');
      return;
    }
    
    const newStock = product.stock + addAmount;
    onConfirm(newStock);
    setStockToAdd('');
  };

  const handleCancel = () => {
    setStockToAdd('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
          {/* Header con icono de restock */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="add-circle" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Reponer Stock</Text>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <Text style={styles.message}>
              Producto: <Text style={styles.productName}>"{product.name}"</Text>
            </Text>
            <Text style={styles.currentStock}>
              Stock actual: {product.stock} unidades
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cantidad a agregar:</Text>
              <TextInput
                style={styles.input}
                value={stockToAdd}
                onChangeText={setStockToAdd}
                placeholder="Ej: 10"
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
                editable={!loading}
                autoFocus={true}
                selectTextOnFocus={true}
                blurOnSubmit={false}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />
            </View>

            {stockToAdd && !isNaN(parseInt(stockToAdd)) && parseInt(stockToAdd) > 0 && (
              <Text style={styles.newStockPreview}>
                Nuevo stock: {product.stock + parseInt(stockToAdd)} unidades
              </Text>
            )}
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={loading || !stockToAdd || isNaN(parseInt(stockToAdd)) || parseInt(stockToAdd) <= 0}
            >
              <Ionicons 
                name="checkmark" 
                size={16} 
                color={Colors.textPrimary} 
                style={styles.buttonIcon}
              />
              <Text style={styles.confirmButtonText}>
                {loading ? 'Actualizando...' : 'Confirmar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    backgroundColor: `${Colors.primary}20`,
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
    marginBottom: 8,
  },
  productName: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  currentStock: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newStockPreview: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '600',
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
  confirmButton: {
    backgroundColor: Colors.primary,
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
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});