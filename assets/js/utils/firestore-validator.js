/**
 * ═══════════════════════════════════════════════════════════════
 * FIRESTORE VALIDATOR - Validador de Permisos y Datos
 * ═══════════════════════════════════════════════════════════════
 * 
 * Herramienta de diagnóstico para verificar:
 * - Permisos de seguridad de Firestore
 * - Acceso autenticado y no autenticado
 * - Creación correcta de documentos
 * - Existencia de usuarios en colecciones
 * 
 * IMPORTANTE: Esta es una herramienta de desarrollo/debugging
 * No se usa en producción normal, solo para pruebas
 * 
 * ═══════════════════════════════════════════════════════════════
 */
class FirestoreValidator {
  /**
   * ────────────────────────────────────────────────────────────
   * CONSTRUCTOR
   * ────────────────────────────────────────────────────────────
   * Inicializa con referencias a Firestore y Auth
   */
  constructor() {
    this.db = window.firebaseDB; // Base de datos Firestore
    this.auth = window.firebaseAuth; // Autenticación
  }

  /**
   * ────────────────────────────────────────────────────────────
   * PROBAR PERMISOS GENERALES
   * ────────────────────────────────────────────────────────────
   * Ejecuta una suite completa de pruebas de permisos:
   * 1. Acceso sin autenticación (debe fallar)
   * 2. Acceso con autenticación (debe funcionar)
   * 3. Creación de documentos (debe funcionar)
   */
  async testPermissions() {
    console.log("🔍 Validando permisos de Firestore...");

    // Array de promesas de pruebas
    const tests = [
      this.testUnauthenticatedAccess(), // Prueba 1
      this.testAuthenticatedAccess(), // Prueba 2
      this.testCollectionCreation(), // Prueba 3
    ];

    try {
      await Promise.all(tests); // Ejecutar todas en paralelo
      console.log("✅ Todas las validaciones completadas");
    } catch (error) {
      console.error("❌ Error en validaciones:", error);
    }
  }

  /**
   * ────────────────────────────────────────────────────────────
   * PROBAR ACCESO SIN AUTENTICACIÓN
   * ────────────────────────────────────────────────────────────
   * Verifica que las reglas de seguridad IMPIDAN el acceso sin login
   * 
   * RESULTADO ESPERADO: Error "permission-denied"
   * RESULTADO MALO: Acceso permitido (fallo de seguridad)
   */
  async testUnauthenticatedAccess() {
    console.log("🔒 Probando acceso sin autenticación...");

    try {
      // Intentar leer documento sin estar logueado
      await this.db.collection("clientes").doc("test").get();
      console.warn("⚠️ ADVERTENCIA: Acceso sin autenticación permitido");
    } catch (error) {
      if (error.code === "permission-denied") {
        // ✅ Esto es BUENO - las reglas están funcionando
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

  /**
   * ────────────────────────────────────────────────────────────
   * VERIFICAR SI USUARIO EXISTE
   * ────────────────────────────────────────────────────────────
   * Busca al usuario en ambas colecciones (clientes y lavanderos)
   * y retorna en cuál se encuentra
   * 
   * @param {string} userId - UID del usuario de Firebase Auth
   * @returns {Object} - { exists, type, data, error? }
   */
  async checkUserExists(userId) {
    console.log(`🔍 Verificando si usuario ${userId} existe en colecciones...`);

    try {
      // Buscar en colección de clientes
      const clienteDoc = await this.db.collection("clientes").doc(userId).get();
      if (clienteDoc.exists) {
        console.log("✅ Usuario encontrado en colección 'clientes'");
        return { exists: true, type: "cliente", data: clienteDoc.data() };
      }

      // Buscar en colección de lavanderos
      const lavanderoDoc = await this.db
        .collection("lavanderos")
        .doc(userId)
        .get();
      if (lavanderoDoc.exists) {
        console.log("✅ Usuario encontrado en colección 'lavanderos'");
        return { exists: true, type: "lavandero", data: lavanderoDoc.data() };
      }

      // No encontrado en ninguna colección
      console.log("❌ Usuario no encontrado en ninguna colección");
      return { exists: false, type: null, data: null };
    } catch (error) {
      console.error("❌ Error verificando existencia del usuario:", error);
      return { exists: false, type: null, data: null, error: error.message };
    }
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INICIALIZACIÓN
 * ═══════════════════════════════════════════════════════════════
 * Crea instancia global del validador
 * Disponible en window.firestoreValidator
 */
const firestoreValidator = new FirestoreValidator();
window.firestoreValidator = firestoreValidator;

// Exportar también la clase para poder crear más instancias si es necesario
window.FirestoreValidator = FirestoreValidator;
