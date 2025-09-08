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
const nodemailer = require('nodemailer');

// Inicializar Firebase Admin
admin.initializeApp();

// Configurar nodemailer para envío de emails (opcional)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: (functions.config().email && functions.config().email.user) || "",
    pass: (functions.config().email && functions.config().email.pass) || "",
  },
});

// ============================================================================
// 1. NOTIFICACIONES AUTOMÁTICAS
// ============================================================================

/**
 * Notificar al cliente cuando cambia el estado de su pedido
 */
exports.notifyOrderStatusChange = functions.firestore
  .document("pedidos/{pedidoId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    const pedidoId = context.params.pedidoId;
    
    // Solo procesar si cambió el estado
    if (newData.estado === previousData.estado) {
      return null;
    }
    
    try {
      console.log(`🔄 Estado del pedido ${pedidoId} cambió de "${previousData.estado}" a "${newData.estado}"`);
      
      // Obtener datos del cliente
      const clienteDoc = await admin.firestore()
        .collection('clientes')
        .doc(newData.clienteId)
        .get();
      
      if (!clienteDoc.exists) {
        console.log('❌ Cliente no encontrado');
        return null;
      }
      
      const clienteData = clienteDoc.data();
      
      // Crear notificación para el cliente
      await admin.firestore()
        .collection('notificaciones')
        .add({
          userId: newData.clienteId,
          tipo: 'estado_pedido',
          titulo: getStatusChangeTitle(newData.estado),
          mensaje: getStatusChangeMessage(newData.estado, newData),
          pedidoId: pedidoId,
          leida: false,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          data: {
            estadoAnterior: previousData.estado,
            estadoNuevo: newData.estado,
            lavanderoId: newData.lavanderoId
          }
        });
      
      // Enviar email de notificación (opcional)
      if (clienteData.email && newData.estado === 'completado') {
        await sendOrderCompletedEmail(clienteData.email, newData);
      }
      
      console.log(`✅ Notificación enviada al cliente ${newData.clienteId}`);
      return null;
      
    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
      return null;
    }
  });

/**
 * Notificar al lavandero cuando se le asigna un nuevo pedido
 */
exports.notifyLavanderoNewOrder = functions.firestore
  .document('pedidos/{pedidoId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Solo procesar si se asignó un lavandero
    if (!previousData.lavanderoId && newData.lavanderoId) {
      try {
        console.log(`🆕 Pedido ${context.params.pedidoId} asignado al lavandero ${newData.lavanderoId}`);
        
        // Obtener datos del lavandero
        const lavanderoDoc = await admin.firestore()
          .collection('lavanderos')
          .doc(newData.lavanderoId)
          .get();
        
        if (!lavanderoDoc.exists) {
          return null;
        }
        
        const lavanderoData = lavanderoDoc.data();
        
        // Crear notificación para el lavandero
        await admin.firestore()
          .collection('notificaciones')
          .add({
            userId: newData.lavanderoId,
            tipo: 'nuevo_pedido',
            titulo: '🆕 Nuevo Pedido Asignado',
            mensaje: `Tienes un nuevo pedido de ${newData.clienteName} por $${newData.totalPrice.toLocaleString('es-CO')}`,
            pedidoId: context.params.pedidoId,
            leida: false,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            data: {
              clienteName: newData.clienteName,
              totalPrice: newData.totalPrice,
              serviceType: newData.serviceType
            }
          });
        
        console.log(`✅ Notificación enviada al lavandero ${newData.lavanderoId}`);
        return null;
        
      } catch (error) {
        console.error('❌ Error notificando al lavandero:', error);
        return null;
      }
    }
    
    return null;
  });

// ============================================================================
// 2. ESTADÍSTICAS EN TIEMPO REAL
// ============================================================================

/**
 * Actualizar estadísticas del lavandero automáticamente
 */
