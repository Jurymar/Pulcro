/**
 * Firebase Service - Servicio centralizado para operaciones de Firebase
 * Centraliza la lógica común de Firebase para evitar duplicación de código
 */

class FirebaseService {
  constructor() {
    this.db = null;
    this.auth = null;
    this.currentUser = null;
    this.initialized = false;
  }

  /**
   * Inicializar Firebase
   */
  async initialize() {
    if (this.initialized) {
      console.log('✅ Firebase Service ya está inicializado');
      return;
    }

    try {
      console.log('🚀 Inicializando Firebase Service...');
      
      // Verificar que Firebase esté disponible
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase no está cargado');
      }

      // Verificar que APP_CONFIG esté disponible
      if (typeof APP_CONFIG === 'undefined') {
        throw new Error('APP_CONFIG no está cargado');
      }

      console.log('📋 Configuración de Firebase:', APP_CONFIG.firebase);

      // Inicializar Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(APP_CONFIG.firebase);
        console.log('🔥 Firebase app inicializada');
      } else {
        console.log('🔥 Firebase app ya existe');
      }

      this.db = firebase.firestore();
      this.auth = firebase.auth();
      console.log('📊 Firestore y Auth inicializados');

      // Configurar persistencia
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

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * Escuchar cambios en autenticación
   */
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  /**
   * Iniciar sesión
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
   * Registrar usuario
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
   * Cerrar sesión
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

  /**
   * Obtener datos de usuario por tipo
   */
  async getUserData(userId, userType) {
    try {
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
   * Guardar datos de usuario
   */
  async saveUserData(userId, userData, userType) {
    try {
      const collection = userType === 'cliente' ? 'clientes' : 'lavanderos';
      await this.db.collection(collection).doc(userId).set(userData, { merge: true });
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
      throw error;
    }
  }

  /**
   * Crear pedido
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
   * Actualizar pedido
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
   * Eliminar pedido
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
   * Obtener pedidos del cliente
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

  /**
   * Suscribirse a pedidos del cliente (tiempo real)
   */
  subscribeToClientOrders(clientId, callback) {
    return this.db
      .collection('pedidos')
      .where('clienteId', '==', clientId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
  }

  /**
   * Suscribirse a pedidos pendientes (para lavanderos)
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
   * Suscribirse a pedidos del lavandero
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

  /**
   * Tomar pedido (transacción)
   */
  async takeOrder(orderId, lavanderoId) {
    try {
      return await this.db.runTransaction(async (transaction) => {
        const orderRef = this.db.collection('pedidos').doc(orderId);
        const orderDoc = await transaction.get(orderRef);
        
        if (!orderDoc.exists) {
          throw new Error('El pedido no existe');
        }
        
        const orderData = orderDoc.data();
        
        // Verificar que el pedido esté disponible
        if (orderData.status !== 'pending' || orderData.lavanderoId) {
          throw new Error('El pedido no está disponible');
        }
        
        // Actualizar el pedido
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
   * Completar pedido
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
   * Obtener un pedido específico
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

  /**
   * Llamar función de Cloud Functions
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
   * Mostrar notificación
   */
  showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, APP_CONFIG.ui.notificationDuration);
  }
}

// Crear instancia global
window.firebaseService = new FirebaseService();

// Inicializar automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.firebaseService.initialize();
  } catch (error) {
    console.error('Error al inicializar Firebase Service:', error);
  }
});
