import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { CustomInput, CustomButton } from './components';
import { useAuth } from './hooks/useAuth';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { showToast } from '../../shared/components/Toast';
import { PasswordInput } from '../../shared/components/PasswordInput';
import { Colors } from '../../shared/config/colors';

export const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const { signUp, loading } = useAuth();

  const validateEmail = (email: string): boolean => {
    return email.includes('@') && email.includes('.');
  };

  const handleSubscribe = async () => {
    // Limpiar errores previos
    setPasswordError('');
    setGeneralError('');

    if (!email || !password || !confirmPassword) {
      setGeneralError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setGeneralError('Por favor ingresa un email válido');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await signUp({ email, password });
      showToast.success(
        'Registro Exitoso',
        'Usuario registrado correctamente'
      );
      // Pequeño delay para que se vea la notificación antes de navegar
      setTimeout(() => {
        router.push('/(auth)/login');
      }, 2000);
    } catch (error: any) {
      setGeneralError(error.message || 'Ocurrió un error al registrarse');
      showToast.error('Error de Registro', error.message || 'Ocurrió un error al registrarse');
    }
  };

  const handleLogin = () => {
    // Navegación a login
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Gestly</Text>
              <Text style={styles.subtitle}>Tu plan de suscripción</Text>
            </View>

            {/* Pricing Card */}
            <View style={styles.pricingCard}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>$5.000</Text>
                <Text style={styles.currency}>ARS</Text>
              </View>
              
              <Text style={styles.planTitle}>Libera el Potencial de tu Negocio</Text>
              
              <Text style={styles.planDescription}>
                Descubre Gestly, la solución ERP diseñada especialmente para pequeños comercios que buscan crecer sin complicaciones. Con nuestra plataforma podrás dar de alta todos tus productos de forma rápida y sencilla, gestionarlos, actualizarlos o eliminarlos en cualquier momento. Registra tus ventas al instante y accede a un historial detallado que te permitirá entender mejor el movimiento de tu negocio y tomar decisiones más acertadas.
              </Text>
              
              <Text style={styles.additionalInfo}>
                Además, disfruta nuestras próximas actualizaciones.
              </Text>
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

              <PasswordInput
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                containerStyle={styles.passwordContainer}
              />

              <ErrorMessage 
                message={passwordError} 
                visible={!!passwordError} 
              />

              <ErrorMessage 
                message={generalError} 
                visible={!!generalError} 
                style={styles.generalError}
              />

              <CustomButton
                title={loading ? "Registrando..." : "Suscribirse Ahora"}
                onPress={handleSubscribe}
                variant="primary"
                disabled={loading}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  currency: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  planDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    textAlign: 'justify',
    marginBottom: 12,
  },
  additionalInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  form: {
    marginBottom: 30,
  },
  passwordContainer: {
    marginBottom: 16,
  },
  generalError: {
    marginTop: 8,
    marginBottom: 20,
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
  loginLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});