# Gestly - Aplicación de Gestión de Ventas

## Descripción General

Gestly es una aplicación móvil desarrollada con Expo que permite a los usuarios gestionar sus ventas, productos e inventario de manera eficiente. Diseñada para pequeños y medianos negocios, Gestly ofrece una solución completa para el control de ventas con una interfaz intuitiva y fácil de usar.

## Características Principales

La aplicación cuenta con 5 secciones principales:

### 🏠 Home
Centro de control donde el usuario puede ver un resumen de su actividad, estadísticas rápidas y accesos directos a las funciones más utilizadas.

### 📦 Productos
Gestión completa del catálogo de productos:
- Agregar, editar y eliminar productos
- Control de inventario
- Categorización de productos
- Precios y descuentos

### 💰 Ventas
Registro y gestión de transacciones:
- Crear nuevas ventas
- Historial de ventas
- Estado de pedidos
- Facturación

### 📊 Reportes
Análisis detallado del negocio:
- Ventas por período
- Productos más vendidos
- Tendencias de ventas
- Exportación de informes

### 👤 Perfil
Configuración de la cuenta y preferencias:
- Información personal
- Configuración de la tienda
- Gestión de suscripción
- Preferencias de la aplicación

## Sistema de Autenticación y Suscripción

Gestly funciona bajo un modelo de suscripción mensual:
- Los usuarios deben registrarse para crear una cuenta
- Se requiere una suscripción activa para acceder a todas las funcionalidades
- Diferentes planes disponibles según las necesidades del negocio

## Estructura del Proyecto

```
src/ 
 ├── api/              # Servicios de API y comunicación con el backend
 │ 
 ├── screens/          # Pantallas principales de la aplicación
 │   ├── Home/         # Pantalla de inicio
 │   │   ├── hooks/    # Hooks personalizados para la pantalla Home
 │   │   ├── services/ # Servicios específicos para Home
 │   │   └── components/ # Componentes exclusivos de Home
 │   │ 
 │   ├── Products/     # Gestión de productos
 │   │   ├── hooks/
 │   │   ├── services/
 │   │   └── components/
 │   │ 
 │   ├── Sales/        # Registro y gestión de ventas
 │   │   ├── hooks/
 │   │   ├── services/
 │   │   └── components/
 │   │ 
 │   ├── Reports/      # Reportes y análisis
 │   │   ├── hooks/
 │   │   ├── services/
 │   │   └── components/
 │   │ 
 │   └── Settings/     # Configuración y perfil de usuario
 │       ├── hooks/
 │       ├── services/
 │       └── components/
 │ 
 └── shared/           # Recursos compartidos entre pantallas
     ├── components/   # Componentes reutilizables
     ├── hooks/        # Hooks comunes
     ├── services/     # Servicios generales
     └── config/       # Configuraciones globales
```

## Flujo de Trabajo con Git

El proyecto utiliza un flujo de trabajo basado en ramas:

- **main**: Rama de producción, contiene código estable y listo para producción
- **develop**: Rama principal de desarrollo, integra las nuevas características
- **features/**: Ramas para desarrollo de nuevas funcionalidades
- **bugfix/**: Ramas para corrección de errores
- **refactor/**: Ramas para refactorización de código existente
- **test/**: Ramas para pruebas de nuevas implementaciones

## Tecnologías Utilizadas

- React Native
- Expo
- TypeScript
- [Otras tecnologías específicas del proyecto]

## Requisitos de Instalación

[Instrucciones para instalar y ejecutar el proyecto localmente]

## Equipo de Desarrollo

[Información sobre el equipo de desarrollo]
