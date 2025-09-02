// Dashboard Lavandero - Pulcro
class LavanderoDashboard {
  constructor() {
    this.auth = window.firebaseAuth;
    this.db = window.firebaseDB;
    this.currentUser = null;
    this.currentOrderId = null;
    this.init();
  }

  async init() {
    // Check authentication
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.currentUser = user;
        await this.loadUserData();
        this.displayUserInfo();
        await this.loadOrders();
        this.setupEventListeners();
        this.updateStats();
      } else {
        // Redirect to main page if not authenticated
        window.location.href = "/index.html";
      }
    });
  }

  async loadUserData() {
    try {
      const userDoc = await this.db
        .collection("lavanderos")
        .doc(this.currentUser.uid)
        .get();
      if (userDoc.exists) {
        this.userData = userDoc.data();
      } else {
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
    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.switchTab(button.dataset.tab);
      });
    });

    // Close modal when clicking outside
    window.onclick = (event) => {
      const modal = document.getElementById("orderDetailsModal");
      if (event.target === modal) {
        this.closeOrderDetailsModal();
      }
    };
  }

  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update active orders list
    document.querySelectorAll(".orders-list").forEach((list) => {
      list.classList.remove("active");
    });
    document.getElementById(`${tabName}-orders`).classList.add("active");
  }

  async loadOrders() {
    try {
      // Load all orders for this lavandero
      const ordersQuery = await this.db
        .collection("pedidos")
        .where("lavanderoId", "==", this.currentUser.uid)
        .orderBy("createdAt", "desc")
        .get();

      const orders = [];
      ordersQuery.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      this.displayOrders(orders);
      this.updateStats(orders);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  }

  displayOrders(orders) {
    // Group orders by status
    const pendingOrders = orders.filter((order) => order.status === "pending");
    const inProgressOrders = orders.filter(
      (order) => order.status === "in-progress"
    );
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    );

    // Display orders in respective tabs
    this.displayOrdersInTab("pending", pendingOrders);
    this.displayOrdersInTab("in-progress", inProgressOrders);
    this.displayOrdersInTab("completed", completedOrders);
    this.displayOrdersInTab("all", orders);
  }

  displayOrdersInTab(tabName, orders) {
    const ordersGrid = document.querySelector(
      `#${tabName}-orders .orders-grid`
    );

    if (orders.length === 0) {
      ordersGrid.innerHTML = `
                <div class="order-card">
                    <p style="text-align: center; color: #64748b;">
                        No hay pedidos ${this.getStatusText(
                          tabName
                        ).toLowerCase()}.
                    </p>
                </div>
            `;
    } else {
      ordersGrid.innerHTML = "";
      orders.forEach((order) => {
        const orderElement = this.createOrderCard(order.id, order);
        ordersGrid.appendChild(orderElement);
      });
    }
  }

  createOrderCard(orderId, order) {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const statusClass = this.getStatusClass(order.status);
    const statusText = this.getStatusText(order.status);

    orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">#${orderId.slice(-6)}</span>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            <div class="order-details">
                <div class="order-detail">
                    <label>Cliente</label>
                    <span>${order.clienteName}</span>
                </div>
                <div class="order-detail">
                    <label>Servicio</label>
                    <span>${this.getServiceText(order.serviceType)}</span>
                </div>
                <div class="order-detail">
                    <label>Peso</label>
                    <span>${order.weight} kg</span>
                </div>
                <div class="order-detail">
                    <label>Precio</label>
                    <span>$${order.totalPrice}</span>
                </div>
                <div class="order-detail">
                    <label>Fecha Recogida</label>
                    <span>${new Date(
                      order.pickupDate
                    ).toLocaleDateString()}</span>
                </div>
                <div class="order-detail">
                    <label>Hora</label>
                    <span>${order.pickupTime}</span>
                </div>
            </div>
            <div class="order-actions">
                <button class="btn-action secondary" onclick="dashboard.viewOrderDetails('${orderId}')">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                ${
                  order.status === "pending"
                    ? `
                <button class="btn-action primary" onclick="dashboard.startOrder('${orderId}')">
                    <i class="fas fa-play"></i> Iniciar
                </button>
                `
                    : ""
                }
                ${
                  order.status === "in-progress"
                    ? `
                <button class="btn-action primary" onclick="dashboard.completeOrder('${orderId}')">
                    <i class="fas fa-check"></i> Completar
                </button>
                `
                    : ""
                }
            </div>
        `;

    return orderCard;
  }

  getStatusClass(status) {
    const statusClasses = {
      pending: "pending",
      "in-progress": "in-progress",
      completed: "completed",
      cancelled: "cancelled",
    };
    return statusClasses[status] || "pending";
  }

  getStatusText(status) {
    const statusTexts = {
      pending: "Pendiente",
      "in-progress": "En Progreso",
      completed: "Completado",
      cancelled: "Cancelado",
    };
    return statusTexts[status] || "Pendiente";
  }

  getServiceText(serviceType) {
    const serviceTexts = {
      "lavado-planchado": "Lavado y Planchado",
      zapatos: "Lavado de Zapatos",
      hogar: "Ropa de Hogar",
    };
    return serviceTexts[serviceType] || serviceType;
  }

  updateStats(orders = []) {
    const pendingCount = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const inProgressCount = orders.filter(
      (order) => order.status === "in-progress"
    ).length;
    const completedCount = orders.filter(
      (order) => order.status === "completed"
    ).length;

    // Calculate today's earnings
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter(
      (order) =>
        order.status === "completed" &&
        order.completedAt &&
        new Date(order.completedAt.toDate()).toISOString().split("T")[0] ===
          today
    );
    const todayEarnings = todayOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Update stats display
    document.getElementById("pendingCount").textContent = pendingCount;
    document.getElementById("inProgressCount").textContent = inProgressCount;
    document.getElementById("completedCount").textContent = completedCount;
    document.getElementById(
      "totalEarnings"
    ).textContent = `$${todayEarnings.toFixed(2)}`;
  }

  async viewOrderDetails(orderId) {
    try {
      const orderDoc = await this.db.collection("pedidos").doc(orderId).get();
      if (orderDoc.exists) {
        const order = orderDoc.data();
        this.currentOrderId = orderId;
        this.displayOrderDetails(order);
        this.openOrderDetailsModal();
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      this.showNotification("Error al cargar los detalles del pedido", "error");
    }
  }

  displayOrderDetails(order) {
    const contentDiv = document.getElementById("orderDetailsContent");

    contentDiv.innerHTML = `
            <div class="order-details-grid">
                <div class="detail-group">
                    <label>ID del Pedido</label>
                    <span>#${this.currentOrderId.slice(-6)}</span>
                </div>
                <div class="detail-group">
                    <label>Cliente</label>
                    <span>${order.clienteName}</span>
                </div>
                <div class="detail-group">
                    <label>Email del Cliente</label>
                    <span>${order.clienteEmail}</span>
                </div>
                <div class="detail-group">
                    <label>Servicio</label>
                    <span>${this.getServiceText(order.serviceType)}</span>
                </div>
                <div class="detail-group">
                    <label>Peso</label>
                    <span>${order.weight} kg</span>
                </div>
                <div class="detail-group">
                    <label>Precio Base</label>
                    <span>$${order.basePrice}</span>
                </div>
                <div class="detail-group">
                    <label>Servicio Express</label>
                    <span>${
                      order.isExpress ? "Sí (+$" + order.expressFee + ")" : "No"
                    }</span>
                </div>
                <div class="detail-group">
                    <label>Precio Total</label>
                    <span>$${order.totalPrice}</span>
                </div>
                <div class="detail-group">
                    <label>Fecha de Recogida</label>
                    <span>${new Date(
                      order.pickupDate
                    ).toLocaleDateString()}</span>
                </div>
                <div class="detail-group">
                    <label>Hora de Recogida</label>
                    <span>${order.pickupTime}</span>
                </div>
                <div class="detail-group">
                    <label>Estado Actual</label>
                    <span class="order-status ${this.getStatusClass(
                      order.status
                    )}">${this.getStatusText(order.status)}</span>
                </div>
            </div>
            ${
              order.specialInstructions
                ? `
            <div class="detail-group">
                <label>Instrucciones Especiales</label>
                <span>${order.specialInstructions}</span>
            </div>
            `
                : ""
            }
            <div class="status-selector">
                <h3>Actualizar Estado del Pedido</h3>
                <div class="status-options">
                    <div class="status-option ${
                      order.status === "pending" ? "selected" : ""
                    }" data-status="pending">
                        Pendiente
                    </div>
                    <div class="status-option ${
                      order.status === "in-progress" ? "selected" : ""
                    }" data-status="in-progress">
                        En Progreso
                    </div>
                    <div class="status-option ${
                      order.status === "completed" ? "selected" : ""
                    }" data-status="completed">
                        Completado
                    </div>
                </div>
            </div>
        `;

    // Add event listeners to status options
    const statusOptions = contentDiv.querySelectorAll(".status-option");
    statusOptions.forEach((option) => {
      option.addEventListener("click", () => {
        statusOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
      });
    });
  }

  openOrderDetailsModal() {
    document.getElementById("orderDetailsModal").style.display = "block";
  }

  closeOrderDetailsModal() {
    document.getElementById("orderDetailsModal").style.display = "none";
    this.currentOrderId = null;
  }

  async updateOrderStatus() {
    if (!this.currentOrderId) return;

    const selectedStatus = document.querySelector(".status-option.selected")
      ?.dataset.status;
    if (!selectedStatus) {
      this.showNotification("Por favor selecciona un estado", "error");
      return;
    }

    try {
      const updateData = {
        status: selectedStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (selectedStatus === "completed") {
        updateData.completedAt =
          firebase.firestore.FieldValue.serverTimestamp();
      }

      await this.db
        .collection("pedidos")
        .doc(this.currentOrderId)
        .update(updateData);

      this.showNotification(
        "Estado del pedido actualizado exitosamente",
        "success"
      );
      this.closeOrderDetailsModal();
      await this.loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      this.showNotification(
        "Error al actualizar el estado del pedido",
        "error"
      );
    }
  }

  async startOrder(orderId) {
    try {
      await this.db.collection("pedidos").doc(orderId).update({
        status: "in-progress",
        lavanderoId: this.currentUser.uid,
        startedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      this.showNotification("Pedido iniciado exitosamente", "success");
      await this.loadOrders();
    } catch (error) {
      console.error("Error starting order:", error);
      this.showNotification("Error al iniciar el pedido", "error");
    }
  }

  async completeOrder(orderId) {
    try {
      await this.db.collection("pedidos").doc(orderId).update({
        status: "completed",
        completedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      this.showNotification("Pedido completado exitosamente", "success");
      await this.loadOrders();
    } catch (error) {
      console.error("Error completing order:", error);
      this.showNotification("Error al completar el pedido", "error");
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

    if (type === "success") {
      notification.style.backgroundColor = "#10b981";
    } else if (type === "error") {
      notification.style.backgroundColor = "#ef4444";
    } else {
      notification.style.backgroundColor = "#3b82f6";
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
}

// Global functions
function closeOrderDetailsModal() {
  dashboard.closeOrderDetailsModal();
}

function updateOrderStatus() {
  dashboard.updateOrderStatus();
}

function logout() {
  window.firebaseAuth
    .signOut()
    .then(() => {
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

// Initialize dashboard
let dashboard;
document.addEventListener("DOMContentLoaded", () => {
  dashboard = new LavanderoDashboard();
});
