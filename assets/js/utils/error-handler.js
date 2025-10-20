/**
 * ═══════════════════════════════════════════════════════════════
 * ERROR HANDLER - Manejador Centralizado de Errores
 * ═══════════════════════════════════════════════════════════════
 * 
 * Proporciona un manejo unificado de errores en toda la aplicación:
 * - Traduce códigos de error técnicos a mensajes amigables en español
 * - Maneja errores de Firebase Authentication
 * - Maneja errores de Firestore
 * - Valida formularios antes de enviarlos
 * - Muestra notificaciones automáticas al usuario
 * 
 * ═══════════════════════════════════════════════════════════════
 */
class ErrorHandler {
  /**
   * ────────────────────────────────────────────────────────────
   * CONSTRUCTOR - Diccionario de Mensajes de Error
   * ────────────────────────────────────────────────────────────
   * Define traducciones de códigos de error técnicos a mensajes
   * en español comprensibles para el usuario final
   */
  constructor() {
    this.errorMessages = {
      // ──────────────────────────────────────────────────────
      // ERRORES DE AUTENTICACIÓN (Firebase Auth)
      // ──────────────────────────────────────────────────────
      "auth/user-not-found": "No existe una cuenta con este email.",
      "auth/wrong-password": "Contraseña incorrecta.",
      "auth/email-already-in-use": "Este email ya está registrado.",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
      "auth/invalid-email": "Email inválido.",
      "auth/too-many-requests":
        "Demasiados intentos fallidos. Intenta más tarde.",
      "auth/network-request-failed": "Error de conexión. Verifica tu internet.",
      "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
      "auth/operation-not-allowed": "Esta operación no está permitida.",
      "auth/invalid-credential": "Credenciales inválidas.",

      // ──────────────────────────────────────────────────────
      // ERRORES DE FIRESTORE (Base de datos)
      // ──────────────────────────────────────────────────────
      "permission-denied": "No tienes permisos para realizar esta acción.",
      unavailable: "El servicio no está disponible en este momento.",
      "deadline-exceeded": "La operación tardó demasiado en completarse.",

      // ──────────────────────────────────────────────────────
      // ERRORES GENERALES
      // ──────────────────────────────────────────────────────
      unknown: "Ocurrió un error inesperado. Intenta de nuevo.",
      "network-error": "Error de conexión. Verifica tu internet.",
      "validation-error": "Los datos ingresados no son válidos.",
    };
  }

  /**
   * ────────────────────────────────────────────────────────────
   * OBTENER MENSAJE DE ERROR EN ESPAÑOL
   * ────────────────────────────────────────────────────────────
   * Busca el mensaje correspondiente al código de error
   * Si no encuentra el código, devuelve mensaje de error genérico
   * 
   * @param {string} errorCode - Código del error (ej: "auth/user-not-found")
   * @returns {string} - Mensaje de error en español
   */
  getErrorMessage(errorCode) {
    return this.errorMessages[errorCode] || this.errorMessages["unknown"];
  }

  /**
   * ────────────────────────────────────────────────────────────
   * MANEJAR ERROR DE AUTENTICACIÓN
   * ────────────────────────────────────────────────────────────
   * Procesa errores de Firebase Auth y muestra notificación al usuario
   * 
   * @param {Error} error - Error de Firebase Auth
   * @returns {string} - Mensaje de error traducido
   */
  handleAuthError(error) {
    console.error("Error de autenticación:", error);
    const message = this.getErrorMessage(error.code || error.message);
    window.notificationService.error(message); // Muestra notificación roja
    return message;
  }

  /**
   * ────────────────────────────────────────────────────────────
   * MANEJAR ERROR DE FIRESTORE
   * ────────────────────────────────────────────────────────────
   * Procesa errores de Firestore (base de datos) y notifica al usuario
   * 
   * @param {Error} error - Error de Firestore
   * @returns {string} - Mensaje de error traducido
   */
  handleFirestoreError(error) {
    console.error("Error de Firestore:", error);
    const message = this.getErrorMessage(error.code || error.message);
    window.notificationService.error(message);
    return message;
  }

