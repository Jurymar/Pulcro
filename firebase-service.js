/**
 * ═══════════════════════════════════════════════════════════════════
 * FIREBASE SERVICE - Servicio Centralizado de Firebase
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Este es el servicio principal que maneja TODAS las operaciones con Firebase.
 * Centraliza la lógica para evitar duplicación de código en cliente.js y lavandero.js
 * 
 * FUNCIONALIDADES:
 * ✅ Autenticación (login, registro, logout)
 * ✅ Gestión de usuarios (cliente/lavandero)
 * ✅ Operaciones CRUD de pedidos
 * ✅ Listeners en tiempo real (subscribeToClientOrders, subscribeToPendingOrders, etc.)
 * ✅ Transacciones (tomar pedidos sin conflictos)
 * ✅ Persistencia offline
 * 
 * USO:
 * - Se crea una instancia global: window.firebaseService
 * - Se inicializa automáticamente al cargar la página
 * - Todos los archivos pueden acceder mediante: window.firebaseService.metodo()
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

class FirebaseService {
  // ──────────────────────────────────────────────────────────────────
  // CONSTRUCTOR - Inicializa propiedades vacías
  // ──────────────────────────────────────────────────────────────────
  constructor() {
    this.db = null;                  // Referencia a Firestore
    this.auth = null;                // Referencia a Authentication
    this.currentUser = null;         // Usuario actualmente autenticado
    this.initialized = false;        // Bandera de inicialización
  }

  // ──────────────────────────────────────────────────────────────────
  // INICIALIZACIÓN - Configura Firebase, Auth y Firestore
  // ──────────────────────────────────────────────────────────────────
  /**
   * Inicializa Firebase con todas sus configuraciones
   * IMPORTANTE: Se ejecuta automáticamente al cargar la página (ver final del archivo)
   * 
   * Pasos:
   * 1. Verifica que Firebase SDK esté cargado
   * 2. Verifica que APP_CONFIG exista (credenciales)
   * 3. Inicializa la app de Firebase
   * 4. Crea instancias de Firestore y Authentication
   * 5. Habilita persistencia offline (guarda datos localmente)
   */
  async initialize() {
    // Si ya está inicializado, no hacer nada
    if (this.initialized) {
      console.log('✅ Firebase Service ya está inicializado');
      return;
    }

    try {
      console.log('🚀 Inicializando Firebase Service...');
      
      // ─────────────────────────────────────────────────────────────
      // VERIFICACIONES PREVIAS
      // ─────────────────────────────────────────────────────────────
      // Verificar que el SDK de Firebase esté cargado desde el HTML
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase no está cargado');
      }

      // Verificar que exista la configuración (credenciales del proyecto)
      if (typeof APP_CONFIG === 'undefined') {
        throw new Error('APP_CONFIG no está cargado');
      }

      console.log('📋 Configuración de Firebase:', APP_CONFIG.firebase);

      // ─────────────────────────────────────────────────────────────
      // INICIALIZAR FIREBASE APP
      // ─────────────────────────────────────────────────────────────
      // Solo inicializar si no existe una app (evita duplicados)
      if (!firebase.apps.length) {
        firebase.initializeApp(APP_CONFIG.firebase);
        console.log('🔥 Firebase app inicializada');
      } else {
        console.log('🔥 Firebase app ya existe');
      }

      // ─────────────────────────────────────────────────────────────
      // CREAR SERVICIOS
      // ─────────────────────────────────────────────────────────────
      // Firestore: Base de datos en tiempo real
      this.db = firebase.firestore();
      
      // Authentication: Sistema de usuarios
      this.auth = firebase.auth();
      console.log('📊 Firestore y Auth inicializados');

      // ─────────────────────────────────────────────────────────────
      // HABILITAR PERSISTENCIA OFFLINE
      // ─────────────────────────────────────────────────────────────
      // Permite que la app funcione sin internet guardando datos localmente
      if (APP_CONFIG.firestore.enablePersistence) {
        try {
          await this.db.enablePersistence({
            cacheSizeBytes: APP_CONFIG.firestore.cacheSizeBytes
          });
          console.log('💾 Persistencia habilitada');
        } catch (err) {
          console.warn('⚠️ No se pudo habilitar la persistencia:', err);
        }
      }

      this.initialized = true;
      console.log('✅ Firebase Service inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Firebase Service:', error);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN: AUTENTICACIÓN
  // ══════════════════════════════════════════════════════════════════
  
  /**
   * Obtiene el usuario actualmente autenticado
   * @returns {Object|null} Usuario de Firebase o null si no hay sesión
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * Escucha cambios en el estado de autenticación
   * Se ejecuta cada vez que el usuario inicia/cierra sesión
   * 
   * @param {Function} callback - Función que recibe el usuario (o null si cerró sesión)
   * @returns {Function} Función para cancelar la suscripción
   * 
   * Ejemplo:
   * onAuthStateChanged((user) => {
   *   if (user) console.log('Usuario logueado:', user.email);
   *   else console.log('Usuario no logueado');
   * });
   */
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  /**
   * Inicia sesión con email y contraseña
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Resultado con información del usuario
   * @throws {Error} Si las credenciales son incorrectas
   */
  async signIn(email, password) {
    try {
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      this.currentUser = result.user;
      return result;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario con email y contraseña
   * 
   * @param {string} email - Email del nuevo usuario
   * @param {string} password - Contraseña del nuevo usuario
   * @returns {Object} Resultado con información del usuario creado
   * @throws {Error} Si el email ya está registrado o la contraseña es débil
   */
  async signUp(email, password) {
    try {
      const result = await this.auth.createUserWithEmailAndPassword(email, password);
      this.currentUser = result.user;
      return result;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   * Limpia currentUser y cierra la sesión en Firebase
   */
  async signOut() {
    try {
      await this.auth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN: GESTIÓN DE USUARIOS (Clientes y Lavanderos)
  // ══════════════════════════════════════════════════════════════════

  /**
   * Obtiene los datos completos de un usuario desde Firestore
   * 
   * @param {string} userId - ID del usuario (UID de Firebase Auth)
   * @param {string} userType - Tipo de usuario: 'cliente' o 'lavandero'
   * @returns {Object|null} Datos del usuario o null si no existe
   * 
   * Busca en la colección correspondiente:
   * - 'clientes' si userType === 'cliente'
   * - 'lavanderos' si userType === 'lavandero'
   */
  async getUserData(userId, userType) {
    try {
      // Determinar la colección según el tipo de usuario
      const collection = userType === 'cliente' ? 'clientes' : 'lavanderos';
      const doc = await this.db.collection(collection).doc(userId).get();
      
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      throw error;
    }
  }

  /**
   * Guarda o actualiza los datos de un usuario en Firestore
   * 
   * @param {string} userId - ID del usuario (UID de Firebase Auth)
   * @param {Object} userData - Datos a guardar (nombre, teléfono, dirección, etc.)
   * @param {string} userType - Tipo de usuario: 'cliente' o 'lavandero'
   * 
   * Usa { merge: true } para actualizar solo los campos enviados
   * sin borrar los existentes
   */
  async saveUserData(userId, userData, userType) {
    try {
      // Determinar la colección según el tipo de usuario
      const collection = userType === 'cliente' ? 'clientes' : 'lavanderos';
      await this.db.collection(collection).doc(userId).set(userData, { merge: true });
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN: OPERACIONES CRUD DE PEDIDOS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Crea un nuevo pedido en la colección 'pedidos'
   * 
   * @param {Object} orderData - Datos del pedido (clienteId, serviceType, weight, etc.)
   * @returns {string} ID del pedido creado
   * 
   * Agrega automáticamente:
   * - createdAt: Timestamp del servidor (hora exacta de creación)
   * - updatedAt: Timestamp del servidor (última actualización)
   */
  async createOrder(orderData) {
    try {
      const docRef = await this.db.collection('pedidos').add({
        ...orderData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  /**
   * Actualiza un pedido existente
   * 
   * @param {string} orderId - ID del pedido a actualizar
   * @param {Object} updateData - Campos a actualizar (status, lavanderoId, etc.)
   * 
   * Actualiza automáticamente el campo updatedAt con la hora actual del servidor
   */
  async updateOrder(orderId, updateData) {
    try {
      await this.db.collection('pedidos').doc(orderId).update({
        ...updateData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      throw error;
    }
  }

  /**
   * Elimina un pedido de la base de datos
   * 
   * @param {string} orderId - ID del pedido a eliminar
   * 
   * ⚠️ IMPORTANTE: Esta eliminación dispara actualizaciones en tiempo real
   * Todos los listeners (subscribeToClientOrders, subscribeToPendingOrders, etc.)
   * detectarán automáticamente la eliminación y actualizarán la UI
   */
  async deleteOrder(orderId) {
    try {
      await this.db.collection('pedidos').doc(orderId).delete();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los pedidos de un cliente (consulta única)
   * 
   * @param {string} clientId - ID del cliente (UID de Firebase Auth)
   * @returns {Array} Lista de pedidos ordenados por fecha (más reciente primero)
   * 
   * Esta es una consulta ÚNICA (no en tiempo real)
   * Para actualizaciones automáticas, usa subscribeToClientOrders()
   */
  async getClientOrders(clientId) {
    try {
      const snapshot = await this.db
        .collection('pedidos')
        .where('clienteId', '==', clientId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener pedidos del cliente:', error);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN: LISTENERS EN TIEMPO REAL ⚡ (LA MAGIA SUCEDE AQUÍ)
  // ══════════════════════════════════════════════════════════════════
  // Estas funciones son FUNDAMENTALES para las actualizaciones automáticas
  // Usan onSnapshot() que escucha cambios en Firestore en TIEMPO REAL
  // ══════════════════════════════════════════════════════════════════

  /**
   * 🔥 LISTENER EN TIEMPO REAL - Pedidos del Cliente
   * 
   * @param {string} clientId - ID del cliente
   * @param {Function} callback - Función que se ejecuta cada vez que hay cambios
   * @returns {Function} Función para cancelar la suscripción (unsubscribe)
   * 
   * ¿QUÉ HACE?
   * - Escucha CONTINUAMENTE la colección 'pedidos' donde clienteId coincide
   * - Cada vez que hay un cambio (crear, actualizar, eliminar), ejecuta callback
   * - callback recibe un snapshot con TODO el snapshot actualizado
   * 
   * EVENTOS QUE DETECTA:
   * - 'added': Se crea un nuevo pedido
   * - 'modified': Se actualiza un pedido existente (cambio de status, etc.)
   * - 'removed': Se elimina un pedido ⚠️ CLAVE para eliminación en tiempo real
   * 
   * USO EN cliente.js:
   * subscribeToClientOrders(userId, (snapshot) => {
   *   snapshot.docChanges().forEach((change) => {
   *     if (change.type === 'removed') {
   *       // Remover pedido de la UI automáticamente
   *     }
   *   });
   * });
   */
  subscribeToClientOrders(clientId, callback) {
    return this.db
      .collection('pedidos')
      .where('clienteId', '==', clientId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
  }

  /**
   * 🔥 LISTENER EN TIEMPO REAL - Pedidos Pendientes (para lavanderos)
   * 
   * @param {Function} callback - Función que se ejecuta cada vez que hay cambios
   * @returns {Function} Función para cancelar la suscripción
   * 
   * ¿QUÉ HACE?
   * - Escucha CONTINUAMENTE todos los pedidos con status === 'pending'
   * - Muestra pedidos disponibles que los lavanderos pueden tomar
   * 
   * EVENTOS QUE DETECTA:
   * - 'added': Nuevo pedido disponible (un cliente creó un pedido)
   * - 'modified': Pedido actualizado (podría cambiar de pending a otro status)
   * - 'removed': Pedido eliminado o tomado por otro lavandero
   * 
   * USO EN lavandero.js:
   * subscribeToPendingOrders((snapshot) => {
   *   // Actualiza la lista de pedidos disponibles automáticamente
   * });
   */
  subscribeToPendingOrders(callback) {
    console.log('🔍 FirebaseService: Suscribiéndose a pedidos pendientes');
    if (!this.db) {
      console.error('❌ FirebaseService: db no está inicializado');
      return null;
    }
    return this.db
      .collection('pedidos')
      .where('status', '==', 'pending')
      .onSnapshot(callback, (error) => {
        console.error('❌ FirebaseService: Error en suscripción a pedidos pendientes:', error);
      });
  }

  /**
   * 🔥 LISTENER EN TIEMPO REAL - Pedidos del Lavandero
   * 
   * @param {string} lavanderoId - ID del lavandero
   * @param {Function} callback - Función que se ejecuta cada vez que hay cambios
   * @returns {Function} Función para cancelar la suscripción
   * 
   * ¿QUÉ HACE?
   * - Escucha CONTINUAMENTE todos los pedidos asignados a un lavandero específico
   * - Muestra pedidos en progreso y completados del lavandero
   * 
   * EVENTOS QUE DETECTA:
   * - 'added': Pedido recién tomado por este lavandero
   * - 'modified': Pedido actualizado (cambio de status: in-progress → completed)
   * - 'removed': Pedido eliminado por el cliente ⚠️ CLAVE para sincronización
   * 
   * USO EN lavandero.js:
   * subscribeToLavanderoOrders(userId, (snapshot) => {
   *   snapshot.docChanges().forEach((change) => {
   *     if (change.type === 'removed') {
   *       // Remover pedido de la UI del lavandero automáticamente
   *     }
   *   });
   * });
   */
  subscribeToLavanderoOrders(lavanderoId, callback) {
    console.log('🔍 FirebaseService: Suscribiéndose a pedidos del lavandero:', lavanderoId);
    if (!this.db) {
      console.error('❌ FirebaseService: db no está inicializado');
      return null;
    }
    return this.db
      .collection('pedidos')
      .where('lavanderoId', '==', lavanderoId)
      .onSnapshot(callback, (error) => {
        console.error('❌ FirebaseService: Error en suscripción a pedidos del lavandero:', error);
      });
  }

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN: TRANSACCIONES Y OPERACIONES AVANZADAS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Toma un pedido de forma segura usando transacciones de Firestore
   * 
   * @param {string} orderId - ID del pedido a tomar
   * @param {string} lavanderoId - ID del lavandero que toma el pedido
   * @returns {Object} { success: true, orderData }
   * 
   * ¿POR QUÉ USAR TRANSACCIONES?
   * Evita condiciones de carrera (race conditions):
   * - Si 2 lavanderos intentan tomar el mismo pedido al mismo tiempo
   * - La transacción garantiza que solo UNO lo tome exitosamente
   * - El otro recibirá un error "El pedido no está disponible"
   * 
   * PROCESO:
   * 1. Lee el pedido actual
   * 2. Verifica que esté disponible (status: pending, sin lavandero)
   * 3. Si está disponible, actualiza: lavanderoId, status: in-progress
   * 4. Si otro lavandero ya lo tomó, lanza error
   */
  async takeOrder(orderId, lavanderoId) {
    try {
      return await this.db.runTransaction(async (transaction) => {
        const orderRef = this.db.collection('pedidos').doc(orderId);
        const orderDoc = await transaction.get(orderRef);
        
        // Verificar que el pedido exista
        if (!orderDoc.exists) {
          throw new Error('El pedido no existe');
        }
        
        const orderData = orderDoc.data();
        
        // Verificar que el pedido esté disponible (sin lavandero asignado)
        if (orderData.status !== 'pending' || orderData.lavanderoId) {
          throw new Error('El pedido no está disponible');
        }
        
        // Actualizar el pedido de forma atómica
        transaction.update(orderRef, {
          lavanderoId: lavanderoId,
          status: 'in-progress',
          startedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, orderData };
      });
    } catch (error) {
      console.error('Error al tomar pedido:', error);
      throw error;
    }
  }

  /**
   * Marca un pedido como completado
   * 
   * @param {string} orderId - ID del pedido a completar
   * 
   * Actualiza:
   * - status: 'completed'
   * - completedAt: Timestamp de finalización
   * - updatedAt: Timestamp de última actualización
   */
  async completeOrder(orderId) {
    try {
      await this.db.collection('pedidos').doc(orderId).update({
        status: 'completed',
        completedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error al completar pedido:', error);
      throw error;
    }
  }

  /**
   * Obtiene un pedido específico por su ID
   * 
   * @param {string} orderId - ID del pedido
   * @returns {Object|null} Datos del pedido o null si no existe
   */
  async getOrder(orderId) {
    try {
      const doc = await this.db.collection('pedidos').doc(orderId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // SECCIÓN: CLOUD FUNCTIONS Y UTILIDADES
  // ══════════════════════════════════════════════════════════════════

  /**
   * Llama a una Cloud Function de Firebase
   * 
   * @param {string} functionName - Nombre de la función a llamar
   * @param {Object} data - Datos a enviar a la función
   * @returns {any} Resultado devuelto por la función
   * 
   * Las Cloud Functions están en /functions/index.js
   * Ejemplos: 'sendNotification', 'updateStats', etc.
   */
  async callCloudFunction(functionName, data = {}) {
    try {
      const callable = firebase.functions().httpsCallable(functionName);
      const result = await callable(data);
      return result.data;
    } catch (error) {
      console.error(`Error al llamar función ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Muestra una notificación temporal en pantalla
   * 
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación: 'info', 'success', 'error', 'warning'
   * 
   * Crea un elemento <div> con clase 'notification' y tipo específico
   * Se elimina automáticamente después de la duración configurada
   */
  showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de la duración configurada (default: 5 segundos)
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, APP_CONFIG.ui.notificationDuration);
  }
}

// ══════════════════════════════════════════════════════════════════
// INICIALIZACIÓN AUTOMÁTICA
// ══════════════════════════════════════════════════════════════════

// Crear una instancia global del servicio
// Accesible desde cualquier archivo mediante: window.firebaseService
window.firebaseService = new FirebaseService();

// Inicializar Firebase automáticamente cuando el DOM esté listo
// Esto ocurre antes de que cliente.js o lavandero.js se ejecuten
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.firebaseService.initialize();
  } catch (error) {
    console.error('Error al inicializar Firebase Service:', error);
  }
});
