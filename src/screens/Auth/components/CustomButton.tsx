import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        (disabled || loading) && styles.disabledButton
      ]} 
      disabled={disabled || loading}
      {...props}
    >
      <View style={styles.buttonContent}>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#000' : '#fff'} 
            style={styles.spinner}
          />
        )}
        <Text style={[
          styles.buttonText,
          variant === 'primary' ? styles.primaryText : styles.secondaryText,
          (disabled || loading) && styles.disabledText,
          loading && styles.loadingText
        ]}>
          {loading ? 'Cargando...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#000',
  },
  secondaryText: {
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  loadingText: {
    opacity: 1,
  },
});