  /**
   * ────────────────────────────────────────────────────────────
   * MANEJAR ERROR GENERAL
   * ────────────────────────────────────────────────────────────
   * Procesa cualquier tipo de error y notifica al usuario
   * Úsalo cuando no estés seguro del tipo de error
   * 
   * @param {Error} error - Cualquier objeto de error
   * @returns {string} - Mensaje de error traducido
   */
  handleError(error) {
    console.error("Error general:", error);
    const message = this.getErrorMessage(error.code || error.message);
    window.notificationService.error(message);
    return message;
  }

  /**
   * ────────────────────────────────────────────────────────────
   * VALIDAR FORMULARIO
   * ────────────────────────────────────────────────────────────
   * Valida los datos de un formulario antes de enviarlo
   * Verifica campos requeridos, formato de email y longitud de contraseña
   * 
   * @param {Object} formData - Datos del formulario a validar
   * @param {string} formType - Tipo de formulario ("login", "cliente", "lavandero")
   * @returns {Array<string>} - Array de mensajes de error (vacío si todo OK)
   */
  validateForm(formData, formType = "default") {
    const errors = [];

    // ──────────────────────────────────────────────────────
    // Validación de Email
    // ──────────────────────────────────────────────────────
    if (formData.email && !this.isValidEmail(formData.email)) {
      errors.push("El email ingresado no es válido.");
    }

    // ──────────────────────────────────────────────────────
    // Validación de Contraseña (mínimo 6 caracteres)
    // ──────────────────────────────────────────────────────
    if (formData.password && formData.password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres.");
    }

    // ──────────────────────────────────────────────────────
    // Campos Requeridos según Tipo de Formulario
    // ──────────────────────────────────────────────────────
    let requiredFields = [];

    switch (formType) {
      case "login":
        requiredFields = ["email", "password"];
        break;
      case "cliente":
        requiredFields = ["name", "email", "password"];
        break;
      case "lavandero":
        requiredFields = ["ownerName", "email", "password"];
        break;
      default:
        // Compatibilidad: detecta automáticamente el tipo
        if (formData.name !== undefined) {
          requiredFields = ["name", "email", "password"];
        } else if (formData.ownerName !== undefined) {
          requiredFields = ["ownerName", "email", "password"];
        } else {
          requiredFields = ["email", "password"];
        }
    }

    // Verifica que todos los campos requeridos estén llenos
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors.push(`El campo ${field} es obligatorio.`);
      }
    });

    return errors;
  }

  /**
   * ────────────────────────────────────────────────────────────
   * VALIDAR EMAIL
   * ────────────────────────────────────────────────────────────
   * Verifica que el email tenga formato válido usando regex
   * 
   * @param {string} email - Email a validar
   * @returns {boolean} - true si el email es válido
   */
  isValidEmail(email) {
    // Regex: [texto]@[texto].[texto]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * ────────────────────────────────────────────────────────────
   * MOSTRAR ERRORES DE VALIDACIÓN
   * ────────────────────────────────────────────────────────────
   * Muestra los errores de validación al usuario mediante notificación
   * 
   * @param {Array<string>} errors - Array de mensajes de error
   * @returns {boolean} - false si hay errores, true si todo OK
   */
  showValidationErrors(errors) {
    if (errors.length > 0) {
      const message = errors.join(" "); // Une todos los errores en un mensaje
      window.notificationService.error(message);
      return false;
    }
    return true;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INICIALIZACIÓN
 * ═══════════════════════════════════════════════════════════════
 * Crea instancia global del manejador de errores
 * Disponible en window.errorHandler para toda la aplicación
 */
const errorHandler = new ErrorHandler();
window.errorHandler = errorHandler;
