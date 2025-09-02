// Main Application
class PulcroApp {
  constructor() {
    this.init();
  }

  // Initialize application
  init() {
    this.setupEventListeners();
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupScrollToTop();
  }

  // Setup event listeners
  setupEventListeners() {
    // Close modal when clicking outside
    window.onclick = (event) => {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        if (event.target === modal) {
          closeModal(modal.id);
        }
      });
    };

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Setup scroll effects
  setupScrollEffects() {
    // Header scroll effect
    window.addEventListener("scroll", () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 100) {
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "none";
      }
    });
  }

  // Setup mobile menu
  setupMobileMenu() {
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        document.body.classList.toggle("nav-open");
      });

      // Close menu when clicking on a link
      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("open");
          document.body.classList.remove("nav-open");
        });
      });
    }
  }

  // Setup scroll to top button
  setupScrollToTop() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          scrollTopBtn.classList.add("show");
        } else {
          scrollTopBtn.classList.remove("show");
        }
      });

      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }
}

// Modal functions (global scope)
function openModal(modalType) {
  let modalId;
  switch (modalType) {
    case "login":
      modalId = "loginModal";
      break;
    case "register":
      modalId = "registerModal";
      break;
    case "cliente":
      modalId = "clienteModal";
      break;
    case "lavandero":
      modalId = "lavanderoModal";
      break;
    default:
      return;
  }

  const modal = document.getElementById(modalId);
  modal.style.display = "block";
  modal.classList.add("show");

  // Prevent body scroll but allow modal scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
  modal.classList.remove("show");

  // Restore body scroll
  document.body.style.overflow = "auto";
  document.body.style.position = "static";
  document.body.style.width = "auto";
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PulcroApp();
});
