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

export const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubscribe = () => {
    // Lógica de suscripción aquí
    console.log('Subscribe attempt:', { email, password, confirmPassword });
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
              
              <CustomInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <CustomInput
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <CustomButton
                title="Suscribirse Ahora"
                onPress={handleSubscribe}
                variant="primary"
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
    backgroundColor: '#000',
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
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#333',
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
    color: '#fff',
  },
  currency: {
    fontSize: 18,
    color: '#999',
    marginLeft: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  form: {
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 16,
  },
  loginLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});