import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { PasswordInput } from '../../shared/components/PasswordInput';
import { Colors } from '../../shared/config/colors';
import { CustomButton, CustomInput } from './components';
import { useAuth } from './hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    // Limpiar errores previos
    setLoginError('');

    if (!email || !password) {
      setLoginError('Por favor completa todos los campos');
      return;
    }

    try {
      setButtonLoading(true);
      await signIn({ email, password });
    } catch (error: any) {
      setButtonLoading(false);
      const errorMessage = error.message || 'Ocurrió un error al iniciar sesión';
      
      // Personalizar mensajes de error comunes
      if (errorMessage.includes('Invalid login credentials')) {
        setLoginError('Email o contraseña incorrectos');
      } else if (errorMessage.includes('Email not confirmed')) {
        setLoginError('Por favor confirma tu email antes de iniciar sesión');
      } else if (errorMessage.includes('User not found')) {
        setLoginError('No existe una cuenta con este email');
      } else {
        setLoginError(errorMessage);
      }
    }
  };

  const handleRegister = () => {
    // Navegación a registro
    router.push('/(auth)/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Gestly</Text>
            <Text style={styles.subtitle}>Administra tu negocio con facilidad.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <PasswordInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              containerStyle={styles.passwordContainer}
            />

            <ErrorMessage 
              message={loginError} 
              visible={!!loginError} 
            />

            <CustomButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              variant="primary"
              loading={buttonLoading}
              disabled={buttonLoading}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  passwordContainer: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  registerLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});