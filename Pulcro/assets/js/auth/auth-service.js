// Authentication Service
class AuthService {
  constructor() {
    this.auth = window.firebaseAuth;
    this.db = window.firebaseDB;
    this.setupAuthStateListener();
  }

  // Setup auth state listener
  setupAuthStateListener() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuario autenticado:", user.email);
        this.updateUIForAuthenticatedUser(user);
      } else {
        console.log("Usuario no autenticado");
        this.updateUIForUnauthenticatedUser();
      }
    });
  }

  // Update UI for authenticated user
  updateUIForAuthenticatedUser(user) {
    console.log("🔄 Actualizando UI para usuario autenticado:", user.email);

    const navButtons = document.querySelector(".nav-buttons");
    if (navButtons) {
      navButtons.innerHTML = `
        <span class="user-email">${user.email}</span>
        <button class="btn-outline" onclick="authService.signOut()">Cerrar Sesión</button>
      `;
    }

    // Hide all modals
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    document.body.style.overflow = "auto";

    // Redirect to appropriate dashboard based on user type
    console.log("🎯 Iniciando proceso de redirección...");
    this.redirectToDashboard(user);
  }

  // Redirect to appropriate dashboard
  async redirectToDashboard(user) {
    try {
      console.log("🔍 Iniciando redirección para usuario:", user.uid);
      console.log("📧 Email del usuario:", user.email);

      // Check if user is a cliente
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

      // Check if user is a lavandero
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

      // Si no está en ninguna colección, mostrar error
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

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.code };
    }
  }

  // Create user account
  async createUser(email, password) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.code };
    }
  }

  // Save cliente data
  async saveClienteData(userId, clienteData) {
    try {
      await this.db
        .collection("clientes")
        .doc(userId)
        .set({
          ...clienteData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save lavandero data
  async saveLavanderoData(userId, lavanderoData) {
    try {
      await this.db
        .collection("lavanderos")
        .doc(userId)
        .set({
          ...lavanderoData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign out
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

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.auth.currentUser;
  }
}

// Initialize auth service
const authService = new AuthService();
window.authService = authService;
