// Dashboard Lavandero - Pulcro
class LavanderoDashboard {
  constructor() {
    this.firebaseService = window.firebaseService;
    this.currentUser = null;
    this.currentOrderId = null;
    this.init();
  }

  async init() {
    console.log("🚀 Inicializando Dashboard de Lavandero...");
    
    // Check authentication
    this.firebaseService.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("✅ Usuario autenticado:", user.email);
        this.currentUser = user;
        await this.loadUserData();
        this.displayUserInfo();
        this.subscribeToOrders();
        this.setupEventListeners();
        this.showSection('pending-orders');
        console.log("🎉 Dashboard de Lavandero inicializado correctamente");
      } else {
        console.log("❌ Usuario no autenticado, redirigiendo...");
        // Redirect to main page if not authenticated
        window.location.href = "/index.html";
      }
    });
  }

  async loadUserData() {
    try {
      this.userData = await this.firebaseService.getUserData(this.currentUser.uid, 'lavandero');
      if (!this.userData) {
        // User is not a lavandero, redirect to main page
        console.log("❌ Usuario no es un lavandero, redirigiendo...");
        window.location.href = "/index.html";
        return;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      window.location.href = "/index.html";
    }
  }

  displayUserInfo() {
    const userEmailElement = document.getElementById("userEmail");
    if (userEmailElement) {
      userEmailElement.textContent = this.currentUser.email;
    }
  }

  setupEventListeners() {
    // Close modal when clicking outside
    window.onclick = (event) => {
      const modal = document.getElementById("orderDetailsModal");
      if (event.target === modal) {
        this.closeOrderDetailsModal();
      }
    };

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      const navMenu = document.getElementById('navMenu');
      const navToggle = document.querySelector('.nav-toggle');
      
      if (navMenu && navMenu.classList.contains('active') &&
          !navMenu.contains(event.target) &&
          !navToggle.contains(event.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Add active class to corresponding nav item
    const navItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (navItem) {
      navItem.classList.add('active');
    }
  }

  subscribeToOrders() {
    console.log("🔄 Suscribiéndose a pedidos para lavandero:", this.currentUser.uid);
    
    // Limpiar suscripciones anteriores si existen
    if (this.unsubscribeAvailable) {
      console.log("🧹 Limpiando suscripción anterior de pedidos disponibles");
      this.unsubscribeAvailable();
    }
    if (this.unsubscribeMine) {
      console.log("🧹 Limpiando suscripción anterior de pedidos del lavandero");
      this.unsubscribeMine();
    }
    
    // Suscripción a pedidos pendientes disponibles usando Firebase Service
    console.log("📡 Iniciando suscripción a pedidos pendientes...");
    this.unsubscribeAvailable = window.firebaseService.subscribeToPendingOrders((snapshot) => {
      console.log("📊 Cambios en pedidos pendientes detectados, tamaño:", snapshot.size);
      const pendingOrders = [];
      
      // Procesar cambios en el snapshot
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          console.log("🗑️ Pedido eliminado:", change.doc.id);
        } else if (change.type === 'added') {
          console.log("➕ Pedido agregado:", change.doc.id);
        } else if (change.type === 'modified') {
          console.log("✏️ Pedido modificado:", change.doc.id);
        }
      });
      
      snapshot.forEach((doc) => {
        const orderData = doc.data();
        console.log("🔍 Revisando pedido:", doc.id, "lavanderoId:", orderData.lavanderoId);
        // Verificar que no tenga lavandero asignado
        if (!orderData.lavanderoId || orderData.lavanderoId === null) {
          pendingOrders.push({ id: doc.id, ...orderData });
          console.log("✅ Pedido disponible agregado:", doc.id);
        } else {
          console.log("❌ Pedido ya asignado:", doc.id, "a lavandero:", orderData.lavanderoId);
        }
      });
      console.log("📋 Total pedidos pendientes disponibles:", pendingOrders.length);
      this.displayOrdersInTab("pending", pendingOrders);
    });

    // Suscripción a pedidos del lavandero usando Firebase Service
    console.log("📡 Iniciando suscripción a pedidos del lavandero...");
    this.unsubscribeMine = window.firebaseService.subscribeToLavanderoOrders(this.currentUser.uid, (snapshot) => {
      console.log("📊 Cambios en pedidos del lavandero detectados, tamaño:", snapshot.size);
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      console.log("📋 Total pedidos del lavandero:", orders.length);
      
      // Agrupar por estado
      const inProgressOrders = orders.filter(order => order.status === "in-progress");
      const completedOrders = orders.filter(order => order.status === "completed");
      
      console.log("📊 Pedidos por estado - En progreso:", inProgressOrders.length, "Completados:", completedOrders.length);
      
      // NO sobrescribir los pedidos pendientes aquí, solo mostrar los del lavandero
      this.displayOrdersInTab("in-progress", inProgressOrders);
      this.displayOrdersInTab("completed", completedOrders);
    });
  }

  displayOrdersInTab(tabName, orders) {
    console.log(`🖼️ Mostrando pedidos en tab: ${tabName}, cantidad: ${orders.length}`);
    const container = document.getElementById(`${tabName}-orders-container`);
    if (!container) {
      console.error(`❌ Contenedor no encontrado: ${tabName}-orders-container`);
      return;
    }

    if (orders.length === 0) {
      console.log(`📭 No hay pedidos para mostrar en ${tabName}`);
      container.innerHTML = `
        <div class="order-card">
          <p style="text-align: center; color: #64748b;">
            No hay pedidos ${this.getStatusText(tabName).toLowerCase()}.
          </p>
        </div>
      `;
    } else {
      console.log(`✅ Renderizando ${orders.length} pedidos en ${tabName}`);
      container.innerHTML = "";
      orders.forEach((order) => {
        const orderElement = this.createOrderCard(order.id, order);
        container.appendChild(orderElement);
      });
    }
  }

  createOrderCard(orderId, order) {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const statusClass = this.getStatusClass(order.status || order.estado);
    const statusText = this.getStatusText(order.status || order.estado);
    const isPending = (order.status || order.estado) === "pending" && (!order.lavanderoId || order.lavanderoId === null);

    // Formatear fecha de creación
    const createdAt = order.createdAt ? 
      new Date(order.createdAt.seconds * 1000).toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A';

    orderCard.innerHTML = `
      <div class="order-header">
        <span class="order-id">#${orderId.slice(-6)}</span>
        <span class="order-status ${statusClass}">${statusText}</span>
      </div>
      
      ${isPending ? `
        <div class="order-alert">
          <i class="fas fa-exclamation-circle"></i>
          <span>¡Nuevo pedido disponible para tomar!</span>
        </div>
      ` : ''}
      
      <div class="order-summary">
        <div class="delivery-info">
          <h4><i class="fas fa-map-marker-alt"></i> Información de Entrega</h4>
          <div class="delivery-details">
            <div class="delivery-item">
              <i class="fas fa-map-pin"></i>
              <span class="delivery-address">${order.direccion || 'No especificada'}</span>
            </div>
            <div class="delivery-item">
              <i class="fas fa-calendar"></i>
              <span>${order.pickupDate || 'N/A'}</span>
            </div>
            <div class="delivery-item">
              <i class="fas fa-clock"></i>
              <span>${order.pickupTime || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div class="order-preview">
          <div class="preview-item">
            <i class="fas fa-user"></i>
            <span>${order.clienteName || order.clienteEmail || 'Cliente'}</span>
          </div>
          <div class="preview-item">
            <i class="fas fa-tshirt"></i>
            <span>${this.getServiceText(order.serviceType)}</span>
          </div>
          <div class="preview-item">
            <i class="fas fa-dollar-sign"></i>
            <span class="price">$${order.totalPrice ? order.totalPrice.toLocaleString("es-CO") : 'N/A'} COP</span>
          </div>
        </div>
      </div>
      
      <div class="order-actions">
        ${this.getOrderActions(orderId, order)}
      </div>
    `;

    return orderCard;
  }

  getOrderActions(orderId, order) {
    const status = order.status || order.estado;
    
    if (status === "pending" && (!order.lavanderoId || order.lavanderoId === null)) {
      return `
        <div class="action-buttons">
          <button class="btn-accept" onclick="startOrder('${orderId}')">
            <i class="fas fa-hand-paper"></i> 
            <span>Aceptar Pedido</span>
            <small>Pasará automáticamente a "En Progreso"</small>
          </button>
          <button class="btn-secondary" onclick="viewOrderDetails('${orderId}')">
            <i class="fas fa-eye"></i> Ver Detalles Completos
          </button>
        </div>
      `;
    } else if (status === "in-progress") {
      return `
        <div class="action-buttons">
          <button class="btn-primary" onclick="completeOrder('${orderId}')">
            <i class="fas fa-check"></i> Marcar como Completado
          </button>
          <button class="btn-secondary" onclick="viewOrderDetails('${orderId}')">
            <i class="fas fa-eye"></i> Ver Detalles
          </button>
        </div>
      `;
    } else {
      return `
        <div class="action-buttons">
          <button class="btn-secondary" onclick="viewOrderDetails('${orderId}')">
            <i class="fas fa-eye"></i> Ver Detalles
          </button>
        </div>
      `;
    }
  }

  getStatusClass(status) {
    const statusClasses = {
      "pending": "pending",
      "pendiente": "pending",
      "in-progress": "in-progress",
      "en progreso": "in-progress",
      "completed": "completed",
      "completado": "completed",
      "cancelled": "cancelled",
      "cancelado": "cancelled"
    };
    return statusClasses[status] || "pending";
  }

  getStatusText(status) {
    const statusTexts = {
      "pending": "Pendiente",
      "pendiente": "Pendiente",
      "in-progress": "En Progreso",
      "en progreso": "En Progreso",
      "completed": "Completado",
      "completado": "Completado",
      "cancelled": "Cancelado",
      "cancelado": "Cancelado"
    };
    return statusTexts[status] || "Pendiente";
  }

  getServiceText(serviceType) {
    const serviceTexts = {
      "lavado-planchado": "Lavado y Planchado",
      "lavado": "Lavado",
      "zapatos": "Lavado de Zapatos",
      "hogar": "Ropa de Hogar",
    };
    return serviceTexts[serviceType] || serviceType;
  }

  async startOrder(orderId) {
    try {
      this.showLoading(true);
      
      // Usar el servicio centralizado para tomar el pedido
      await window.firebaseService.takeOrder(orderId, this.currentUser.uid);
      
      this.showNotification("¡Pedido tomado exitosamente!", "success");
      
    } catch (error) {
      console.error("Error taking order:", error);
      this.showNotification(error.message || "Error al tomar el pedido", "error");
    } finally {
      this.showLoading(false);
    }
  }

  async completeOrder(orderId) {
    try {
      this.showLoading(true);
      
      // Usar el servicio centralizado para completar el pedido
      await window.firebaseService.completeOrder(orderId);
      
      this.showNotification("¡Pedido completado exitosamente!", "success");
      
    } catch (error) {
      console.error("Error completing order:", error);
      this.showNotification("Error al completar el pedido", "error");
    } finally {
      this.showLoading(false);
    }
  }

  async viewOrderDetails(orderId) {
    try {
      const order = await this.firebaseService.getOrder(orderId);
      if (order) {
        this.currentOrderId = orderId;
        this.displayOrderDetails(order);
        this.openOrderDetailsModal();
      } else {
        this.showNotification("Pedido no encontrado", "error");
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      this.showNotification("Error al cargar los detalles del pedido", "error");
    }
  }

  displayOrderDetails(order) {
    const content = document.getElementById("orderDetailsContent");
    content.innerHTML = `
      <div class="order-details">
        <div class="order-detail">
          <label>ID del Pedido</label>
          <span>#${this.currentOrderId.slice(-6)}</span>
        </div>
        <div class="order-detail">
          <label>Cliente</label>
          <span>${order.clienteName || order.clienteEmail || 'N/A'}</span>
        </div>
        <div class="order-detail">
          <label>Email del Cliente</label>
          <span>${order.clienteEmail || 'N/A'}</span>
        </div>
        <div class="order-detail">
          <label>Descripción</label>
          <span>${order.descripcion || 'Sin descripción'}</span>
        </div>
        <div class="order-detail">
          <label>Dirección</label>
          <span>${order.direccion || 'No especificada'}</span>
        </div>
        <div class="order-detail">
          <label>Teléfono</label>
          <span>${order.telefono || 'No especificado'}</span>
        </div>
        <div class="order-detail">
          <label>Servicio</label>
          <span>${this.getServiceText(order.serviceType)}</span>
        </div>
        <div class="order-detail">
          <label>Peso</label>
          <span>${order.weight || 'N/A'} kg</span>
        </div>
        <div class="order-detail">
          <label>Precio Total</label>
          <span>$${order.totalPrice ? order.totalPrice.toLocaleString("es-CO") : 'N/A'} COP</span>
        </div>
        <div class="order-detail">
          <label>Fecha de Recogida</label>
          <span>${order.pickupDate || 'N/A'}</span>
        </div>
        <div class="order-detail">
          <label>Hora de Recogida</label>
          <span>${order.pickupTime || 'N/A'}</span>
        </div>
        <div class="order-detail">
          <label>Instrucciones Especiales</label>
          <span>${order.specialInstructions || 'Ninguna'}</span>
        </div>
        <div class="order-detail">
          <label>Estado</label>
          <span class="order-status ${this.getStatusClass(order.status || order.estado)}">${this.getStatusText(order.status || order.estado)}</span>
        </div>
        <div class="order-detail">
          <label>Fecha de Creación</label>
          <span>${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : 'N/A'}</span>
        </div>
      </div>
    `;
  }

  openOrderDetailsModal() {
    document.getElementById("orderDetailsModal").classList.add("active");
  }

  closeOrderDetailsModal() {
    document.getElementById("orderDetailsModal").classList.remove("active");
    this.currentOrderId = null;
  }

  showLoading(show) {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      if (show) {
        loadingOverlay.classList.add("active");
      } else {
        loadingOverlay.classList.remove("active");
      }
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  logout() {
    // Limpiar listeners antes de cerrar sesión
    if (this.unsubscribeAvailable) {
      this.unsubscribeAvailable();
    }
    if (this.unsubscribeMine) {
      this.unsubscribeMine();
    }
    
    window.firebaseAuth
      .signOut()
      .then(() => {
        window.location.href = "/index.html";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }
}

// Global functions for navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active class from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Add active class to corresponding nav item
  const navItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
  if (navItem) {
    navItem.classList.add('active');
  }
}


// Global functions for navigation
function toggleNavMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("active");
}

function closeNavMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.remove("active");
}

