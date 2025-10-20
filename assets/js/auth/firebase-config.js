/**
 * ═══════════════════════════════════════════════════════════════════
 * FIREBASE CONFIG - Configuración e Inicialización de Firebase
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Este archivo se encarga de:
 * 1. Inicializar Firebase con las credenciales del proyecto
 * 2. Crear instancias de Authentication y Firestore
 * 3. Exportar servicios para uso global en la aplicación
 * 
 * IMPORTANTE: Este archivo debe cargarse DESPUÉS de:
 * - Firebase SDK (scripts en HTML)
 * - app-config.js (configuración de credenciales)
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────────────────────────
// 1. OBTENER CONFIGURACIÓN
// ──────────────────────────────────────────────────────────────────
// Obtiene las credenciales de Firebase desde app-config.js
// (apiKey, authDomain, projectId, etc.)
const firebaseConfig = window.APP_CONFIG.firebase;

// ──────────────────────────────────────────────────────────────────
// 2. INICIALIZAR FIREBASE
// ──────────────────────────────────────────────────────────────────
// Inicializa la aplicación de Firebase con las credenciales
firebase.initializeApp(firebaseConfig);

// ──────────────────────────────────────────────────────────────────
// 3. CREAR SERVICIOS DE FIREBASE
// ──────────────────────────────────────────────────────────────────
// Authentication: Maneja registro, login y sesiones de usuarios
const auth = firebase.auth();

// Firestore: Base de datos en tiempo real para pedidos, usuarios, etc.
const db = firebase.firestore();

// ──────────────────────────────────────────────────────────────────
// 4. NOTA SOBRE PERSISTENCIA
// ──────────────────────────────────────────────────────────────────
// La persistencia offline se maneja en firebase-service.js para evitar
// el error "Firestore has already been started". No habilitar aquí.

// ──────────────────────────────────────────────────────────────────
// 5. EXPORTAR PARA USO GLOBAL
// ──────────────────────────────────────────────────────────────────
// Hace que auth y db estén disponibles globalmente en window
// Esto permite que otros archivos accedan a estos servicios
window.firebaseAuth = auth;
window.firebaseDB = db;
