// Firestore Validator
class FirestoreValidator {
  constructor() {
    this.db = window.firebaseDB;
    this.auth = window.firebaseAuth;
  }

  // Test Firestore permissions
  async testPermissions() {
    console.log("🔍 Validando permisos de Firestore...");

    const tests = [
      this.testUnauthenticatedAccess(),
      this.testAuthenticatedAccess(),
      this.testCollectionCreation(),
    ];

    try {
      await Promise.all(tests);
      console.log("✅ Todas las validaciones completadas");
    } catch (error) {
      console.error("❌ Error en validaciones:", error);
    }
  }

  // Test unauthenticated access (should fail)
  async testUnauthenticatedAccess() {
    console.log("🔒 Probando acceso sin autenticación...");

    try {
      await this.db.collection("clientes").doc("test").get();
      console.warn("⚠️ ADVERTENCIA: Acceso sin autenticación permitido");
    } catch (error) {
      if (error.code === "permission-denied") {
        console.log("✅ Acceso sin autenticación correctamente denegado");
      } else {
        console.error(
          "❌ Error inesperado en prueba de acceso sin autenticación:",
          error
        );
      }
    }
  }

  // Test authenticated access (should work)
  async testAuthenticatedAccess() {
    console.log("🔓 Probando acceso con autenticación...");

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.log(
        "ℹ️ No hay usuario autenticado para probar acceso autenticado"
      );
      return;
    }

    try {
      // Test reading own document
      const doc = await this.db
        .collection("clientes")
        .doc(currentUser.uid)
        .get();
      if (doc.exists) {
        console.log("✅ Usuario puede leer su propio documento");
      } else {
        console.log(
          "ℹ️ Usuario no tiene documento en 'clientes' (normal si no se ha registrado)"
        );
      }
    } catch (error) {
      console.error("❌ Error leyendo documento del usuario:", error);
    }
  }

  // Test collection creation
  async testCollectionCreation() {
    console.log("📝 Probando creación de colecciones...");

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.log("ℹ️ No hay usuario autenticado para probar creación");
      return;
    }

    const testData = {
      testField: "test value",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      // Test creating document in clientes
      await this.db.collection("clientes").doc(currentUser.uid).set(testData);
      console.log("✅ Documento creado exitosamente en 'clientes'");

      // Clean up
      await this.db.collection("clientes").doc(currentUser.uid).delete();
      console.log("🧹 Documento de prueba eliminado");
    } catch (error) {
      console.error("❌ Error creando documento en 'clientes':", error);
    }

    try {
      // Test creating document in lavanderos
      await this.db.collection("lavanderos").doc(currentUser.uid).set(testData);
      console.log("✅ Documento creado exitosamente en 'lavanderos'");

      // Clean up
      await this.db.collection("lavanderos").doc(currentUser.uid).delete();
      console.log("🧹 Documento de prueba eliminado");
    } catch (error) {
      console.error("❌ Error creando documento en 'lavanderos':", error);
    }
  }

  // Validate user registration flow
  async validateRegistrationFlow(userType, userData) {
    console.log(`🔍 Validando flujo de registro para ${userType}...`);

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.error("❌ No hay usuario autenticado para validar registro");
      return false;
    }

    try {
      const collection = userType === "cliente" ? "clientes" : "lavanderos";
      const doc = await this.db
        .collection(collection)
        .doc(currentUser.uid)
        .get();

      if (doc.exists) {
        console.log(
          `✅ Usuario ${userType} registrado correctamente en Firestore`
        );
        console.log("📋 Datos guardados:", doc.data());
        return true;
      } else {
        console.error(`❌ Usuario ${userType} no encontrado en Firestore`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error validando registro de ${userType}:`, error);
      return false;
    }
  }

  // Check if user exists in any collection
  async checkUserExists(userId) {
    console.log(`🔍 Verificando si usuario ${userId} existe en colecciones...`);

    try {
      const clienteDoc = await this.db.collection("clientes").doc(userId).get();
      if (clienteDoc.exists) {
        console.log("✅ Usuario encontrado en colección 'clientes'");
        return { exists: true, type: "cliente", data: clienteDoc.data() };
      }

      const lavanderoDoc = await this.db
        .collection("lavanderos")
        .doc(userId)
        .get();
      if (lavanderoDoc.exists) {
        console.log("✅ Usuario encontrado en colección 'lavanderos'");
        return { exists: true, type: "lavandero", data: lavanderoDoc.data() };
      }

      console.log("❌ Usuario no encontrado en ninguna colección");
      return { exists: false, type: null, data: null };
    } catch (error) {
      console.error("❌ Error verificando existencia del usuario:", error);
      return { exists: false, type: null, data: null, error: error.message };
    }
  }
}

// Initialize validator
const firestoreValidator = new FirestoreValidator();
window.firestoreValidator = firestoreValidator;

// Export for use in other modules
window.FirestoreValidator = FirestoreValidator;
