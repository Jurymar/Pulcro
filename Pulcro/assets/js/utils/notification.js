// Notification Service
class NotificationService {
  constructor() {
    this.notifications = [];
  }

  // Show notification
  show(message, type = "info", duration = 5000) {
    const notification = this.createNotificationElement(message, type);
    document.body.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, duration);

    return notification;
  }

  // Create notification element
  createNotificationElement(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
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

    // Set background color based on type
    switch (type) {
      case "success":
        notification.style.backgroundColor = "#4CAF50";
        break;
      case "error":
        notification.style.backgroundColor = "#f44336";
        break;
      case "warning":
        notification.style.backgroundColor = "#ff9800";
        break;
      default:
        notification.style.backgroundColor = "#2196F3";
    }

    return notification;
  }

  // Show success notification
  success(message, duration = 5000) {
    return this.show(message, "success", duration);
  }

  // Show error notification
  error(message, duration = 5000) {
    return this.show(message, "error", duration);
  }

  // Show warning notification
  warning(message, duration = 5000) {
    return this.show(message, "warning", duration);
  }

  // Show info notification
  info(message, duration = 5000) {
    return this.show(message, "info", duration);
  }
}

// Initialize notification service
const notificationService = new NotificationService();
window.notificationService = notificationService;
