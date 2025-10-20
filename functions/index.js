/**
 * ═══════════════════════════════════════════════════════════════════
 * CLOUD FUNCTIONS - Backend Serverless de Pulcro
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Las Cloud Functions son código backend que se ejecuta automáticamente
 * en respuesta a eventos de Firebase (triggers) o llamadas HTTP.
 * 
 * VENTAJAS:
 * ✅ Serverless: No necesitas administrar servidores
 * ✅ Escalable: Firebase escala automáticamente según la demanda
 * ✅ Seguro: Se ejecuta en un entorno controlado
 * ✅ Automático: Responde a eventos en tiempo real
 * 
 * FUNCIONES IMPLEMENTADAS:
 * 
 * 1️⃣ NOTIFICACIONES AUTOMÁTICAS
 *    - notifyOrderStatusChange: Notifica cuando cambia el estado de un pedido
 *    - notifyLavanderoAssigned: Notifica cuando se asigna un lavandero
 * 
 * 2️⃣ VALIDACIONES
 *    - validateOrder: Valida datos de pedidos antes de crear
 *    - validateUserData: Valida datos de usuarios (cliente/lavandero)
 *    - validateOrderAssignment: Valida asignación de pedidos
 *    - validateLavanderoProfile: Valida perfiles de lavanderos
 * 
 * 3️⃣ ESTADÍSTICAS
 *    - updateStatsOnOrderCreate: Actualiza stats al crear pedido
 *    - updateStatsOnOrderComplete: Actualiza stats al completar pedido
 *    - getGeneralStats: Obtiene estadísticas generales del sistema
 *    - getLavanderoStats: Obtiene estadísticas de un lavandero específico
 *    - calculateRealTimeStats: Calcula estadísticas en tiempo real
 * 
 * 4️⃣ UTILIDADES
 *    - calculateOrderPrice: Calcula el precio de un pedido
 *    - cleanupOldData: Limpia datos antiguos (se ejecuta diariamente)
 *    - generateReport: Genera reportes personalizados
 * 
 * DESPLIEGUE:
 * Para desplegar estas funciones: firebase deploy --only functions
 * 
 * ═══════════════════════════════════════════════════════════════════
 **/

// ──────────────────────────────────────────────────────────────────
// IMPORTAR DEPENDENCIAS
// ──────────────────────────────────────────────────────────────────
const functions = require('firebase-functions');  // SDK de Cloud Functions
const admin = require('firebase-admin');          // SDK Admin de Firebase

// ──────────────────────────────────────────────────────────────────
// INICIALIZAR FIREBASE ADMIN
// ──────────────────────────────────────────────────────────────────
// Firebase Admin tiene permisos completos sobre Firestore, Auth, etc.
// Se usa en el backend para operaciones privilegiadas
admin.initializeApp();

// ──────────────────────────────────────────────────────────────────
// IMPORTAR MÓDULOS PERSONALIZADOS
// ──────────────────────────────────────────────────────────────────
// Las funciones están organizadas en módulos para mejor mantenimiento
const notifications = require('./modules/notifications');  // Sistema de notificaciones
const validation = require('./modules/validation');        // Validaciones de datos
const stats = require('./modules/stats');                  // Estadísticas y métricas

// ══════════════════════════════════════════════════════════════════
// EXPORTAR FUNCIONES DE MÓDULOS
// ══════════════════════════════════════════════════════════════════
// Cada función exportada estará disponible como endpoint de Cloud Functions
// Ejemplo: https://us-central1-pulcro-xxx.cloudfunctions.net/validateOrder

// ──────────────────────────────────────────────────────────────────
// MÓDULO: NOTIFICACIONES
// ──────────────────────────────────────────────────────────────────
// Envía notificaciones automáticas cuando ocurren eventos importantes
exports.notifyOrderStatusChange = notifications.notifyOrderStatusChange;
exports.notifyLavanderoAssigned = notifications.notifyLavanderoAssigned;

// ──────────────────────────────────────────────────────────────────
// MÓDULO: VALIDACIONES
// ──────────────────────────────────────────────────────────────────
// Valida datos antes de crear/actualizar documentos en Firestore
exports.validateOrder = validation.validateOrder;
exports.validateUserData = validation.validateUserData;
exports.validateOrderAssignment = validation.validateOrderAssignment;
exports.validateLavanderoProfile = validation.validateLavanderoProfile;

// ──────────────────────────────────────────────────────────────────
// MÓDULO: ESTADÍSTICAS
// ──────────────────────────────────────────────────────────────────
// Actualiza y calcula estadísticas del sistema en tiempo real
exports.updateStatsOnOrderCreate = stats.updateStatsOnOrderCreate;
exports.updateStatsOnOrderComplete = stats.updateStatsOnOrderComplete;
exports.getGeneralStats = stats.getGeneralStats;
exports.getLavanderoStats = stats.getLavanderoStats;
exports.calculateRealTimeStats = stats.calculateRealTimeStats;

