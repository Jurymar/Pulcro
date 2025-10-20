/**
 * ═══════════════════════════════════════════════════════════════════
 * PULCRO APP - Aplicación Principal de la Página de Inicio
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Este archivo maneja la interactividad de index.html:
 * 
 * FUNCIONALIDADES:
 * ✅ Efectos de scroll en el header (cambio de fondo al hacer scroll)
 * ✅ Menú móvil hamburguesa (responsive)
 * ✅ Scroll suave a secciones (al hacer clic en enlaces #)
 * ✅ Botón "Volver arriba" (scroll to top)
 * ✅ Acordeón FAQ con expansión/colapso
 * ✅ Modales de login/registro (cliente y lavandero)
 * 
 * NO maneja Firebase ni autenticación (eso está en auth-service.js)
 * Solo se encarga de la experiencia de usuario (UX) de la landing page
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

class PulcroApp {
  constructor() {
    this.init();  // Inicializar todas las funcionalidades
  }

  // ──────────────────────────────────────────────────────────────────
  // INICIALIZACIÓN - Configura todos los eventos y efectos
  // ──────────────────────────────────────────────────────────────────
  init() {
    this.setupEventListeners();  // Eventos generales (modales, enlaces)
    this.setupScrollEffects();   // Efectos al hacer scroll
    this.setupMobileMenu();      // Menú hamburguesa responsive
    this.setupScrollToTop();     // Botón para volver arriba
    this.setupFAQAccordion();    // Acordeón de preguntas frecuentes
  }

  // ──────────────────────────────────────────────────────────────────
  // EVENTOS GENERALES - Modales y navegación
  // ──────────────────────────────────────────────────────────────────
  setupEventListeners() {
    // ═══════════════════════════════════════════════════════════════
    // CERRAR MODALES AL HACER CLIC FUERA
    // ═══════════════════════════════════════════════════════════════
    window.onclick = (event) => {
      // Cerrar cualquier modal si se hace clic en el fondo oscuro
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        if (event.target === modal) {
          closeModal(modal.id);
        }
      });

      // Cerrar menú móvil si se hace clic fuera de él
      const navMenu = document.querySelector(".nav-menu");
      const navToggle = document.querySelector(".nav-toggle");
      if (navMenu && navMenu.classList.contains("open") && 
          !navMenu.contains(event.target) && 
          !navToggle.contains(event.target)) {
        navMenu.classList.remove("open");
        document.body.classList.remove("nav-open");
      }
    };

    // ═══════════════════════════════════════════════════════════════
    // SCROLL SUAVE A SECCIONES
    // ═══════════════════════════════════════════════════════════════
    // Cuando se hace clic en enlaces con # (ej: href="#services")
    // hace scroll suave a esa sección en lugar de saltar bruscamente
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",  // Scroll animado
            block: "start",      // Alinear al inicio de la sección
          });
        }
      });
    });
  }

  // ──────────────────────────────────────────────────────────────────
  // EFECTOS AL HACER SCROLL
  // ──────────────────────────────────────────────────────────────────
  /**
   * Cambia el estilo del header al hacer scroll
   * 
   * EFECTO:
   * - Cuando el usuario hace scroll > 100px:
   *   → Fondo más sólido (menos transparente)
   *   → Agrega sombra para darle profundidad
   * - Cuando está arriba (scroll < 100px):
   *   → Fondo más transparente
   *   → Sin sombra
   */
  setupScrollEffects() {
    window.addEventListener("scroll", () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 100) {
        // Usuario ha hecho scroll, hacer header más visible
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
      } else {
        // Usuario en la parte superior, header más sutil
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "none";
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────
  // MENÚ MÓVIL HAMBURGUESA
  // ──────────────────────────────────────────────────────────────────
  /**
   * Configura el menú hamburguesa para dispositivos móviles
   * 
   * FUNCIONAMIENTO:
   * - Al hacer clic en el icono hamburguesa (☰):
   *   → Abre/cierra el menú lateral
   *   → Agrega clase "nav-open" al body (previene scroll)
   * - Al hacer clic en un enlace del menú:
   *   → Cierra el menú automáticamente
   *   → Navega a la sección correspondiente
   */
  setupMobileMenu() {
    const navToggle = document.querySelector(".nav-toggle");  // Botón hamburguesa
    const navMenu = document.querySelector(".nav-menu");      // Menú lateral

    if (navToggle && navMenu) {
      // Toggle (abrir/cerrar) menú al hacer clic en el icono
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        document.body.classList.toggle("nav-open");
      });

      // Cerrar menú al hacer clic en cualquier enlace
      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("open");
          document.body.classList.remove("nav-open");
        });
      });
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // BOTÓN "VOLVER ARRIBA"
  // ──────────────────────────────────────────────────────────────────
  /**
   * Muestra/oculta el botón flotante para volver arriba
   * 
   * COMPORTAMIENTO:
   * - Cuando el usuario hace scroll > 300px:
   *   → Muestra el botón (con animación)
   * - Cuando está cerca del inicio:
   *   → Oculta el botón
   * - Al hacer clic en el botón:
   *   → Scroll suave hasta arriba de la página
   */
  setupScrollToTop() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
      // Mostrar/ocultar botón según la posición del scroll
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          scrollTopBtn.classList.add("show");  // Mostrar botón
        } else {
          scrollTopBtn.classList.remove("show");  // Ocultar botón
        }
      });

      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  // Setup FAQ Accordion
  setupFAQAccordion() {
    // Main FAQ accordion
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector(".faq-answer");
        const icon = question.querySelector(".faq-icon");
        const isActive = answer.classList.contains("active");

        // Close all other main accordions
        faqQuestions.forEach((otherQuestion) => {
          if (otherQuestion !== question) {
            const otherFaqItem = otherQuestion.parentElement;
            const otherAnswer = otherFaqItem.querySelector(".faq-answer");
            const otherIcon = otherQuestion.querySelector(".faq-icon");
            
            otherAnswer.classList.remove("active");
            otherQuestion.classList.remove("active");
            otherIcon.textContent = "+";
            
            // Also close all subquestions within the closing accordion
            const subcontents = otherAnswer.querySelectorAll(".faq-subcontent");
            const subicons = otherAnswer.querySelectorAll(".faq-subicon");
            const subquestions = otherAnswer.querySelectorAll(".faq-subquestion");
            subcontents.forEach(subcontent => subcontent.classList.remove("active"));
            subicons.forEach(subicon => subicon.textContent = "+");
            subquestions.forEach(subq => subq.classList.remove("active"));
          }
        });

        // Toggle current item
        if (isActive) {
          answer.classList.remove("active");
          question.classList.remove("active");
          icon.textContent = "+";
          
          // Close all subquestions within this accordion
          const subcontents = answer.querySelectorAll(".faq-subcontent");
          const subicons = answer.querySelectorAll(".faq-subicon");
          const subquestions = answer.querySelectorAll(".faq-subquestion");
          subcontents.forEach(subcontent => subcontent.classList.remove("active"));
          subicons.forEach(subicon => subicon.textContent = "+");
          subquestions.forEach(subq => subq.classList.remove("active"));
        } else {
          answer.classList.add("active");
          question.classList.add("active");
          icon.textContent = "−";
        }
        
        // Esperar a que las animaciones terminen y posicionar el título clickeado
        setTimeout(() => {
          const headerOffset = 100;
          const elementPosition = question.getBoundingClientRect().top + window.pageYOffset;
          const targetPosition = elementPosition - headerOffset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }, 450); // Esperar a que termine la animación CSS (max-height transition)
      });
    });

    // Nested FAQ accordion (subquestions)
    const faqSubquestions = document.querySelectorAll(".faq-subquestion");

    faqSubquestions.forEach((subquestion) => {
      subquestion.addEventListener("click", () => {
        const subcontent = subquestion.nextElementSibling;
        const subicon = subquestion.querySelector(".faq-subicon");
        const isActive = subcontent.classList.contains("active");
        
        // Find the parent answer container to close only siblings
        const parentAnswer = subquestion.closest(".faq-answer");
        
        // Close all other subquestions within the same parent accordion
        const siblingSubquestions = parentAnswer.querySelectorAll(".faq-subquestion");
        siblingSubquestions.forEach((otherSubquestion) => {
          if (otherSubquestion !== subquestion) {
            const otherSubcontent = otherSubquestion.nextElementSibling;
            const otherSubicon = otherSubquestion.querySelector(".faq-subicon");
            
            otherSubcontent.classList.remove("active");
            otherSubquestion.classList.remove("active");
            otherSubicon.textContent = "+";
          }
        });

        // Toggle current subitem
        if (isActive) {
          subcontent.classList.remove("active");
          subquestion.classList.remove("active");
          subicon.textContent = "+";
        } else {
          subcontent.classList.add("active");
          subquestion.classList.add("active");
          subicon.textContent = "−";
        }
        
        // Esperar a que las animaciones terminen y posicionar el subtítulo clickeado
        setTimeout(() => {
          const headerOffset = 120;
          const elementPosition = subquestion.getBoundingClientRect().top + window.pageYOffset;
          const targetPosition = elementPosition - headerOffset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }, 450); // Esperar a que termine la animación CSS
      });
    });
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
