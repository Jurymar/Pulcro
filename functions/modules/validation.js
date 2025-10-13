/**
 * Módulo de Validación - Cloud Functions
 * Maneja todas las validaciones del sistema
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Validar datos de pedido antes de crear
 */
exports.validateOrder = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { serviceType, weight, pickupDate, pickupTime, clienteId } = data;
  
  // Validaciones básicas
  if (!serviceType || !weight || !pickupDate || !pickupTime || !clienteId) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan campos requeridos');
  }
  
  // Validar tipo de servicio
  const validServices = ['lavado', 'seco', 'zapatos', 'hogar', 'express'];
  if (!validServices.includes(serviceType)) {
    throw new functions.https.HttpsError('invalid-argument', 'Tipo de servicio inválido');
  }
  
  // Validar peso
  if (weight < 0.1 || weight > 50) {
    throw new functions.https.HttpsError('invalid-argument', 'Peso debe estar entre 0.1 y 50 kg');
  }
  
  // Validar fecha de recogida
  const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
  const now = new Date();
  const minDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 horas desde ahora
  
  if (pickupDateTime < minDate) {
    throw new functions.https.HttpsError('invalid-argument', 'La fecha de recogida debe ser al menos 2 horas en el futuro');
  }
  
  // Validar que el cliente existe
  const clienteDoc = await admin.firestore()
    .collection('clientes')
    .doc(clienteId)
    .get();
  
  if (!clienteDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Cliente no encontrado');
  }
  
  // Validar que el cliente tiene datos completos
  const clienteData = clienteDoc.data();
  if (!clienteData.address || !clienteData.phone) {
    throw new functions.https.HttpsError('invalid-argument', 'Cliente debe completar dirección y teléfono en su perfil');
  }
  
  return { valid: true, message: 'Pedido válido' };
});

/**
 * Validar datos de usuario
 */
exports.validateUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { name, email, phone, address, userType } = data;
  
  // Validar nombre
  if (!name || name.trim().length < 2) {
    throw new functions.https.HttpsError('invalid-argument', 'Nombre debe tener al menos 2 caracteres');
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new functions.https.HttpsError('invalid-argument', 'Email inválido');
  }
  
  // Validar teléfono
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!phone || !phoneRegex.test(phone) || phone.length < 7) {
    throw new functions.https.HttpsError('invalid-argument', 'Teléfono inválido');
  }
  
  // Validar dirección
  if (!address || address.trim().length < 10) {
    throw new functions.https.HttpsError('invalid-argument', 'Dirección debe tener al menos 10 caracteres');
  }
  
  // Validar tipo de usuario
  const validUserTypes = ['cliente', 'lavandero'];
  if (!userType || !validUserTypes.includes(userType)) {
    throw new functions.https.HttpsError('invalid-argument', 'Tipo de usuario inválido');
  }
  
  return { valid: true, message: 'Datos de usuario válidos' };
});

/**
 * Validar que un lavandero puede tomar un pedido
 */
exports.validateOrderAssignment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { orderId, lavanderoId } = data;
  
  // Verificar que el lavandero existe
  const lavanderoDoc = await admin.firestore()
    .collection('lavanderos')
    .doc(lavanderoId)
    .get();
  
  if (!lavanderoDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Lavandero no encontrado');
  }
  
  // Verificar que el pedido existe y está disponible
  const orderDoc = await admin.firestore()
    .collection('pedidos')
    .doc(orderId)
    .get();
  
  if (!orderDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Pedido no encontrado');
  }
  
  const orderData = orderDoc.data();
  
  // Verificar que el pedido está pendiente
  if (orderData.status !== 'pending' && orderData.estado !== 'pendiente') {
    throw new functions.https.HttpsError('failed-precondition', 'El pedido no está disponible');
  }
  
  // Verificar que no tiene lavandero asignado
  if (orderData.lavanderoId) {
    throw new functions.https.HttpsError('failed-precondition', 'El pedido ya fue tomado por otro lavandero');
  }
  
  // Verificar que el lavandero no tiene demasiados pedidos activos
  const activeOrders = await admin.firestore()
    .collection('pedidos')
    .where('lavanderoId', '==', lavanderoId)
    .where('status', 'in', ['pending', 'in-progress'])
    .get();
  
  if (activeOrders.size >= 5) {
    throw new functions.https.HttpsError('resource-exhausted', 'El lavandero ya tiene el máximo de pedidos activos (5)');
  }
  
  return { valid: true, message: 'Asignación válida' };
});

/**
 * Validar datos de perfil de lavandero
 */
exports.validateLavanderoProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const { name, email, phone, address, experience, specialties } = data;
  
  // Validar nombre
  if (!name || name.trim().length < 2) {
    throw new functions.https.HttpsError('invalid-argument', 'Nombre debe tener al menos 2 caracteres');
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new functions.https.HttpsError('invalid-argument', 'Email inválido');
  }
  
  // Validar teléfono
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!phone || !phoneRegex.test(phone) || phone.length < 7) {
    throw new functions.https.HttpsError('invalid-argument', 'Teléfono inválido');
  }
  
  // Validar dirección
  if (!address || address.trim().length < 10) {
    throw new functions.https.HttpsError('invalid-argument', 'Dirección debe tener al menos 10 caracteres');
  }
  
  // Validar experiencia
  if (experience && (experience < 0 || experience > 50)) {
    throw new functions.https.HttpsError('invalid-argument', 'Experiencia debe estar entre 0 y 50 años');
  }
  
  // Validar especialidades
  if (specialties && !Array.isArray(specialties)) {
    throw new functions.https.HttpsError('invalid-argument', 'Especialidades debe ser un array');
  }
  
  const validSpecialties = ['lavado', 'seco', 'zapatos', 'hogar', 'express'];
  if (specialties && specialties.some(s => !validSpecialties.includes(s))) {
    throw new functions.https.HttpsError('invalid-argument', 'Especialidades inválidas');
  }
  
  return { valid: true, message: 'Perfil de lavandero válido' };
});