// Global functions for order actions
function startOrder(orderId) {
  if (window.lavanderoDashboard) {
    window.lavanderoDashboard.startOrder(orderId);
  }
}

function completeOrder(orderId) {
  if (window.lavanderoDashboard) {
    window.lavanderoDashboard.completeOrder(orderId);
  }
}

function viewOrderDetails(orderId) {
  if (window.lavanderoDashboard) {
    window.lavanderoDashboard.viewOrderDetails(orderId);
  }
}

function closeOrderDetailsModal() {
  if (window.lavanderoDashboard) {
    window.lavanderoDashboard.closeOrderDetailsModal();
  }
}

function updateOrderStatus() {
  if (window.lavanderoDashboard && window.lavanderoDashboard.currentOrderId) {
    const orderId = window.lavanderoDashboard.currentOrderId;
    const status = window.lavanderoDashboard.getStatusText(
      document.querySelector('.order-status').textContent
    );
    
    if (status === "Pendiente") {
      window.lavanderoDashboard.startOrder(orderId);
    } else if (status === "En Progreso") {
      window.lavanderoDashboard.completeOrder(orderId);
    }
  }
}

// Scroll to top functionality
function setupScrollToTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// Initialize dashboard
let lavanderoDashboard;
document.addEventListener("DOMContentLoaded", () => {
  lavanderoDashboard = new LavanderoDashboard();
  window.lavanderoDashboard = lavanderoDashboard;
  setupScrollToTop();
});

function logout() {
  if (window.lavanderoDashboard) {
    window.lavanderoDashboard.logout();
  }
}
