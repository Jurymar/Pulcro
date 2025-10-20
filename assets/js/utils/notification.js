/**
 * ═══════════════════════════════════════════════════════════════
 * NOTIFICATION SERVICE - Servicio de Notificaciones Toast
 * ═══════════════════════════════════════════════════════════════
 * 
 * Sistema de notificaciones tipo "toast" que aparecen temporalmente
 * en la esquina superior derecha de la pantalla.
 * 
 * Tipos de notificaciones:
 * - success: Verde - operaciones exitosas
 * - error: Rojo - errores y problemas
 * - warning: Naranja - advertencias
 * - info: Azul - información general
 * 
 * ═══════════════════════════════════════════════════════════════
 */
class NotificationService {
  /**
   * ────────────────────────────────────────────────────────────
   * CONSTRUCTOR
   * ────────────────────────────────────────────────────────────
   * Inicializa el servicio con array vacío de notificaciones
   */
  constructor() {
    this.notifications = []; // Historial de notificaciones (opcional)
  }

  /**
   * ────────────────────────────────────────────────────────────
   * MOSTRAR NOTIFICACIÓN
   * ────────────────────────────────────────────────────────────
   * Método principal que crea y muestra una notificación temporal
   * 
   * @param {string} message - Texto a mostrar
   * @param {string} type - Tipo: "success", "error", "warning", "info"
   * @param {number} duration - Duración en milisegundos (default: 5000)
   * @returns {HTMLElement} - Elemento de notificación creado
   */
  show(message, type = "info", duration = 5000) {
    const notification = this.createNotificationElement(message, type);
    document.body.appendChild(notification); // Agregar al DOM

    // Auto-remover después de la duración especificada
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, duration);

    return notification;
  }

  /**
   * ────────────────────────────────────────────────────────────
   * CREAR ELEMENTO DE NOTIFICACIÓN
   * ────────────────────────────────────────────────────────────
   * Crea el elemento HTML de la notificación con estilos inline
   * 
   * @param {string} message - Texto a mostrar
   * @param {string} type - Tipo de notificación
   * @returns {HTMLElement} - Elemento div con la notificación
   */
  createNotificationElement(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // ──────────────────────────────────────────────────────
    // Estilos Inline de la Notificación
    // ──────────────────────────────────────────────────────
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      max-width: 300px;
      word-wrap: break-word;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // ──────────────────────────────────────────────────────
    // Color de Fondo según Tipo
    // ──────────────────────────────────────────────────────
    switch (type) {
      case "success":
        notification.style.backgroundColor = "#4CAF50"; // Verde
        break;
      case "error":
        notification.style.backgroundColor = "#f44336"; // Rojo
        break;
      case "warning":
        notification.style.backgroundColor = "#ff9800"; // Naranja
        break;
      default:
        notification.style.backgroundColor = "#2196F3"; // Azul
    }

    return notification;
  }

  /**
   * ────────────────────────────────────────────────────────────
   * NOTIFICACIÓN DE ÉXITO
   * ────────────────────────────────────────────────────────────
   * Atajo para mostrar notificación verde de éxito
   */
  success(message, duration = 5000) {
    return this.show(message, "success", duration);
  }

  /**
   * ────────────────────────────────────────────────────────────
   * NOTIFICACIÓN DE ERROR
   * ────────────────────────────────────────────────────────────
   * Atajo para mostrar notificación roja de error
   */
  error(message, duration = 5000) {
    return this.show(message, "error", duration);
  }

  /**
   * ────────────────────────────────────────────────────────────
   * NOTIFICACIÓN DE ADVERTENCIA
   * ────────────────────────────────────────────────────────────
   * Atajo para mostrar notificación naranja de advertencia
   */
  warning(message, duration = 5000) {
    return this.show(message, "warning", duration);
  }

  /**
   * ────────────────────────────────────────────────────────────
   * NOTIFICACIÓN DE INFORMACIÓN
   * ────────────────────────────────────────────────────────────
   * Atajo para mostrar notificación azul informativa
   */
  info(message, duration = 5000) {
    return this.show(message, "info", duration);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INICIALIZACIÓN
 * ═══════════════════════════════════════════════════════════════
 * Crea instancia global del servicio de notificaciones
 * Disponible en window.notificationService para toda la aplicación
 */
const notificationService = new NotificationService();
window.notificationService = notificationService;
