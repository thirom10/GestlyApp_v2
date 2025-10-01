import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { ProfileCircle, SettingsButton } from './components';
import styles from './Styles';

export const SettingsScreen: React.FC = () => {
  const goAccount = () => console.log('Información de cuenta');
  const goSubscription = () => console.log('Suscripción');
  const goAppearance = () => console.log('Apariencia');
  const openProfilePhoto = () => console.log('Seleccionar foto');

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
            <Text style={styles.subtitle}>Estas en Settings</Text>
          </View>

          {/* Perfil (círculo) */}
          <View style={styles.profileWrapper}>
            <ProfileCircle onPress={openProfilePhoto} />
          </View>

          {/* Botones centrados en la pantalla */}
          <View style={styles.buttonsContainer}>
            <SettingsButton title="Información de cuenta" onPress={goAccount} />
            <SettingsButton title="Suscripción" onPress={goSubscription} />
            <SettingsButton title="Apariencia" onPress={goAppearance} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
