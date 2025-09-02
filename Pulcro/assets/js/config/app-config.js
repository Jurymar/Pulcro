// Application Configuration
const APP_CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyDOd9Ps7yNYRR_Yo6sjWAd-UmXBAnfIyPw",
    authDomain: "pulcro-9357f.firebaseapp.com",
    projectId: "pulcro-9357f",
    storageBucket: "pulcro-9357f.firebasestorage.app",
    messagingSenderId: "999350899261",
    appId: "1:999350899261:web:72d7c4bf3f59fb93409054",
    measurementId: "G-QDPMGYKFHN",
  },

  // App Settings
  app: {
    name: "Pulcro",
    version: "1.0.0",
    description: "Tu Lavandería Digital",
  },

  // Collections
  collections: {
    clientes: "clientes",
    lavanderos: "lavanderos",
  },

  // Firestore Settings
  firestore: {
    enablePersistence: true,
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  },

  // User Types
  userTypes: {
    CLIENTE: "cliente",
    LAVANDERO: "lavandero",
  },

  // Services
  services: {
    LAVADO: "lavado",
    SECO: "seco",
    ZAPATOS: "zapatos",
    HOGAR: "hogar",
    EXPRESS: "express",
  },

  // Validation
  validation: {
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  // UI Settings
  ui: {
    notificationDuration: 5000,
    scrollThreshold: 300,
    headerScrollThreshold: 100,
  },
};

// Export configuration
window.APP_CONFIG = APP_CONFIG;
