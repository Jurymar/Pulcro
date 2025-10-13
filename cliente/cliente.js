// Dashboard Cliente - Pulcro
class ClienteDashboard {
  constructor() {
    this.firebaseService = window.firebaseService;
    this.currentUser = null;
    this.userData = null;
    this.currentFilter = 'all';
    this.currentOrders = [];
    this.init();
  }

  async init() {
    // Check authentication
    this.firebaseService.onAuthStateChanged(async (user) => {
      if (user) {
        this.currentUser = user;
        await this.loadUserData();
        this.displayUserInfo();
        this.setupEventListeners();
        this.subscribeToMyOrders();
        showSection('dashboard');
      } else {
        // Redirect to main page if not authenticated
        window.location.href = "/index.html";
      }
    });
  }

  async loadUserData() {
    try {
      this.userData = await this.firebaseService.getUserData(this.currentUser.uid, 'cliente');
      if (!this.userData) {
        // User is not a cliente, redirect to main page
        console.log("❌ Usuario no es un cliente, redirigiendo...");
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
    const profileNameElement = document.getElementById("profileName");
    const profileEmailElement = document.getElementById("profileEmail");
    
    if (userEmailElement) {
      userEmailElement.textContent = this.currentUser.email;
    }
    if (profileNameElement) {
      profileNameElement.textContent = this.userData?.name || "Cliente";
    }
    if (profileEmailElement) {
      profileEmailElement.textContent = this.currentUser.email;
    }
  }

  setupEventListeners() {
    // Order form submission
    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
      orderForm.addEventListener("submit", (e) =>
        this.handleOrderSubmission(e)
      );
    }

    // Profile form submission
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) =>
        this.handleProfileUpdate(e)
      );
    }

    // Service type change for price calculation
    const serviceTypeSelect = document.getElementById("serviceType");
    if (serviceTypeSelect) {
      serviceTypeSelect.addEventListener("change", () =>
        this.updateOrderSummary()
      );
    }

    // Weight change for price calculation
    const weightInput = document.getElementById("weight");
    if (weightInput) {
      weightInput.addEventListener("input", () => this.updateOrderSummary());
    }

    // Set minimum date for pickup
    const pickupDateInput = document.getElementById("pickupDate");
    if (pickupDateInput) {
      const today = new Date().toISOString().split("T")[0];
      pickupDateInput.min = today;
    }

    // Load profile data when profile section is shown
    const profileSection = document.getElementById("profile");
    if (profileSection) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (profileSection.classList.contains('active')) {
              this.loadProfileData();
            }
          }
        });
      });
      observer.observe(profileSection, { attributes: true });
    }
  }

  subscribeToMyOrders() {
    console.log("🔄 Suscribiéndose a pedidos del cliente:", this.currentUser.uid);
    
    // Limpiar suscripción anterior si existe
    if (this.unsubscribeMyOrders) {
      this.unsubscribeMyOrders();
    }
    
    // Usar el servicio centralizado para suscribirse a pedidos del cliente
    this.unsubscribeMyOrders = this.firebaseService.subscribeToClientOrders(this.currentUser.uid, (snapshot) => {
      console.log("📊 Cambios en pedidos del cliente detectados, tamaño:", snapshot.size);
      
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
      
      const orders = [];
      snapshot.forEach((doc) => {
        const orderData = { id: doc.id, ...doc.data() };
        console.log("📋 Pedido encontrado:", orderData);
        orders.push(orderData);
      });
      
      console.log("📊 Total pedidos cargados:", orders.length);
      
      // Guardar pedidos actuales para filtros
      this.currentOrders = orders;
      
      this.updateOrdersDisplay(orders);
    }, (error) => {
      console.error("❌ Error en suscripción a pedidos:", error);
    });
  }

  updateOrdersDisplay(orders) {
    // Update active orders
    this.updateActiveOrders(orders);
    
    // Update order history
    this.updateOrderHistory(orders);
  }


  updateActiveOrders(orders) {
    console.log("🔄 Actualizando pedidos activos, total pedidos:", orders.length);
    
    // Update desktop container
    const container = document.getElementById("activeOrdersContainer");
    if (!container) {
      console.error("❌ No se encontró el contenedor activeOrdersContainer");
    } else {
      this.renderActiveOrders(container, orders);
    }

    // Update mobile container
    const mobileContainer = document.getElementById("mobileActiveOrdersContainer");
    if (mobileContainer) {
      this.renderActiveOrders(mobileContainer, orders);
    }
  }

  renderActiveOrders(container, orders) {
    const activeOrders = orders.filter(order => {
      const status = order.status || order.estado;
      const isActive = status === "pending" || status === "in-progress" || 
                       status === "pendiente" || status === "en progreso";
      console.log(`🔍 Pedido ${order.id}: estado="${status}", activo=${isActive}`);
      return isActive;
    });
    
    console.log("📊 Pedidos activos filtrados:", activeOrders.length);
    
    if (activeOrders.length === 0) {
      container.innerHTML = `
        <div class="order-card">
          <p style="text-align: center; color: #64748b;">
            No tienes pedidos activos.
          </p>
        </div>
      `;
    } else {
      container.innerHTML = "";
      activeOrders.forEach((order) => {
        console.log("➕ Renderizando pedido activo:", order.id);
        const orderElement = this.createOrderCard(order.id, order);
        container.appendChild(orderElement);
      });
    }
  }

  updateOrderHistory(orders) {
    console.log("🔄 Actualizando historial de pedidos, total pedidos:", orders.length);
    const container = document.getElementById("orderHistoryContainer");
    if (!container) {
      console.error("❌ No se encontró el contenedor orderHistoryContainer");
      return;
    }

    let filteredOrders = orders;
    
    if (this.currentFilter !== 'all') {
      filteredOrders = orders.filter(order => {
        const status = order.status || order.estado;
        return status === this.currentFilter;
      });
    }
    
    console.log("📊 Pedidos filtrados para historial:", filteredOrders.length, "filtro:", this.currentFilter);
    
    if (filteredOrders.length === 0) {
      container.innerHTML = `
        <div class="order-card">
          <p style="text-align: center; color: #64748b;">
            No hay pedidos ${this.getStatusText(this.currentFilter).toLowerCase()}.
          </p>
        </div>
      `;
    } else {
      container.innerHTML = "";
      filteredOrders.forEach((order) => {
        console.log("➕ Renderizando pedido en historial:", order.id);
        const orderElement = this.createOrderCard(order.id, order);
        container.appendChild(orderElement);
      });
    }
  }

  createOrderCard(orderId, order, isPreview = false) {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const statusClass = this.getStatusClass(order.status || order.estado);
    const statusText = this.getStatusText(order.status || order.estado);

    const actions = isPreview ? '' : this.getOrderActions(orderId, order);

    orderCard.innerHTML = `
      <div class="order-header">
        <span class="order-id">#${orderId.slice(-6)}</span>
        <span class="order-status ${statusClass}">${statusText}</span>
      </div>
      <div class="order-details">
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
          <label>Precio</label>
          <span>$${order.totalPrice ? order.totalPrice.toLocaleString("es-CO") : 'N/A'} COP</span>
        </div>
        <div class="order-detail">
          <label>Fecha de Creación</label>
          <span>${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
        </div>
        ${order.pickupDate ? `
        <div class="order-detail">
          <label>Fecha de Recogida</label>
          <span>${new Date(order.pickupDate).toLocaleDateString()}</span>
        </div>
        ` : ''}
      </div>
      ${actions ? `<div class="order-actions">${actions}</div>` : ''}
    `;

    return orderCard;
  }

  getOrderActions(orderId, order) {
    const status = order.status || order.estado;
    
    if (status === "pending" || status === "pendiente") {
      return `
        <button class="btn-action danger" onclick="window.clienteDashboard.deleteOrder('${orderId}')">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      `;
    }
    
    return '';
  }

  getStatusClass(status) {
    const statusClasses = {
      "pendiente": "pending",
      "en progreso": "in-progress",
      "completado": "completed",
      "cancelado": "cancelled",
      "pending": "pending",
      "in-progress": "in-progress",
      "completed": "completed",
      "cancelled": "cancelled",
    };
    return statusClasses[status] || "pending";
  }

  getStatusText(status) {
    const statusTexts = {
      "pendiente": "Pendiente",
      "en progreso": "En Progreso",
      "completado": "Completado",
      "cancelado": "Cancelado",
      "pending": "Pendiente",
      "in-progress": "En Progreso",
      "completed": "Completado",
      "cancelled": "Cancelado",
    };
    return statusTexts[status] || "Pendiente";
  }

  updateOrderSummary() {
    const serviceType = document.getElementById("serviceType").value;
    const weight = parseFloat(document.getElementById("weight").value) || 0;

    const summaryDiv = document.getElementById("orderSummary");

    if (!serviceType || weight === 0) {
      summaryDiv.innerHTML = "<p>Selecciona un servicio y peso para ver el precio</p>";
      return;
    }

    const totalPrice = this.calculateBasePrice(serviceType, weight);

    summaryDiv.innerHTML = `
      <div style="display: grid; gap: 0.5rem;">
        <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #e2e8f0; padding-top: 0.5rem;">
          <span>Total:</span>
          <span>$${totalPrice.toLocaleString("es-CO")} COP</span>
        </div>
      </div>
    `;
  }

  calculateBasePrice(serviceType, weight) {
    const prices = {
      "lavado-planchado": 60000,
      lavado: 48000,
      zapatos: 80000,
      hogar: 72000,
    };

    const basePrice = prices[serviceType] || 60000;
    return basePrice * weight;
  }

  async handleOrderSubmission(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const serviceType = document.getElementById("serviceType").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const pickupDate = document.getElementById("pickupDate").value;
    const pickupTime = document.getElementById("pickupTime").value;
    const specialInstructions = document.getElementById("specialInstructions").value;

    if (!serviceType || !weight || !pickupDate || !pickupTime) {
      this.showNotification("Por favor completa todos los campos requeridos", "error");
      return;
    }

    const totalPrice = this.calculateBasePrice(serviceType, weight);

    try {
      this.showLoading(true);
      
      // Crear pedido con la estructura requerida
      const orderData = {
        clienteId: this.currentUser.uid,
        descripcion: `Servicio: ${this.getServiceText(serviceType)}, Peso: ${weight}kg, Fecha: ${pickupDate} ${pickupTime}${specialInstructions ? ', Instrucciones: ' + specialInstructions : ''}`,
        direccion: this.userData?.address || "Dirección no especificada",
        telefono: this.userData?.phone || "Teléfono no especificado",
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lavanderoId: null,
        // Campos adicionales para compatibilidad con el sistema existente
        clienteEmail: this.currentUser.email,
        clienteName: this.userData?.name || "Cliente",
        serviceType: serviceType,
        weight: weight,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        specialInstructions: specialInstructions,
        totalPrice: totalPrice,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Mantener compatibilidad con sistema anterior
        estado: "pendiente",
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await this.firebaseService.createOrder(orderData);

      this.showNotification("¡Pedido creado exitosamente!", "success");
      this.closeNewOrderModal();
      
      // Reset form
      e.target.reset();
      document.getElementById("orderSummary").innerHTML = "<p>Selecciona un servicio para ver el precio</p>";
      
      // Forzar actualización de la vista
      console.log("🔄 Forzando actualización de pedidos después de crear uno nuevo");
      this.subscribeToMyOrders();
      
    } catch (error) {
      console.error("Error creating order:", error);
      this.showNotification("Error al crear el pedido. Intenta de nuevo.", "error");
    } finally {
      this.showLoading(false);
    }
  }

  getServiceText(serviceType) {
    const serviceTexts = {
      "lavado-planchado": "Lavado y Planchado",
      zapatos: "Lavado de Zapatos",
      hogar: "Ropa de Hogar",
    };
    return serviceTexts[serviceType] || serviceType;
  }

  async deleteOrder(orderId) {
    if (!confirm("¿Estás seguro de que quieres eliminar este pedido?")) {
      return;
    }

    try {
      this.showLoading(true);
      await this.firebaseService.deleteOrder(orderId);
      this.showNotification("Pedido eliminado exitosamente", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      this.showNotification("Error al eliminar el pedido", "error");
    } finally {
      this.showLoading(false);
    }
  }

  loadProfileData() {
    const addressInput = document.getElementById("profileAddress");
    const phoneInput = document.getElementById("profilePhone");
    
    if (addressInput) {
      addressInput.value = this.userData?.address || "";
    }
    if (phoneInput) {
      phoneInput.value = this.userData?.phone || "";
    }
  }

  async handleProfileUpdate(e) {
    e.preventDefault();

    const address = document.getElementById("profileAddress").value;
    const phone = document.getElementById("profilePhone").value;

    try {
      this.showLoading(true);
      
      await this.db.collection("clientes").doc(this.currentUser.uid).update({
        address: address,
        phone: phone,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update local user data
      this.userData.address = address;
      this.userData.phone = phone;

      this.showNotification("Perfil actualizado exitosamente", "success");
      
    } catch (error) {
      console.error("Error updating profile:", error);
      this.showNotification("Error al actualizar el perfil", "error");
    } finally {
      this.showLoading(false);
    }
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

}

// Global functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

function filterOrders(filter) {
  if (window.clienteDashboard) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update current filter
    window.clienteDashboard.currentFilter = filter;
    
    // Refresh orders display with current orders
    if (window.clienteDashboard.currentOrders) {
      window.clienteDashboard.updateOrderHistory(window.clienteDashboard.currentOrders);
    }
  }
}

function openNewOrderModal() {
  document.getElementById("newOrderModal").classList.add("active");
}

function closeNewOrderModal() {
  document.getElementById("newOrderModal").classList.remove("active");
}

function logout() {
  // Limpiar listeners antes de cerrar sesión
  if (window.clienteDashboard && window.clienteDashboard.unsubscribeMyOrders) {
    window.clienteDashboard.unsubscribeMyOrders();
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

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("newOrderModal");
  
  if (event.target === modal) {
    closeNewOrderModal();
  }
};

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  window.clienteDashboard = new ClienteDashboard();
});