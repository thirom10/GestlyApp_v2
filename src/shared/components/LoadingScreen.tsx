import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../config/colors';

interface LoadingScreenProps {
  visible: boolean;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  visible, 
  message = "estamos preparando todo para ti" 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestly</Text>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LoadingScreen;