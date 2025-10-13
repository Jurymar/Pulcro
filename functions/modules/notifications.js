/**
 * Módulo de Notificaciones - Cloud Functions
 * Maneja todas las notificaciones automáticas del sistema
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Configurar nodemailer
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: (functions.config().email && functions.config().email.user) || "",
    pass: (functions.config().email && functions.config().email.pass) || "",
  },
});

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
      
      // Obtener datos del lavandero si está asignado
      let lavanderoData = null;
      if (newData.lavanderoId) {
        const lavanderoDoc = await admin.firestore()
          .collection('lavanderos')
          .doc(newData.lavanderoId)
          .get();
        
        if (lavanderoDoc.exists) {
          lavanderoData = lavanderoDoc.data();
        }
      }
      
      // Enviar notificación por email
      await sendStatusChangeEmail(clienteData, newData, lavanderoData);
      
      // Crear notificación en la base de datos
      await admin.firestore().collection('notifications').add({
        userId: newData.clienteId,
        type: 'order_status_change',
        title: `Estado del pedido actualizado`,
        message: `Tu pedido #${pedidoId.slice(-6)} ahora está: ${getStatusText(newData.estado)}`,
        orderId: pedidoId,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ Notificación enviada exitosamente');
      
    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
    }
  });

/**
 * Notificar cuando se asigna un lavandero
 */
exports.notifyLavanderoAssigned = functions.firestore
  .document("pedidos/{pedidoId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Solo procesar si se asignó un lavandero
    if (!newData.lavanderoId || newData.lavanderoId === previousData.lavanderoId) {
      return null;
    }
    
    try {
      console.log(`👨‍💼 Lavandero asignado al pedido ${context.params.pedidoId}`);
      
      // Obtener datos del cliente
      const clienteDoc = await admin.firestore()
        .collection('clientes')
        .doc(newData.clienteId)
        .get();
      
      if (!clienteDoc.exists) {
        return null;
      }
      
      const clienteData = clienteDoc.data();
      
      // Obtener datos del lavandero
      const lavanderoDoc = await admin.firestore()
        .collection('lavanderos')
        .doc(newData.lavanderoId)
        .get();
      
      if (!lavanderoDoc.exists) {
        return null;
      }
      
      const lavanderoData = lavanderoDoc.data();
      
      // Enviar email de asignación
      await sendLavanderoAssignedEmail(clienteData, newData, lavanderoData);
      
      console.log('✅ Notificación de asignación enviada');
      
    } catch (error) {
      console.error('❌ Error enviando notificación de asignación:', error);
    }
  });

/**
 * Enviar email de cambio de estado
 */
async function sendStatusChangeEmail(clienteData, orderData, lavanderoData) {
  if (!transporter.options.auth.user) {
    console.log('⚠️ Email no configurado, saltando envío');
    return;
  }
  
  const statusText = getStatusText(orderData.estado);
  const lavanderoInfo = lavanderoData ? 
    `\n\nLavandero asignado: ${lavanderoData.name || 'N/A'}` : '';
  
  const mailOptions = {
    from: transporter.options.auth.user,
    to: clienteData.email,
    subject: `Pulcro - Estado de tu pedido actualizado`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">¡Hola ${clienteData.name || 'Cliente'}!</h2>
        <p>El estado de tu pedido ha sido actualizado:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">Estado actual: ${statusText}</h3>
          <p><strong>Descripción:</strong> ${orderData.descripcion || 'N/A'}</p>
          <p><strong>Dirección:</strong> ${orderData.direccion || 'N/A'}</p>
          <p><strong>Precio:</strong> $${orderData.totalPrice?.toLocaleString('es-CO') || 'N/A'} COP</p>
          ${lavanderoInfo}
        </div>
        <p>Gracias por confiar en Pulcro para el cuidado de tu ropa.</p>
        <p>Saludos,<br>El equipo de Pulcro</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

/**
 * Enviar email de asignación de lavandero
 */
async function sendLavanderoAssignedEmail(clienteData, orderData, lavanderoData) {
  if (!transporter.options.auth.user) {
    console.log('⚠️ Email no configurado, saltando envío');
    return;
  }
  
  const mailOptions = {
    from: transporter.options.auth.user,
    to: clienteData.email,
    subject: `Pulcro - Lavandero asignado a tu pedido`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">¡Hola ${clienteData.name || 'Cliente'}!</h2>
        <p>¡Excelentes noticias! Hemos asignado un lavandero a tu pedido:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">Lavandero: ${lavanderoData.name || 'N/A'}</h3>
          <p><strong>Descripción:</strong> ${orderData.descripcion || 'N/A'}</p>
          <p><strong>Estado:</strong> ${getStatusText(orderData.estado)}</p>
        </div>
        <p>Tu lavandero se pondrá en contacto contigo pronto para coordinar la recogida.</p>
        <p>Saludos,<br>El equipo de Pulcro</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

/**
 * Obtener texto del estado
 */
function getStatusText(estado) {
  const statusMap = {
    'pendiente': 'Pendiente',
    'en progreso': 'En Progreso',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  };
  return statusMap[estado] || estado;
}
