/**
 * ═══════════════════════════════════════════════════════════════
 * FORM HANDLER - Manejador de Formularios
 * ═══════════════════════════════════════════════════════════════
 * 
 * Gestiona el envío y procesamiento de todos los formularios
 * de la página principal (index.html):
 * - Formulario de login
 * - Formulario de registro de cliente
 * - Formulario de registro de lavandero
 * 
 * RESPONSABILIDADES:
 * - Capturar evento submit de formularios
 * - Extraer y validar datos del formulario
 * - Llamar al servicio de autenticación apropiado
 * - Mostrar mensajes de éxito/error
 * - Manejar errores de forma amigable
 * 
 * ═══════════════════════════════════════════════════════════════
 */
class FormHandler {
  /**
   * ────────────────────────────────────────────────────────────
   * CONSTRUCTOR
   * ────────────────────────────────────────────────────────────
   * Inicializa el manejador configurando listeners de formularios
   */
  constructor() {
    this.setupFormListeners(); // Configurar eventos de formularios
  }

  /**
   * ────────────────────────────────────────────────────────────
   * CONFIGURAR LISTENERS DE FORMULARIOS
   * ────────────────────────────────────────────────────────────
   * Espera a que el DOM esté listo y adjunta eventos submit
   * a todos los formularios de la página
   */
  setupFormListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      // ──────────────────────────────────────────────────────
      // Formulario de Login
      // ──────────────────────────────────────────────────────
      const loginForm = document.querySelector("#loginModal form");
      if (loginForm) {
        loginForm.addEventListener("submit", (e) => this.handleLogin(e));
      }

      // ──────────────────────────────────────────────────────
      // Formulario de Registro de Cliente
      // ──────────────────────────────────────────────────────
      const clienteForm = document.querySelector("#clienteModal form");
      if (clienteForm) {
        clienteForm.addEventListener("submit", (e) =>
          this.handleClienteRegister(e)
        );
      }

      // ──────────────────────────────────────────────────────
      // Formulario de Registro de Lavandero
      // ──────────────────────────────────────────────────────
      const lavanderoForm = document.querySelector("#lavanderoModal form");
      if (lavanderoForm) {
        lavanderoForm.addEventListener("submit", (e) =>
          this.handleLavanderoRegister(e)
        );
      }
    });
  }

  /**
   * ────────────────────────────────────────────────────────────
   * EXTRAER DATOS DEL FORMULARIO
   * ────────────────────────────────────────────────────────────
   * Convierte los campos del formulario en un objeto JavaScript
   * 
   * @param {HTMLFormElement} form - Elemento form del DOM
   * @returns {Object} - Objeto con pares name: value
   * 
   * EJEMPLO:
   * Input: <input name="email" value="test@test.com">
   * Output: { email: "test@test.com" }
   */
  getFormData(form) {
    const formData = {};
    const inputs = form.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
      // Ignorar botones de submit y campos sin name
      if (input.name && input.type !== "submit") {
        if (input.type === "checkbox") {
          // Handle multiple checkboxes with same name
          if (input.name === "services") {
            if (!formData[input.name]) {
              formData[input.name] = [];
            }
            if (input.checked) {
              formData[input.name].push(input.value);
            }
          } else {
            formData[input.name] = input.checked;
          }
        } else {
          formData[input.name] = input.value;
        }
      }
    });

    return formData;
  }

  // Set button loading state
  setButtonLoading(button, isLoading, loadingText = "Procesando...") {
    const originalText = button.textContent;

    if (isLoading) {
      button.textContent = loadingText;
      button.disabled = true;
    } else {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  // Handle login
  async handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const formData = this.getFormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate form
    const errors = window.errorHandler.validateForm(formData, "login");
    if (!window.errorHandler.showValidationErrors(errors)) {
      return;
    }

    this.setButtonLoading(submitBtn, true, "Iniciando sesión...");

    try {
      const result = await window.authService.signIn(
        formData.email,
        formData.password
      );

      if (result.success) {
        window.notificationService.success("¡Inicio de sesión exitoso!");
        closeModal("loginModal");
        // La redirección se maneja automáticamente por el auth-state-listener
      } else {
        window.errorHandler.handleAuthError({ code: result.error });
      }
    } catch (error) {
      window.errorHandler.handleError(error);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  // Handle cliente register
  async handleClienteRegister(e) {
    e.preventDefault();

    const form = e.target;
    const formData = this.getFormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate form
    const errors = window.errorHandler.validateForm(formData, "cliente");
    if (!window.errorHandler.showValidationErrors(errors)) {
      return;
    }

    this.setButtonLoading(submitBtn, true, "Creando cuenta...");

    try {
      // Create user account
      const userResult = await window.authService.createUser(
        formData.email,
        formData.password
      );

      if (userResult.success) {
        // Save cliente data to Firestore
        const clienteData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        };

        const saveResult = await window.authService.saveClienteData(
          userResult.user.uid,
          clienteData
        );

        if (saveResult.success) {
          window.notificationService.success(
            "¡Cuenta de cliente creada exitosamente!"
          );
          closeModal("clienteModal");
          // La redirección se maneja automáticamente por el auth-state-listener
        } else {
          window.errorHandler.handleFirestoreError({
            message: saveResult.error,
          });
        }
      } else {
        window.errorHandler.handleAuthError({ code: userResult.error });
      }
    } catch (error) {
      window.errorHandler.handleError(error);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  // Handle lavandero register
  async handleLavanderoRegister(e) {
    e.preventDefault();

    const form = e.target;
    const formData = this.getFormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    console.log("🧺 Datos del formulario de lavandero:", formData);

    // Validate form
    const errors = window.errorHandler.validateForm(formData, "lavandero");
    console.log("🔍 Errores de validación:", errors);
    if (!window.errorHandler.showValidationErrors(errors)) {
      return;
    }

    this.setButtonLoading(submitBtn, true, "Creando cuenta...");

    try {
      // Create user account
      console.log("🔐 Creando usuario con email:", formData.email);
      const userResult = await window.authService.createUser(
        formData.email,
        formData.password
      );

      console.log("🔐 Resultado de creación de usuario:", userResult);

      if (userResult.success) {
        // Get selected services from checkboxes
        const services = formData.services || [];
        console.log("🧺 Servicios seleccionados:", services);

        // Save lavandero data to Firestore
        const lavanderoData = {
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          services: services,
        };

        console.log("💾 Guardando datos de lavandero:", lavanderoData);
        const saveResult = await window.authService.saveLavanderoData(
          userResult.user.uid,
          lavanderoData
        );

        console.log("💾 Resultado de guardado:", saveResult);

        if (saveResult.success) {
          window.notificationService.success(
            "¡Cuenta de lavandero creada exitosamente!"
          );
          closeModal("lavanderoModal");
          // La redirección se maneja automáticamente por el auth-state-listener
        } else {
          window.errorHandler.handleFirestoreError({
            message: saveResult.error,
          });
        }
      } else {
        window.errorHandler.handleAuthError({ code: userResult.error });
      }
    } catch (error) {
      window.errorHandler.handleError(error);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }
}

// Initialize form handler
const formHandler = new FormHandler();
window.formHandler = formHandler;
