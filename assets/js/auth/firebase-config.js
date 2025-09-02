// Firebase configuration
const firebaseConfig = window.APP_CONFIG.firebase;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable Firestore persistence
db.enablePersistence().catch((err) => {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.log("Persistence failed - multiple tabs open");
  } else if (err.code === "unimplemented") {
    // The current browser doesn't support persistence
    console.log("Persistence not supported");
  }
});

// Export for use in other modules
window.firebaseAuth = auth;
window.firebaseDB = db;