exports.updateLavanderoStats = functions.firestore
  .document('pedidos/{pedidoId}')
  .onWrite(async (change, context) => {
    const pedidoData = change.after.data();
    
    // Solo procesar si el pedido tiene lavandero asignado
    if (!pedidoData || !pedidoData.lavanderoId) {
      return null;
    }
    
    try {
      console.log(`📊 Actualizando estadísticas del lavandero ${pedidoData.lavanderoId}`);
      
      // Calcular estadísticas del lavandero
      const statsSnapshot = await admin.firestore()
        .collection('pedidos')
        .where('lavanderoId', '==', pedidoData.lavanderoId)
        .get();
      
      let totalEarnings = 0;
      let completedOrders = 0;
      let pendingOrders = 0;
      let inProgressOrders = 0;
      let totalOrders = 0;
      
      statsSnapshot.forEach(doc => {
        const order = doc.data();
        totalOrders++;
        
        if (order.estado === 'completado') {
          totalEarnings += order.totalPrice || 0;
          completedOrders++;
        } else if (order.estado === 'pendiente') {
          pendingOrders++;
        } else if (order.estado === 'en progreso') {
          inProgressOrders++;
        }
      });
      
      // Calcular promedio de pedidos por día (últimos 30 días)
      const thirtyDaysAgo = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      const recentOrdersSnapshot = await admin.firestore()
        .collection('pedidos')
        .where('lavanderoId', '==', pedidoData.lavanderoId)
        .where('fecha', '>=', thirtyDaysAgo)
        .get();
      
      const ordersPerDay = recentOrdersSnapshot.size / 30;
      
      // Actualizar estadísticas del lavandero
      await admin.firestore()
        .collection('lavanderos')
        .doc(pedidoData.lavanderoId)
        .update({
          stats: {
            totalEarnings: Math.round(totalEarnings),
            completedOrders,
            pendingOrders,
            inProgressOrders,
            totalOrders,
            ordersPerDay: Math.round(ordersPerDay * 100) / 100,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          }
        });
      
      console.log(`✅ Estadísticas actualizadas para lavandero ${pedidoData.lavanderoId}`);
      return null;
      
    } catch (error) {
      console.error('❌ Error actualizando estadísticas:', error);
      return null;
    }
  });

/**
 * Actualizar estadísticas del sistema
 */
