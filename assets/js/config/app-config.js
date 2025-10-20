/**
 * ═══════════════════════════════════════════════════════════════
 * APP CONFIG - Configuración Central de la Aplicación
 * ═══════════════════════════════════════════════════════════════
 * 
 * Archivo de configuración centralizado que contiene:
 * - Credenciales de Firebase
 * - Configuración de Firestore
 * - Constantes de la aplicación
 * - Tipos de usuario y servicios
 * - Reglas de validación
 * - Configuración de UI
 * 
 * ═══════════════════════════════════════════════════════════════
 */
const APP_CONFIG = {
  // ──────────────────────────────────────────────────────────────
  // FIREBASE CONFIGURATION - Credenciales del Proyecto
  // ──────────────────────────────────────────────────────────────
  // IMPORTANTE: En producción, estas credenciales deberían estar
  // protegidas mediante variables de entorno
  firebase: {
    apiKey: "AIzaSyDOd9Ps7yNYRR_Yo6sjWAd-UmXBAnfIyPw",
    authDomain: "pulcro-9357f.firebaseapp.com",
    projectId: "pulcro-9357f",
    storageBucket: "pulcro-9357f.firebasestorage.app",
    messagingSenderId: "999350899261",
    appId: "1:999350899261:web:72d7c4bf3f59fb93409054",
    measurementId: "G-QDPMGYKFHN", // Para Google Analytics
  },

  // ──────────────────────────────────────────────────────────────
  // APP SETTINGS - Información de la Aplicación
  // ──────────────────────────────────────────────────────────────
  app: {
    name: "Pulcro",
    version: "1.0.0",
    description: "Tu Lavandería Digital",
  },

  // ──────────────────────────────────────────────────────────────
  // COLLECTIONS - Nombres de Colecciones en Firestore
  // ──────────────────────────────────────────────────────────────
  // Define los nombres de las colecciones principales de la BD
  collections: {
    clientes: "clientes", // Usuarios que solicitan servicios
    lavanderos: "lavanderos", // Proveedores de servicios de lavandería
  },

  // ──────────────────────────────────────────────────────────────
  // FIRESTORE SETTINGS - Configuración de la Base de Datos
  // ──────────────────────────────────────────────────────────────
  firestore: {
    enablePersistence: true, // Habilita caché offline
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED, // Caché sin límite
  },

  // ──────────────────────────────────────────────────────────────
  // USER TYPES - Tipos de Usuario en el Sistema
  // ──────────────────────────────────────────────────────────────
  userTypes: {
    CLIENTE: "cliente", // Usuario que solicita servicios
    LAVANDERO: "lavandero", // Proveedor de servicios
  },

  // ──────────────────────────────────────────────────────────────
  // SERVICES - Tipos de Servicio Disponibles
  // ──────────────────────────────────────────────────────────────
  services: {
    LAVADO: "lavado", // Lavado regular
    SECO: "seco", // Lavado en seco
    ZAPATOS: "zapatos", // Limpieza de calzado
    HOGAR: "hogar", // Ropa de hogar (cortinas, edredones, etc.)
    EXPRESS: "express", // Servicio express (más rápido)
  },

  // ──────────────────────────────────────────────────────────────
  // VALIDATION - Reglas de Validación
  // ──────────────────────────────────────────────────────────────
  validation: {
    minPasswordLength: 6, // Mínimo de caracteres para contraseña
    maxPasswordLength: 128, // Máximo de caracteres para contraseña
  },

  // ──────────────────────────────────────────────────────────────
  // UI SETTINGS - Configuración de Interfaz de Usuario
  // ──────────────────────────────────────────────────────────────
  ui: {
    notificationDuration: 5000, // Duración de notificaciones en ms
    scrollThreshold: 300, // Scroll para mostrar botón "ir arriba"
    headerScrollThreshold: 100, // Scroll para cambiar estilo del header
  },
};

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPORTAR CONFIGURACIÓN
 * ═══════════════════════════════════════════════════════════════
 * Hace la configuración disponible globalmente en window.APP_CONFIG
 * para que todos los módulos puedan acceder a ella
 */
window.APP_CONFIG = APP_CONFIG;
