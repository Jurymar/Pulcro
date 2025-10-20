/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH SERVICE - Servicio de Autenticación
 * ═══════════════════════════════════════════════════════════════
 * 
 * Maneja toda la lógica de autenticación de la aplicación:
 * - Login y registro de usuarios
 * - Gestión de sesiones
 * - Almacenamiento de datos de usuario (clientes y lavanderos)
 * - Actualización de UI según estado de autenticación
 * - Redirección a dashboards correspondientes
 * 
 * ═══════════════════════════════════════════════════════════════
 */
class AuthService {
  /**
   * ────────────────────────────────────────────────────────────
   * CONSTRUCTOR
   * ────────────────────────────────────────────────────────────
   * Inicializa el servicio de autenticación y configura el listener
   * de cambios de estado de sesión
   */
  constructor() {
    this.auth = window.firebaseAuth; // Referencia a Firebase Auth
    this.db = window.firebaseDB; // Referencia a Firestore
    this.setupAuthStateListener(); // Configura listener de cambios de sesión
  }

  /**
   * ────────────────────────────────────────────────────────────
   * LISTENER DE ESTADO DE AUTENTICACIÓN
   * ────────────────────────────────────────────────────────────
   * Se ejecuta automáticamente cada vez que el estado de autenticación
   * cambia (login, logout, refresh de página)
   */
  setupAuthStateListener() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado: actualizar UI y redirigir a dashboard
        console.log("Usuario autenticado:", user.email);
        this.updateUIForAuthenticatedUser(user);
      } else {
        // Usuario no autenticado: mostrar botones de login/registro
        console.log("Usuario no autenticado");
        this.updateUIForUnauthenticatedUser();
      }
    });
  }

  /**
   * ────────────────────────────────────────────────────────────
   * ACTUALIZAR UI PARA USUARIO AUTENTICADO
   * ────────────────────────────────────────────────────────────
   * Cuando un usuario inicia sesión:
   * 1. Reemplaza los botones de login por email y botón de cerrar sesión
   * 2. Cierra todos los modales abiertos
   * 3. Inicia el proceso de redirección al dashboard correspondiente
   */
  updateUIForAuthenticatedUser(user) {
    console.log("🔄 Actualizando UI para usuario autenticado:", user.email);

    // Actualizar botones de navegación: mostrar email y botón logout
    const navButtons = document.querySelector(".nav-buttons");
    if (navButtons) {
      navButtons.innerHTML = `
        <span class="user-email">${user.email}</span>
        <button class="btn-outline" onclick="authService.signOut()">Cerrar Sesión</button>
      `;
    }

    // Cerrar todos los modales (login, registro, etc.)
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    document.body.style.overflow = "auto"; // Restaurar scroll del body

    // Redirigir al dashboard apropiado según tipo de usuario
    console.log("🎯 Iniciando proceso de redirección...");
    this.redirectToDashboard(user);
  }

  /**
   * ────────────────────────────────────────────────────────────
   * REDIRIGIR A DASHBOARD CORRESPONDIENTE
   * ────────────────────────────────────────────────────────────
   * Determina el tipo de usuario consultando Firestore y redirige:
   * - Si existe en "clientes" → cliente.html
   * - Si existe en "lavanderos" → lavandero.html
   * - Si no existe en ninguna → Error (debe completar registro)
   */
  async redirectToDashboard(user) {
    try {
      console.log("🔍 Iniciando redirección para usuario:", user.uid);
      console.log("📧 Email del usuario:", user.email);

      // Verificar si el usuario es un cliente
      // Busca documento con el UID del usuario en la colección "clientes"
      const clienteDoc = await this.db
        .collection("clientes")
        .doc(user.uid)
        .get();
      console.log("👕 ¿Existe en clientes?", clienteDoc.exists);
      if (clienteDoc.exists) {
        console.log("✅ Redirigiendo a dashboard cliente");
        window.location.href = "/cliente/cliente.html";
        return;
      }

      // Verificar si el usuario es un lavandero
      // Busca documento con el UID del usuario en la colección "lavanderos"
      const lavanderoDoc = await this.db
        .collection("lavanderos")
        .doc(user.uid)
        .get();
      console.log("🧺 ¿Existe en lavanderos?", lavanderoDoc.exists);
      if (lavanderoDoc.exists) {
        console.log("✅ Redirigiendo a dashboard lavandero");
        window.location.href = "/lavandero/lavandero.html";
        return;
      }

      // Si no está en ninguna colección: error en el proceso de registro
      console.log("❌ Usuario no encontrado en clientes ni lavanderos");
      console.log(
        "⚠️ El usuario debe registrarse usando 'Soy Cliente' o 'Soy Lavandero'"
      );
    } catch (error) {
      console.error("❌ Error checking user type:", error);
    }
  }

  // Update UI for unauthenticated user
  updateUIForUnauthenticatedUser() {
    const navButtons = document.querySelector(".nav-buttons");
    if (navButtons) {
      navButtons.innerHTML = `
        <a href="#" class="btn-outline" onclick="openModal('login')">Iniciar Sesión</a>
      `;
    }
  }

  /**
   * ────────────────────────────────────────────────────────────
   * INICIAR SESIÓN
   * ────────────────────────────────────────────────────────────
   * Autentica un usuario existente con email y contraseña
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} - { success: boolean, user?: User, error?: string }
   */
  async signIn(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      // Códigos de error comunes: auth/user-not-found, auth/wrong-password
      return { success: false, error: error.code };
    }
  }

  /**
   * ────────────────────────────────────────────────────────────
   * CREAR CUENTA DE USUARIO
   * ────────────────────────────────────────────────────────────
   * Crea una nueva cuenta de usuario en Firebase Authentication
   * Solo crea la cuenta, NO guarda datos adicionales en Firestore
   * 
   * @param {string} email - Email del nuevo usuario
   * @param {string} password - Contraseña del nuevo usuario
   * @returns {Object} - { success: boolean, user?: User, error?: string }
   */
  async createUser(email, password) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      // Códigos de error comunes: auth/email-already-in-use, auth/weak-password
      return { success: false, error: error.code };
    }
  }

  /**
   * ────────────────────────────────────────────────────────────
   * GUARDAR DATOS DE CLIENTE
   * ────────────────────────────────────────────────────────────
   * Almacena la información adicional del cliente en Firestore
   * después de crear la cuenta de autenticación
   * 
   * @param {string} userId - UID del usuario de Firebase Auth
   * @param {Object} clienteData - Datos del cliente (nombre, teléfono, dirección, etc.)
   * @returns {Object} - { success: boolean, error?: string }
   */
  async saveClienteData(userId, clienteData) {
    try {
      await this.db
        .collection("clientes")
        .doc(userId) // Usa el UID como ID del documento
        .set({
          ...clienteData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Timestamp del servidor
        });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * ────────────────────────────────────────────────────────────
   * GUARDAR DATOS DE LAVANDERO
   * ────────────────────────────────────────────────────────────
   * Almacena la información adicional del lavandero en Firestore
   * después de crear la cuenta de autenticación
   * 
   * @param {string} userId - UID del usuario de Firebase Auth
   * @param {Object} lavanderoData - Datos del lavandero (nombre, teléfono, servicios, etc.)
   * @returns {Object} - { success: boolean, error?: string }
   */
  async saveLavanderoData(userId, lavanderoData) {
    try {
      await this.db
        .collection("lavanderos")
        .doc(userId) // Usa el UID como ID del documento
        .set({
          ...lavanderoData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Timestamp del servidor
        });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * ────────────────────────────────────────────────────────────
   * CERRAR SESIÓN
   * ────────────────────────────────────────────────────────────
   * Cierra la sesión del usuario actual y redirige a la página principal
   * 
   * @returns {Object} - { success: boolean, error?: string }
   */
  async signOut() {
    try {
      await this.auth.signOut();
      console.log("Usuario cerrado sesión");
      return { success: true };
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ────────────────────────────────────────────────────────────
   * OBTENER USUARIO ACTUAL
   * ────────────────────────────────────────────────────────────
   * @returns {User|null} - Usuario actual o null si no hay sesión
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * ────────────────────────────────────────────────────────────
   * VERIFICAR SI HAY SESIÓN ACTIVA
   * ────────────────────────────────────────────────────────────
   * @returns {boolean} - true si hay usuario autenticado
   */
  isAuthenticated() {
    return !!this.auth.currentUser; // Convierte a booleano
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INICIALIZACIÓN DEL SERVICIO
 * ═══════════════════════════════════════════════════════════════
 * Crea una instancia global del servicio de autenticación
 * disponible en window.authService para uso en toda la aplicación
 */
const authService = new AuthService();
window.authService = authService;
