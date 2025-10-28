export type ColorsShape = {
  // Colores principales
  primary: string;
  primaryDark: string;

  // Fondos
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Card (superficies, tarjetas)
  card: string;

  // Texto
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textPlaceholder: string;

  // Estados
  error: string;
  errorBackground: string;
  errorBorder: string;

  success: string;
  successBackground: string;
  successBorder: string;

  warning: string;
  warningBackground: string;
  warningBorder: string;

  info: string;
  infoBackground: string;
  infoBorder: string;

  // Bordes / overlays
  border: string;
  borderLight: string;
  overlay: string;
  overlayLight: string;

  // Misc
  transparent: string;
};

export type AppTheme = {
  key: string;
  name: string;
  colors: ColorsShape;
};


// Tema default (grises oscuro)

export const defaultTheme: AppTheme = {
  key: 'original',
  name: 'Original',
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056CC',

    background: '#1a1a1a',
    backgroundSecondary: '#2a2a2a',
    backgroundTertiary: '#333333',

    card: '#232323', 

    textPrimary: '#ffffff',
    textSecondary: '#888888',
    textTertiary: '#666666',
    textPlaceholder: '#666666',

    error: '#dc3545',
    errorBackground: 'rgba(220, 53, 69, 0.1)',
    errorBorder: 'rgba(220, 53, 69, 0.3)',

    success: '#28a745',
    successBackground: 'rgba(40, 167, 69, 0.1)',
    successBorder: 'rgba(40, 167, 69, 0.3)',

    warning: '#ffc107',
    warningBackground: 'rgba(255, 193, 7, 0.1)',
    warningBorder: 'rgba(255, 193, 7, 0.3)',

    info: '#17a2b8',
    infoBackground: 'rgba(23, 162, 184, 0.1)',
    infoBorder: 'rgba(23, 162, 184, 0.3)',

    border: '#333333',
    borderLight: '#444444',

    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',

    transparent: 'transparent',
  },
};


// Tema por azulado

export const blueTheme: AppTheme = {
  key: 'blue',
  name: 'Azul',
  colors: {
    primary: '#0EA5FF',
    primaryDark: '#0277BD',

    background: '#071431',
    backgroundSecondary: '#0A2540',
    backgroundTertiary: '#0F3658',

    card: '#0B2A45',

    textPrimary: '#E6F3FF',
    textSecondary: '#A9D6FF',
    textTertiary: '#7FB5E6',
    textPlaceholder: '#7FB5E6',

    error: '#FF6B6B',
    errorBackground: 'rgba(255,107,107,0.1)',
    errorBorder: 'rgba(255,107,107,0.25)',

    success: '#28C76F',
    successBackground: 'rgba(40,199,111,0.08)',
    successBorder: 'rgba(40,199,111,0.22)',

    warning: '#FFB020',
    warningBackground: 'rgba(255,176,32,0.08)',
    warningBorder: 'rgba(255,176,32,0.22)',

    info: '#38BDF8',
    infoBackground: 'rgba(56,189,248,0.08)',
    infoBorder: 'rgba(56,189,248,0.22)',

    border: '#123146',
    borderLight: '#17445C',

    overlay: 'rgba(2,6,23,0.85)',
    overlayLight: 'rgba(2,6,23,0.45)',

    transparent: 'transparent',
  },
};


// Tema claro

export const lightTheme: AppTheme = {
  key: 'light',
  name: 'Claro',
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056CC',

    background: '#FFFFFF',
    backgroundSecondary: '#ebebebff',
    backgroundTertiary: '#EEF6FF',

    card: '#F1F7FF',

    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    textPlaceholder: '#94A3B8',

    error: '#DC2626',
    errorBackground: 'rgba(220,38,38,0.08)',
    errorBorder: 'rgba(220,38,38,0.18)',

    success: '#16A34A',
    successBackground: 'rgba(22,163,74,0.08)',
    successBorder: 'rgba(22,163,74,0.18)',

    warning: '#D97706',
    warningBackground: 'rgba(217,119,6,0.06)',
    warningBorder: 'rgba(217,119,6,0.16)',

    info: '#0EA5FF',
    infoBackground: 'rgba(14,165,255,0.06)',
    infoBorder: 'rgba(14,165,255,0.16)',

    border: '#E6EEF8',
    borderLight: '#F1F8FF',

    overlay: 'rgba(2,6,23,0.6)',
    overlayLight: 'rgba(2,6,23,0.25)',

    transparent: 'transparent',
  },
};

// Tema alto contraste
 
export const highContrastTheme: AppTheme = {
  key: 'high-contrast',
  name: 'Alto Contraste',
  colors: {
    primary: '#FFD400',
    primaryDark: '#FFC000',

    background: '#000000',
    backgroundSecondary: '#0A0A0A',
    backgroundTertiary: '#141414',

    card: '#000000',

    textPrimary: '#FFFFFF',
    textSecondary: '#E6E6E6',
    textTertiary: '#BFBFBF',
    textPlaceholder: '#8C8C8C',

    error: '#FF4D4F',
    errorBackground: 'rgba(255,77,79,0.12)',
    errorBorder: 'rgba(255,77,79,0.24)',

    success: '#00E676',
    successBackground: 'rgba(0,230,118,0.12)',
    successBorder: 'rgba(0,230,118,0.24)',

    warning: '#FFD400',
    warningBackground: 'rgba(255,212,0,0.12)',
    warningBorder: 'rgba(255,212,0,0.28)',

    info: '#00E5FF',
    infoBackground: 'rgba(0,229,255,0.08)',
    infoBorder: 'rgba(0,229,255,0.2)',

    border: '#FFFFFF',
    borderLight: '#E6E6E6',

    overlay: 'rgba(0,0,0,0.9)',
    overlayLight: 'rgba(0,0,0,0.6)',

    transparent: 'transparent',
  },
};

export const themes: Record<string, AppTheme> = {
  [defaultTheme.key]: defaultTheme,
  [blueTheme.key]: blueTheme,
  [lightTheme.key]: lightTheme,
  [highContrastTheme.key]: highContrastTheme,
};

export const Colors = defaultTheme.colors;

export type ColorKey = keyof typeof Colors;
export type ThemeKey = keyof typeof themes;