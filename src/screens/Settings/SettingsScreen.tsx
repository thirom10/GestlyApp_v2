// src/screens/Settings/SettingsScreen.tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { Colors } from '../../shared/config/colors';
import { useAuthContext } from '../../shared/context/AuthContext';
import SettingRow from './components/SettingRow';
import { SettingsStackParamList } from './types/navigation';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signOut } = useAuthContext();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.list}>
        <SettingRow
          icon="person-outline"
          label="Información de cuenta"
          onPress={() => navigation.navigate('Account')}
        />

        <SettingRow
          icon="card-outline"
          label="Gestionar Suscripción"
          onPress={() => navigation.navigate('Subscription')}
        />

        <SettingRow
          icon="color-palette-outline"
          label="Cambiar Apariencia"
          onPress={() => navigation.navigate('AppearanceModal')}
        />

        <View style={styles.separator} />

        <SettingRow
          icon="log-out-outline"
          label="Cerrar Sesión"
          onPress={handleLogout}
          textColor={Colors.error}
          showBorder={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    padding: 20 
  },
  title: { 
    color: Colors.textPrimary, 
    fontSize: 24, 
    fontWeight: '600', 
    marginBottom: 20
  },
  list: { 
    paddingTop: 10, 
    paddingHorizontal: 6 
  },
  separator: {
    height: 20
  }
});