// ══════════════════════════════════════════════════════════════════
// FUNCIONES ADICIONALES
// ══════════════════════════════════════════════════════════════════

/**
 * ─────────────────────────────────────────────────────────────────
 * CALCULAR PRECIO DE PEDIDO
 * ─────────────────────────────────────────────────────────────────
 * 
 * Función callable (se puede llamar desde el cliente usando Firebase SDK)
 * Calcula el precio total de un pedido según el tipo de servicio y peso
 * 
 * PARÁMETROS:
 * @param {string} serviceType - Tipo de servicio (lavado, seco, zapatos, hogar, express)
 * @param {number} weight - Peso de la ropa en kg
 * 
 * RETORNA:
 * @returns {Object} { basePrice, totalPrice, weight, serviceType }
 * 
 * SEGURIDAD:
 * - Requiere autenticación (context.auth)
 * - Valida que existan todos los parámetros
 * 
 * USO DESDE CLIENTE:
 * const calculatePrice = firebase.functions().httpsCallable('calculateOrderPrice');
 * const result = await calculatePrice({ serviceType: 'lavado', weight: 5 });
 */
exports.calculateOrderPrice = functions.https.onCall(async (data, context) => {
  // ═══════════════════════════════════════════════════════════════
  // VALIDAR AUTENTICACIÓN
  // ═══════════════════════════════════════════════════════════════
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // VALIDAR PARÁMETROS
  // ═══════════════════════════════════════════════════════════════
  const { serviceType, weight } = data;
  
  if (!serviceType || !weight) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan parámetros requeridos');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // TABLA DE PRECIOS BASE POR SERVICIO
  // ═══════════════════════════════════════════════════════════════
  const basePrices = {
    'lavado': 5000,         // Lavado estándar: $5,000/kg
    'seco': 8000,           // Lavado en seco: $8,000/kg
    'zapatos': 3000,        // Limpieza de zapatos: $3,000/kg
    'hogar': 4000,          // Ropa de hogar: $4,000/kg
    'express': 10000        // Servicio express: $10,000/kg
  };
  
  // ═══════════════════════════════════════════════════════════════
  // CALCULAR PRECIO TOTAL
  // ═══════════════════════════════════════════════════════════════
  const basePrice = basePrices[serviceType] || 5000;  // Default: $5,000/kg
  const totalPrice = basePrice * weight;
  
  return {
    basePrice,    // Precio por kg
    totalPrice,   // Precio total (basePrice * weight)
    weight,       // Peso en kg
    serviceType   // Tipo de servicio
  };
});

/**
 * ─────────────────────────────────────────────────────────────────
 * LIMPIAR DATOS ANTIGUOS (TAREA PROGRAMADA)
 * ─────────────────────────────────────────────────────────────────
 * 
 * Función scheduled (se ejecuta automáticamente en un horario definido)
 * Se ejecuta diariamente a las 2:00 AM (horario del servidor)
 * 
 * PROPÓSITO:
 * - Elimina notificaciones leídas mayores a 30 días
 * - Archiva pedidos completados antiguos
 * - Limpia logs y datos temporales
 * - Mantiene la base de datos optimizada
 * 
 * PROGRAMACIÓN:
 * '0 2 * * *' → Cron expression (minuto hora día mes díasemana)
 * - 0: Minuto 0
 * - 2: Hora 2 AM
 * - *: Todos los días del mes
 * - *: Todos los meses
 * - *: Todos los días de la semana
 * 
 * DESPLIEGUE:
 * Esta función se ejecuta automáticamente después de ser desplegada.
 * No requiere llamadas manuales desde el cliente.
 */
exports.cleanupOldData = functions.pubsub.schedule('0 2 * * *').onRun(async (context) => {
  console.log('🧹 Iniciando limpieza de datos antiguos');
  
  try {
    // ═══════════════════════════════════════════════════════════════
    // DEFINIR FECHA LÍMITE (30 días atrás)
    // ═══════════════════════════════════════════════════════════════
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // ═══════════════════════════════════════════════════════════════
    // LIMPIAR NOTIFICACIONES ANTIGUAS Y LEÍDAS
    // ═══════════════════════════════════════════════════════════════
    // Solo elimina notificaciones que:
    // 1. Tienen más de 30 días
    // 2. Ya fueron leídas por el usuario
    const oldNotifications = await admin.firestore()
      .collection('notifications')
      .where('createdAt', '<', thirtyDaysAgo)
      .where('read', '==', true)
      .get();
    
    // Usar batch para eliminar múltiples documentos de forma eficiente
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
