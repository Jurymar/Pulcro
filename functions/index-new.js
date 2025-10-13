/**
 * Cloud Functions para Sistema de Lavandería Pulcro
 * Funciones implementadas:
 * 1. Notificaciones automáticas de cambios de estado
 * 2. Actualización de estadísticas en tiempo real
 * 3. Validación de pedidos
 * 4. Cálculo automático de precios
 * 5. Limpieza automática de datos antiguos
 * 6. Generación de reportes
 * 7. Sistema de calificaciones automático
 **/

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Inicializar Firebase Admin
admin.initializeApp();

// Importar módulos
const notifications = require('./modules/notifications');
const validation = require('./modules/validation');
const stats = require('./modules/stats');

// ============================================================================
// EXPORTAR FUNCIONES DE MÓDULOS
// ============================================================================

// Notificaciones
exports.notifyOrderStatusChange = notifications.notifyOrderStatusChange;
exports.notifyLavanderoAssigned = notifications.notifyLavanderoAssigned;

// Validaciones
exports.validateOrder = validation.validateOrder;
exports.validateUserData = validation.validateUserData;
exports.validateOrderAssignment = validation.validateOrderAssignment;
exports.validateLavanderoProfile = validation.validateLavanderoProfile;

// Estadísticas
exports.updateStatsOnOrderCreate = stats.updateStatsOnOrderCreate;
exports.updateStatsOnOrderComplete = stats.updateStatsOnOrderComplete;
exports.getGeneralStats = stats.getGeneralStats;
exports.getLavanderoStats = stats.getLavanderoStats;
exports.calculateRealTimeStats = stats.calculateRealTimeStats;

// ============================================================================
// FUNCIONES ADICIONALES (MANTENIDAS DEL ARCHIVO ORIGINAL)
// ============================================================================

/**
 * Calcular precio de pedido
 */
exports.calculateOrderPrice = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { serviceType, weight } = data;
  
  if (!serviceType || !weight) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan parámetros requeridos');
  }
  
  // Precios base por tipo de servicio
  const basePrices = {
    'lavado': 5000,
    'seco': 8000,
    'zapatos': 3000,
    'hogar': 4000,
    'express': 10000
  };
  
  const basePrice = basePrices[serviceType] || 5000;
  const totalPrice = basePrice * weight;
  
  return {
    basePrice,
    totalPrice,
    weight,
    serviceType
  };
});

/**
 * Limpiar datos antiguos
 */
exports.cleanupOldData = functions.pubsub.schedule('0 2 * * *').onRun(async (context) => {
  console.log('🧹 Iniciando limpieza de datos antiguos');
  
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Limpiar notificaciones antiguas
    const oldNotifications = await admin.firestore()
      .collection('notifications')
      .where('createdAt', '<', thirtyDaysAgo)
      .where('read', '==', true)
      .get();
    
    const batch = admin.firestore().batch();
    oldNotifications.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`✅ Limpieza completada: ${oldNotifications.size} notificaciones eliminadas`);
    
  } catch (error) {
    console.error('❌ Error en limpieza de datos:', error);
  }
});

/**
 * Generar reporte de ventas
 */
exports.generateSalesReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { startDate, endDate } = data;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const orders = await admin.firestore()
      .collection('pedidos')
      .where('status', '==', 'completed')
      .where('completedAt', '>=', start)
      .where('completedAt', '<=', end)
      .get();
    
    let totalRevenue = 0;
    let orderCount = 0;
    const serviceStats = {};
    
    orders.forEach(doc => {
      const orderData = doc.data();
      totalRevenue += orderData.totalPrice || 0;
      orderCount++;
      
      const service = orderData.serviceType || 'unknown';
      serviceStats[service] = (serviceStats[service] || 0) + 1;
    });
    
    return {
      period: { startDate, endDate },
      totalRevenue,
      orderCount,
      averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
      serviceStats
    };
    
  } catch (error) {
    console.error('❌ Error generando reporte:', error);
    throw new functions.https.HttpsError('internal', 'Error generando reporte');
  }
});

/**
 * Sistema de calificaciones automático
 */
exports.rateOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { orderId, rating, comment } = data;
  
  if (!orderId || !rating || rating < 1 || rating > 5) {
    throw new functions.https.HttpsError('invalid-argument', 'Datos de calificación inválidos');
  }
  
  try {
    // Verificar que el pedido existe y está completado
    const orderDoc = await admin.firestore()
      .collection('pedidos')
      .doc(orderId)
      .get();
    
    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Pedido no encontrado');
    }
    
    const orderData = orderDoc.data();
    
    if (orderData.status !== 'completed' && orderData.estado !== 'completado') {
      throw new functions.https.HttpsError('failed-precondition', 'El pedido debe estar completado para calificar');
    }
    
    if (orderData.clienteId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Solo el cliente puede calificar su pedido');
    }
    
    // Guardar calificación
    await admin.firestore().collection('ratings').add({
      orderId,
      clienteId: context.auth.uid,
      lavanderoId: orderData.lavanderoId,
      rating,
      comment: comment || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Actualizar promedio de calificaciones del lavandero
    if (orderData.lavanderoId) {
      await updateLavanderoRating(orderData.lavanderoId);
    }
    
    return { success: true, message: 'Calificación guardada exitosamente' };
    
  } catch (error) {
    console.error('❌ Error guardando calificación:', error);
    throw error;
  }
});

/**
 * Actualizar calificación promedio del lavandero
 */
async function updateLavanderoRating(lavanderoId) {
  const ratings = await admin.firestore()
    .collection('ratings')
    .where('lavanderoId', '==', lavanderoId)
    .get();
  
  let totalRating = 0;
  let count = 0;
  
  ratings.forEach(doc => {
    totalRating += doc.data().rating;
    count++;
  });
  
  const averageRating = count > 0 ? totalRating / count : 0;
  
  await admin.firestore()
    .collection('lavanderos')
    .doc(lavanderoId)
    .update({
      averageRating: averageRating,
      totalRatings: count,
      lastRatingUpdate: admin.firestore.FieldValue.serverTimestamp()
    });
}

console.log('🚀 Cloud Functions de Pulcro cargadas correctamente!');
