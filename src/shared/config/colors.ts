// Variables globales de colore
export const Colors = {
  // Colores principales
  primary: '#007AFF',
  primaryDark: '#0056CC',
  
  // Colores de fondo
  background: '#1a1a1a',
  backgroundSecondary: '#2a2a2a',
  backgroundTertiary: '#333333',
  
  // Colores de texto
  textPrimary: '#ffffff',
  textSecondary: '#888888',
  textTertiary: '#666666',
  textPlaceholder: '#666666',
  
  // Colores de error
  error: '#dc3545',
  errorBackground: 'rgba(220, 53, 69, 0.1)',
  errorBorder: 'rgba(220, 53, 69, 0.3)',
  
  // Colores de éxito
  success: '#28a745',
  successBackground: 'rgba(40, 167, 69, 0.1)',
  successBorder: 'rgba(40, 167, 69, 0.3)',
  
  // Colores de advertencia
  warning: '#ffc107',
  warningBackground: 'rgba(255, 193, 7, 0.1)',
  warningBorder: 'rgba(255, 193, 7, 0.3)',
  
  // Colores de información
  info: '#17a2b8',
  infoBackground: 'rgba(23, 162, 184, 0.1)',
  infoBorder: 'rgba(23, 162, 184, 0.3)',
  
  // Colores de bordes
  border: '#333333',
  borderLight: '#444444',
  
  // Colores de overlay
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  
  // Colores transparentes
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;