import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../config/colors';

interface ErrorMessageProps {
  message: string;
  visible: boolean;
  style?: any;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  visible, 
  style 
}) => {
  if (!visible || !message) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.errorBackground,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ErrorMessage;