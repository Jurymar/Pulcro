// Error Handler Service
class ErrorHandler {
  constructor() {
    this.errorMessages = {
      // Authentication errors
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

      // Firestore errors
      "permission-denied": "No tienes permisos para realizar esta acción.",
      unavailable: "El servicio no está disponible en este momento.",
      "deadline-exceeded": "La operación tardó demasiado en completarse.",

      // General errors
      unknown: "Ocurrió un error inesperado. Intenta de nuevo.",
      "network-error": "Error de conexión. Verifica tu internet.",
      "validation-error": "Los datos ingresados no son válidos.",
    };
  }

  // Get error message in Spanish
  getErrorMessage(errorCode) {
    return this.errorMessages[errorCode] || this.errorMessages["unknown"];
  }

  // Handle authentication error
  handleAuthError(error) {
    console.error("Error de autenticación:", error);
    const message = this.getErrorMessage(error.code || error.message);
    window.notificationService.error(message);
    return message;
  }

  // Handle Firestore error
  handleFirestoreError(error) {
    console.error("Error de Firestore:", error);
    const message = this.getErrorMessage(error.code || error.message);
    window.notificationService.error(message);
    return message;
  }

  // Handle general error
  handleError(error) {
    console.error("Error general:", error);
    const message = this.getErrorMessage(error.code || error.message);
    window.notificationService.error(message);
    return message;
  }

  // Validate form data
  validateForm(formData, formType = "default") {
    const errors = [];

    // Email validation
    if (formData.email && !this.isValidEmail(formData.email)) {
      errors.push("El email ingresado no es válido.");
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres.");
    }

    // Required fields validation based on form type
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
        // For backward compatibility, check if name exists in formData
        if (formData.name !== undefined) {
          requiredFields = ["name", "email", "password"];
        } else if (formData.ownerName !== undefined) {
          requiredFields = ["ownerName", "email", "password"];
        } else {
          requiredFields = ["email", "password"];
        }
    }

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors.push(`El campo ${field} es obligatorio.`);
      }
    });

    return errors;
  }

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show validation errors
  showValidationErrors(errors) {
    if (errors.length > 0) {
      const message = errors.join(" ");
      window.notificationService.error(message);
      return false;
    }
    return true;
  }
}

// Initialize error handler
const errorHandler = new ErrorHandler();
window.errorHandler = errorHandler;