exports.updateSystemStats = functions.firestore
  .document('pedidos/{pedidoId}')
  .onWrite(async (change, context) => {
    try {
      console.log('📊 Actualizando estadísticas del sistema...');
      
      const [pedidosSnapshot, clientesSnapshot, lavanderosSnapshot] = await Promise.all([
        admin.firestore().collection('pedidos').get(),
        admin.firestore().collection('clientes').get(),
        admin.firestore().collection('lavanderos').get()
      ]);
      
      let totalPedidos = 0;
      let pedidosPendientes = 0;
      let pedidosCompletados = 0;
      let ingresosTotales = 0;
      
      pedidosSnapshot.forEach(doc => {
        const pedido = doc.data();
        totalPedidos++;
        
        if (pedido.estado === 'pendiente') {
          pedidosPendientes++;
        } else if (pedido.estado === 'completado') {
          pedidosCompletados++;
          ingresosTotales += pedido.totalPrice || 0;
        }
      });
      
      // Calcular estadísticas por servicio
      const serviceStats = {};
      pedidosSnapshot.forEach(doc => {
        const pedido = doc.data();
        const service = pedido.serviceType || 'general';
        
        if (!serviceStats[service]) {
          serviceStats[service] = { count: 0, earnings: 0 };
        }
        
        serviceStats[service].count++;
        if (pedido.estado === 'completado') {
          serviceStats[service].earnings += pedido.totalPrice || 0;
        }
      });
      
      // Guardar estadísticas del sistema
      await admin.firestore()
        .collection('sistema')
        .doc('estadisticas')
        .set({
          totalPedidos,
          pedidosPendientes,
          pedidosCompletados,
          totalClientes: clientesSnapshot.size,
          totalLavanderos: lavanderosSnapshot.size,
          ingresosTotales: Math.round(ingresosTotales),
          serviceStats,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      
      console.log('✅ Estadísticas del sistema actualizadas');
      return null;
      
    } catch (error) {
      console.error('❌ Error actualizando estadísticas del sistema:', error);
      return null;
    }
  });

// ============================================================================
// 3. VALIDACIONES Y SEGURIDAD
// ============================================================================

/**
 * Validar creación de pedidos
 */
exports.validateOrderCreation = functions.firestore
  .document('pedidos/{pedidoId}')
  .onCreate(async (snap, context) => {
    const pedidoData = snap.data();
    
    try {
      console.log(`🔍 Validando pedido ${context.params.pedidoId}...`);
      
      // Validar campos requeridos
      const requiredFields = ['clienteId', 'estado', 'fecha', 'totalPrice'];
      for (const field of requiredFields) {
        if (!pedidoData[field]) {
          throw new Error(`Campo requerido faltante: ${field}`);
        }
      }
      
      // Validar que el cliente existe
      const clienteDoc = await admin.firestore()
        .collection('clientes')
        .doc(pedidoData.clienteId)
        .get();
      
      if (!clienteDoc.exists) {
        throw new Error('Cliente no encontrado');
      }
      
      // Validar precio mínimo
      if (pedidoData.totalPrice < 1000) {
        throw new Error('Precio del pedido muy bajo');
      }
      
      // Validar peso máximo
      if (pedidoData.weight && pedidoData.weight > 100) {
        throw new Error('Peso del pedido excede el límite');
      }
      
      // Marcar pedido como validado
      await snap.ref.update({
        validado: true,
        validadoEn: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Pedido ${context.params.pedidoId} validado correctamente`);
      return null;
      
    } catch (error) {
      console.error(`❌ Error validando pedido: ${error.message}`);
      
      // Marcar pedido como inválido
      await snap.ref.update({
        validado: false,
        errorValidacion: error.message,
        validadoEn: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    }
  });

// ============================================================================
// 4. FUNCIONES HTTP PARA LA APP
// ============================================================================

/**
 * Calcular precio de pedido
 */
exports.calculateOrderPrice = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  try {
    const { serviceType, weight, pickupDate } = data;
    
    // Validar datos de entrada
    if (!serviceType || !weight || weight <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Datos de pedido inválidos');
    }
    
    // Precios base por kg
    const basePrices = {
      'lavado': 48000,
      'lavado-planchado': 60000,
      'zapatos': 80000,
      'hogar': 72000
    };
    
    const basePrice = basePrices[serviceType] || 60000;
    let totalPrice = basePrice * weight;
    
    // Descuento por pedidos grandes (más de 10kg)
    if (weight > 10) {
      totalPrice *= 0.9; // 10% de descuento
    }
    
    // Cargo por urgencia (si la fecha de recogida es hoy)
    const today = new Date().toISOString().split('T')[0];
    if (pickupDate === today) {
      totalPrice += 10000; // Cargo por urgencia
    }
    
    return {
      basePrice,
      totalPrice: Math.round(totalPrice),
      weight,
      serviceType,
      discount: weight > 10 ? '10% descuento por pedido grande' : null,
      urgencyCharge: pickupDate === today ? 10000 : 0
    };
    
  } catch (error) {
    console.error('Error calculando precio:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Obtener estadísticas del sistema
 */
exports.getSystemStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  try {
    const statsDoc = await admin.firestore()
      .collection('sistema')
      .doc('estadisticas')
      .get();
    
    if (statsDoc.exists) {
      return statsDoc.data();
    } else {
      return { error: 'Estadísticas no disponibles' };
    }
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Obtener estadísticas del usuario (cliente o lavandero)
 */
exports.getUserStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  try {
    const userId = context.auth.uid;
    const { userType } = data; // 'cliente' o 'lavandero'
    
    if (userType === 'cliente') {
      // Estadísticas del cliente
      const pedidosSnapshot = await admin.firestore()
        .collection('pedidos')
        .where('clienteId', '==', userId)
        .get();
      
      let totalPedidos = 0;
      let totalGastado = 0;
      let pedidosCompletados = 0;
      
      pedidosSnapshot.forEach(doc => {
        const pedido = doc.data();
        totalPedidos++;
        if (pedido.estado === 'completado') {
          pedidosCompletados++;
          totalGastado += pedido.totalPrice || 0;
        }
      });
      
      return {
        totalPedidos,
        pedidosCompletados,
        totalGastado: Math.round(totalGastado),
        pedidosPendientes: totalPedidos - pedidosCompletados
      };
      
    } else if (userType === 'lavandero') {
      // Estadísticas del lavandero
      const pedidosSnapshot = await admin.firestore()
        .collection('pedidos')
        .where('lavanderoId', '==', userId)
        .get();
      
      let totalPedidos = 0;
      let totalGanado = 0;
      let pedidosCompletados = 0;
      
      pedidosSnapshot.forEach(doc => {
        const pedido = doc.data();
        totalPedidos++;
        if (pedido.estado === 'completado') {
          pedidosCompletados++;
          totalGanado += pedido.totalPrice || 0;
        }
      });
      
      return {
        totalPedidos,
        pedidosCompletados,
        totalGanado: Math.round(totalGanado),
        pedidosPendientes: totalPedidos - pedidosCompletados
      };
    }
    
    throw new functions.https.HttpsError('invalid-argument', 'Tipo de usuario inválido');
    
  } catch (error) {
    console.error('Error obteniendo estadísticas del usuario:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

// ============================================================================
// 5. AUTOMATIZACIONES
// ============================================================================

/**
 * Limpiar pedidos antiguos automáticamente (diario)
 */
exports.cleanupOldOrders = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  try {
    console.log('🧹 Iniciando limpieza de pedidos antiguos...');
    
    const ninetyDaysAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    );
    
    const snapshot = await admin.firestore()
      .collection('pedidos')
      .where('estado', '==', 'completado')
      .where('fecha', '<', ninetyDaysAgo)
      .get();
    
    if (snapshot.empty) {
      console.log('✅ No hay pedidos antiguos para limpiar');
      return null;
    }
    
    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ ${snapshot.size} pedidos antiguos eliminados`);
    
    return null;
  } catch (error) {
    console.error('❌ Error limpiando pedidos antiguos:', error);
    return null;
  }
});

/**
 * Generar reporte diario (cada día a las 6 AM)
 */
exports.generateDailyReport = functions.pubsub.schedule('0 6 * * *').onRun(async (context) => {
  try {
    console.log('📊 Generando reporte diario...');
    
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
    const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));
    
    const pedidosSnapshot = await admin.firestore()
      .collection('pedidos')
      .where('fecha', '>=', admin.firestore.Timestamp.fromDate(yesterdayStart))
      .where('fecha', '<=', admin.firestore.Timestamp.fromDate(yesterdayEnd))
      .get();
    
    let totalPedidos = 0;
    let pedidosCompletados = 0;
    let ingresosTotales = 0;
    let pedidosPorServicio = {};
    
    pedidosSnapshot.forEach(doc => {
      const pedido = doc.data();
      totalPedidos++;
      
      if (pedido.estado === 'completado') {
        pedidosCompletados++;
        ingresosTotales += pedido.totalPrice || 0;
      }
      
      const servicio = pedido.serviceType || 'general';
      pedidosPorServicio[servicio] = (pedidosPorServicio[servicio] || 0) + 1;
    });
    
    const reporte = {
      fecha: admin.firestore.Timestamp.fromDate(yesterdayStart),
      totalPedidos,
      pedidosCompletados,
      ingresosTotales: Math.round(ingresosTotales),
      pedidosPorServicio,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await admin.firestore()
      .collection('reportes')
      .add(reporte);
    
    console.log('✅ Reporte diario generado correctamente');
    return null;
    
  } catch (error) {
    console.error('❌ Error generando reporte diario:', error);
    return null;
  }
});

// ============================================================================
// 6. FUNCIONES AUXILIARES
// ============================================================================

/**
 * Obtener título para cambio de estado
 */
function getStatusChangeTitle(estado) {
  const titles = {
    'pendiente': '📋 Pedido Creado',
    'en progreso': '🚀 Pedido en Proceso',
    'completado': '✅ Pedido Completado',
    'cancelado': '❌ Pedido Cancelado'
  };
  return titles[estado] || '📋 Estado del Pedido';
}

/**
 * Obtener mensaje para cambio de estado
 */
function getStatusChangeMessage(estado, pedidoData) {
  const messages = {
    'pendiente': 'Tu pedido ha sido creado y está esperando ser tomado por un lavandero.',
    'en progreso': `Tu pedido está siendo procesado por el lavandero. Fecha estimada de entrega: ${new Date(pedidoData.pickupDate).toLocaleDateString()}`,
    'completado': '¡Tu pedido está listo! El lavandero se pondrá en contacto contigo para la entrega.',
    'cancelado': 'Tu pedido ha sido cancelado. Si tienes alguna pregunta, contáctanos.'
  };
  return messages[estado] || 'El estado de tu pedido ha cambiado.';
}

/**
 * Enviar email de pedido completado
 */
async function sendOrderCompletedEmail(email, pedidoData) {
  try {
    const mailOptions = {
      from: 'Pulcro <noreply@pulcro.com>',
      to: email,
      subject: '¡Tu pedido está listo! 🎉',
      html: `
        <h2>¡Tu pedido está listo!</h2>
        <p>Hola, tu pedido de lavandería ha sido completado exitosamente.</p>
        <h3>Detalles del pedido:</h3>
        <ul>
          <li><strong>Servicio:</strong> ${pedidoData.serviceType}</li>
          <li><strong>Peso:</strong> ${pedidoData.weight} kg</li>
          <li><strong>Precio:</strong> $${pedidoData.totalPrice.toLocaleString('es-CO')}</li>
        </ul>
        <p>El lavandero se pondrá en contacto contigo para coordinar la entrega.</p>
        <p>¡Gracias por confiar en Pulcro!</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${email}`);
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
  }
}

// ============================================================================
// 7. FUNCIONES DE DESARROLLO Y TESTING
// ============================================================================

/**
 * Función de prueba para verificar que las Cloud Functions funcionan
 */
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.json({
    message: '¡Hola desde las Cloud Functions de Pulcro! 🚀',
    timestamp: new Date().toISOString(),
    functions: [
      'notifyOrderStatusChange',
      'updateLavanderoStats',
      'calculateOrderPrice',
      'getSystemStats',
      'cleanupOldOrders',
      'generateDailyReport'
    ]
  });
});

/**
 * Función para resetear estadísticas (solo desarrollo)
 */
exports.resetStats = functions.https.onCall(async (data, context) => {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    throw new functions.https.HttpsError('permission-denied', 'Función no disponible en producción');
  }
  
  try {
    await admin.firestore()
      .collection('sistema')
      .doc('estadisticas')
      .delete();
    
    return { message: 'Estadísticas reseteadas correctamente' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error reseteando estadísticas');
  }
});

console.log('🚀 Cloud Functions de Pulcro cargadas correctamente!');
