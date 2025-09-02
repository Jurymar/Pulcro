// Dashboard Cliente - Pulcro
class ClienteDashboard {
  constructor() {
    this.auth = window.firebaseAuth;
    this.db = window.firebaseDB;
    this.currentUser = null;
    this.init();
  }

  async init() {
    // Check authentication
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.currentUser = user;
        await this.loadUserData();
        this.displayUserInfo();
        await this.loadRecentOrders();
        this.setupEventListeners();
      } else {
        // Redirect to main page if not authenticated
        window.location.href = "/index.html";
      }
    });
  }

  async loadUserData() {
    try {
      const userDoc = await this.db
        .collection("clientes")
        .doc(this.currentUser.uid)
        .get();
      if (userDoc.exists) {
        this.userData = userDoc.data();
      } else {
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
    if (userEmailElement) {
      userEmailElement.textContent = this.currentUser.email;
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

    // Express service checkbox
    const expressCheckbox = document.getElementById("expressService");
    if (expressCheckbox) {
      expressCheckbox.addEventListener("change", () =>
        this.updateOrderSummary()
      );
    }

    // Set minimum date for pickup
    const pickupDateInput = document.getElementById("pickupDate");
    if (pickupDateInput) {
      const today = new Date().toISOString().split("T")[0];
      pickupDateInput.min = today;
    }
  }

  async loadRecentOrders() {
    try {
      const ordersQuery = await this.db
        .collection("pedidos")
        .where("clienteId", "==", this.currentUser.uid)
        .orderBy("createdAt", "desc")
        .limit(5)
        .get();

      const ordersList = document.getElementById("ordersList");
      if (ordersList) {
        if (ordersQuery.empty) {
          ordersList.innerHTML = `
                        <div class="order-card">
                            <p style="text-align: center; color: #64748b;">
                                No tienes pedidos recientes. ¡Crea tu primer pedido!
                            </p>
                        </div>
                    `;
        } else {
          ordersList.innerHTML = "";
          ordersQuery.forEach((doc) => {
            const order = doc.data();
            const orderElement = this.createOrderCard(doc.id, order);
            ordersList.appendChild(orderElement);
          });
        }
      }
    } catch (error) {
      console.error("Error loading orders:", error);
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
                    <label>Servicio</label>
                    <span>${this.getServiceText(order.serviceType)}</span>
                </div>
                <div class="order-detail">
                    <label>Peso</label>
                    <span>${order.weight} kg</span>
                </div>
                <div class="order-detail">
                    <label>Precio</label>
                    <span>$${order.totalPrice.toLocaleString(
                      "es-CO"
                    )} COP</span>
                </div>
                <div class="order-detail">
                    <label>Fecha de Recogida</label>
                    <span>${new Date(
                      order.pickupDate
                    ).toLocaleDateString()}</span>
                </div>
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

  updateOrderSummary() {
    const serviceType = document.getElementById("serviceType").value;
    const weight = parseFloat(document.getElementById("weight").value) || 0;

    const summaryDiv = document.getElementById("orderSummary");

    if (!serviceType || weight === 0) {
      summaryDiv.innerHTML =
        "<p>Selecciona un servicio y peso para ver el precio</p>";
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
    const specialInstructions = document.getElementById(
      "specialInstructions"
    ).value;

    if (!serviceType || !weight || !pickupDate || !pickupTime) {
      this.showNotification(
        "Por favor completa todos los campos requeridos",
        "error"
      );
      return;
    }

    const totalPrice = this.calculateBasePrice(serviceType, weight);

    try {
      const orderData = {
        clienteId: this.currentUser.uid,
        clienteEmail: this.currentUser.email,
        clienteName: this.userData?.name || "Cliente",
        serviceType: serviceType,
        weight: weight,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        specialInstructions: specialInstructions,
        totalPrice: totalPrice,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await this.db.collection("pedidos").add(orderData);

      this.showNotification("¡Pedido creado exitosamente!", "success");
      this.closeNewOrderModal();
      await this.loadRecentOrders();

      // Reset form
      e.target.reset();
      document.getElementById("orderSummary").innerHTML =
        "<p>Selecciona un servicio para ver el precio</p>";
    } catch (error) {
      console.error("Error creating order:", error);
      this.showNotification(
        "Error al crear el pedido. Intenta de nuevo.",
        "error"
      );
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
function openNewOrderModal() {
  document.getElementById("newOrderModal").style.display = "block";
}

function closeNewOrderModal() {
  document.getElementById("newOrderModal").style.display = "none";
}

function viewMyOrders() {
  // TODO: Implement view all orders page
  alert("Función en desarrollo - Ver todos los pedidos");
}

function viewProfile() {
  // TODO: Implement profile page
  alert("Función en desarrollo - Ver perfil");
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

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("newOrderModal");
  if (event.target === modal) {
    closeNewOrderModal();
  }
};

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  new ClienteDashboard();
});
