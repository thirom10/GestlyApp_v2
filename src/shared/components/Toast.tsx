import React from 'react';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { View, Text } from 'react-native';

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#4CAF50',
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        marginHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
      }}
      text2Style={{
        fontSize: 14,
        color: '#388E3C',
        marginTop: 2,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#F44336',
        backgroundColor: '#FFEBEE',
        borderRadius: 12,
        marginHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#C62828',
      }}
      text2Style={{
        fontSize: 14,
        color: '#D32F2F',
        marginTop: 2,
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#2196F3',
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        marginHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#1565C0',
      }}
      text2Style={{
        fontSize: 14,
        color: '#1976D2',
        marginTop: 2,
      }}
    />
  ),
};

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  },
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });
  },
  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  },
};

export const ToastProvider: React.FC = () => {
  return <Toast config={toastConfig} />;
};

export default Toast;