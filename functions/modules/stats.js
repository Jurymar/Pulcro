/**
 * Módulo de Estadísticas - Cloud Functions
 * Maneja el cálculo y actualización de estadísticas del sistema
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Actualizar estadísticas cuando se crea un pedido
 */
exports.updateStatsOnOrderCreate = functions.firestore
  .document("pedidos/{pedidoId}")
  .onCreate(async (snap, context) => {
    try {
      const orderData = snap.data();
      const pedidoId = context.params.pedidoId;
      
      console.log(`📊 Actualizando estadísticas por nuevo pedido: ${pedidoId}`);
      
      // Actualizar estadísticas generales
      await updateGeneralStats('orders_created', 1);
      
      // Actualizar estadísticas por tipo de servicio
      if (orderData.serviceType) {
        await updateServiceStats(orderData.serviceType, 'created');
      }
      
      // Actualizar estadísticas del cliente
      if (orderData.clienteId) {
        await updateClientStats(orderData.clienteId, 'orders_created');
      }
      
      console.log('✅ Estadísticas actualizadas exitosamente');
      
    } catch (error) {
      console.error('❌ Error actualizando estadísticas:', error);
    }
  });

/**
 * Actualizar estadísticas cuando se completa un pedido
 */
exports.updateStatsOnOrderComplete = functions.firestore
  .document("pedidos/{pedidoId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Solo procesar si cambió a completado
    if (newData.status !== 'completed' && newData.estado !== 'completado') {
      return null;
    }
    
    if (previousData.status === 'completed' || previousData.estado === 'completado') {
      return null;
    }
    
    try {
      console.log(`📊 Actualizando estadísticas por pedido completado: ${context.params.pedidoId}`);
      
      // Actualizar estadísticas generales
      await updateGeneralStats('orders_completed', 1);
      
      // Actualizar estadísticas por tipo de servicio
      if (newData.serviceType) {
        await updateServiceStats(newData.serviceType, 'completed');
      }
      
      // Actualizar estadísticas del cliente
      if (newData.clienteId) {
        await updateClientStats(newData.clienteId, 'orders_completed');
      }
      
      // Actualizar estadísticas del lavandero
      if (newData.lavanderoId) {
        await updateLavanderoStats(newData.lavanderoId, 'orders_completed');
      }
      
      console.log('✅ Estadísticas de completado actualizadas');
      
    } catch (error) {
      console.error('❌ Error actualizando estadísticas de completado:', error);
    }
  });

/**
 * Obtener estadísticas generales
 */
exports.getGeneralStats = functions.https.onCall(async (data, context) => {
  try {
    const statsDoc = await admin.firestore()
      .collection('stats')
      .doc('general')
      .get();
    
    if (!statsDoc.exists) {
      return {
        orders_created: 0,
        orders_completed: 0,
        orders_pending: 0,
        total_revenue: 0,
        active_lavanderos: 0,
        active_clientes: 0
      };
    }
    
    return statsDoc.data();
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas generales:', error);
    throw new functions.https.HttpsError('internal', 'Error obteniendo estadísticas');
  }
});

/**
 * Obtener estadísticas de un lavandero
 */
exports.getLavanderoStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { lavanderoId } = data;
  
  try {
    const statsDoc = await admin.firestore()
      .collection('lavandero_stats')
      .doc(lavanderoId)
      .get();
    
    if (!statsDoc.exists) {
      return {
        orders_completed: 0,
        orders_in_progress: 0,
        total_earnings: 0,
        average_rating: 0,
        total_orders: 0
      };
    }
    
    return statsDoc.data();
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas del lavandero:', error);
    throw new functions.https.HttpsError('internal', 'Error obteniendo estadísticas del lavandero');
  }
});

/**
 * Actualizar estadísticas generales
 */
async function updateGeneralStats(field, increment) {
  const statsRef = admin.firestore().collection('stats').doc('general');
  
  await statsRef.set({
    [field]: admin.firestore.FieldValue.increment(increment),
    last_updated: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

/**
 * Actualizar estadísticas por servicio
 */
async function updateServiceStats(serviceType, action) {
  const serviceStatsRef = admin.firestore()
    .collection('service_stats')
    .doc(serviceType);
  
  const field = action === 'created' ? 'orders_created' : 'orders_completed';
  
  await serviceStatsRef.set({
    [field]: admin.firestore.FieldValue.increment(1),
    last_updated: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

/**
 * Actualizar estadísticas del cliente
 */
async function updateClientStats(clienteId, action) {
  const clientStatsRef = admin.firestore()
    .collection('client_stats')
    .doc(clienteId);
  
  const field = action === 'orders_created' ? 'orders_created' : 'orders_completed';
  
  await clientStatsRef.set({
    [field]: admin.firestore.FieldValue.increment(1),
    last_updated: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

/**
 * Actualizar estadísticas del lavandero
 */
async function updateLavanderoStats(lavanderoId, action) {
  const lavanderoStatsRef = admin.firestore()
    .collection('lavandero_stats')
    .doc(lavanderoId);
  
  const field = action === 'orders_completed' ? 'orders_completed' : 'orders_in_progress';
  
  await lavanderoStatsRef.set({
    [field]: admin.firestore.FieldValue.increment(1),
    last_updated: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

/**
 * Calcular estadísticas en tiempo real
 */
exports.calculateRealTimeStats = functions.https.onCall(async (data, context) => {
  try {
    // Contar pedidos por estado
    const pendingOrders = await admin.firestore()
      .collection('pedidos')
      .where('status', '==', 'pending')
      .get();
    
    const inProgressOrders = await admin.firestore()
      .collection('pedidos')
      .where('status', '==', 'in-progress')
      .get();
    
    const completedOrders = await admin.firestore()
      .collection('pedidos')
      .where('status', '==', 'completed')
      .get();
    
    // Contar usuarios activos
    const activeClientes = await admin.firestore()
      .collection('clientes')
      .get();
    
    const activeLavanderos = await admin.firestore()
      .collection('lavanderos')
      .get();
    
    // Calcular ingresos totales
    let totalRevenue = 0;
    completedOrders.forEach(doc => {
      const orderData = doc.data();
      if (orderData.totalPrice) {
        totalRevenue += orderData.totalPrice;
      }
    });
    
    const stats = {
      orders_pending: pendingOrders.size,
      orders_in_progress: inProgressOrders.size,
      orders_completed: completedOrders.size,
      total_revenue: totalRevenue,
      active_clientes: activeClientes.size,
      active_lavanderos: activeLavanderos.size,
      last_calculated: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Guardar estadísticas calculadas
    await admin.firestore()
      .collection('stats')
      .doc('realtime')
      .set(stats);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Error calculando estadísticas en tiempo real:', error);
    throw new functions.https.HttpsError('internal', 'Error calculando estadísticas');
  }
});
