/* =========================
   PORTFOLIO SCRIPT
========================= */

/* =========================
   HEADER SHADOW ON SCROLL
========================= */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
  } else {
    header.style.boxShadow = "none";
  }
});

/* =========================
   SCROLL REVEAL ANIMATION
========================= */

const revealElements = document.querySelectorAll(
  ".hero-text, .hero-card, .about-text, .skill-card, .project-card, .contact-intro, .contact-panel",
);

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      element.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* =========================
   ANIMATED TECH BACKGROUND
========================= */

const backgroundCanvas = document.getElementById("tech-background");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (backgroundCanvas && !reduceMotion) {
  const context = backgroundCanvas.getContext("2d");
  const particles = [];
  const pointer = { x: null, y: null };
  let animationFrame;

  function resizeBackground() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    backgroundCanvas.width = window.innerWidth * pixelRatio;
    backgroundCanvas.height = window.innerHeight * pixelRatio;
    backgroundCanvas.style.width = `${window.innerWidth}px`;
    backgroundCanvas.style.height = `${window.innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const particleCount = Math.min(75, Math.floor(window.innerWidth / 18));
    particles.length = 0;

    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.4 + 0.5,
        speedX: (Math.random() - 0.5) * 0.24,
        speedY: (Math.random() - 0.5) * 0.24,
      });
    }
  }

  function drawBackground() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > window.innerWidth)
        particle.speedX *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight)
        particle.speedY *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(184, 140, 255, 0.65)";
      context.fill();

      particles.slice(index + 1).forEach((otherParticle) => {
        const distance = Math.hypot(
          particle.x - otherParticle.x,
          particle.y - otherParticle.y,
        );

        if (distance < 115) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(otherParticle.x, otherParticle.y);
          context.strokeStyle = `rgba(125, 91, 190, ${0.13 * (1 - distance / 115)})`;
          context.stroke();
        }
      });

      if (pointer.x !== null) {
        const pointerDistance = Math.hypot(
          particle.x - pointer.x,
          particle.y - pointer.y,
        );

        if (pointerDistance < 150) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `rgba(66, 232, 224, ${0.22 * (1 - pointerDistance / 150)})`;
          context.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(drawBackground);
  }

  window.addEventListener("resize", resizeBackground);
  window.addEventListener("mousemove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  document.addEventListener("mouseleave", () => {
    pointer.x = null;
    pointer.y = null;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      drawBackground();
    }
  });

  resizeBackground();
  drawBackground();
}

/* =========================
   PROJECT TABS
========================= */

const projectTabs = document.querySelectorAll(".project-tab");
const projectCards = document.querySelectorAll(".project-card");

projectTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedCategory = tab.dataset.category;

    projectTabs.forEach((item) => {
      const isActive = item === tab;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", isActive);
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    projectCards.forEach((card) => {
      card.hidden = card.dataset.category !== selectedCategory;
    });
  });

  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const currentIndex = [...projectTabs].indexOf(tab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + projectTabs.length) % projectTabs.length;

    projectTabs[nextIndex].focus();
    projectTabs[nextIndex].click();
  });
});

projectCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const bounds = card.getBoundingClientRect();
    const mouseX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const mouseY = ((event.clientY - bounds.top) / bounds.height) * 100;

    card.style.setProperty("--mouse-x", `${mouseX}%`);
    card.style.setProperty("--mouse-y", `${mouseY}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  });
});

/* =========================
   ACTIVE NAVIGATION LINK
========================= */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

/* =========================
   TILT EFFECT ON PROJECT CARD
========================= */

const cards = document.querySelectorAll(".project-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 10;
    const rotateX = (y / rect.height - 0.5) * -10;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `
      perspective(1000px)
      rotateX(0)
      rotateY(0)
      translateY(0)
    `;
  });
});

/* =========================
   BUTTON RIPPLE EFFECT
========================= */

const buttons = document.querySelectorAll(".btn, .project-btn");

buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const circle = document.createElement("span");

    const diameter = Math.max(this.clientWidth, this.clientHeight);

    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;

    circle.style.left = `${
      e.clientX - this.getBoundingClientRect().left - radius
    }px`;

    circle.style.top = `${
      e.clientY - this.getBoundingClientRect().top - radius
    }px`;

    circle.classList.add("ripple");

    const ripple = this.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    this.appendChild(circle);
  });
});

/* =========================
   TYPEWRITER EFFECT
========================= */

const heroTypewriter = document.querySelector(".hero-typewriter");
const text = "npm run create-future";

let index = 0;

function typeWriter() {
  if (heroTypewriter && index < text.length) {
    heroTypewriter.textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, 55);
  }
}

if (heroTypewriter) {
  heroTypewriter.textContent = "";
  window.addEventListener("load", typeWriter);
}

/* =========================
   PARALLAX EFFECT
========================= */

window.addEventListener("mousemove", (e) => {
  const glow = document.querySelector(".card-glow");

  if (!glow || reduceMotion) return;

  const x = (window.innerWidth - e.pageX * 2) / 90;
  const y = (window.innerHeight - e.pageY * 2) / 90;

  glow.style.transform = `translate(${x}px, ${y}px)`;
});

/* =========================
   CONTACT FORM
========================= */

const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

form?.addEventListener("submit", function (e) {
  e.preventDefault();

  const submitButton = form.querySelector(".contact-submit");
  const buttonText = submitButton.querySelector("span");
  const originalText = buttonText.textContent;

  submitButton.disabled = true;
  buttonText.textContent = "Enviando...";
  formStatus.className = "form-status";
  formStatus.textContent = "Conectando e enviando sua mensagem...";

  emailjs
    .sendForm("service_a3p1w2n", "template_ybrzzka", this)
    .then(() => {
      form.reset();
      formStatus.className = "form-status success";
      formStatus.textContent =
        "Mensagem enviada com sucesso. Em breve entrarei em contato!";
    })
    .catch((error) => {
      formStatus.className = "form-status error";
      formStatus.textContent =
        "Não foi possível enviar agora. Tente novamente em alguns instantes.";
      console.log(error);
    })
    .finally(() => {
      submitButton.disabled = false;
      buttonText.textContent = originalText;
    });
});

/* =========================
   CONSOLE MESSAGE
========================= */

console.log(`
 Portfólio desenvolvido por zKILLA
💜 HTML | CSS | JavaScript
`);

/* =========================
   TESTIMONIALS / FEEDBACK
========================= */

const API_URL = "http://localhost:3000/api";

const testimonialsGrid = document.getElementById("testimonials-grid");
const feedbackModal = document.getElementById("feedback-modal");
const openFeedbackButton = document.getElementById("open-feedback-modal");
const closeFeedbackButton = document.getElementById("close-feedback-modal");
const feedbackModalOverlay = document.getElementById("feedback-modal-overlay");
const feedbackForm = document.getElementById("feedback-form");
const feedbackStars = document.querySelectorAll("#feedback-stars button");
const feedbackRating = document.getElementById("feedback-rating");
const feedbackStatus = document.getElementById("feedback-form-status");

/* =========================
   ESCAPAR HTML
========================= */

function escapeFeedbackHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================
   ABRIR MODAL
========================= */

function openFeedbackModal() {
  if (!feedbackModal) return;

  feedbackModal.classList.add("active");
  feedbackModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  setTimeout(() => {
    document.getElementById("feedback-name")?.focus();
  }, 100);
}

/* =========================
   FECHAR MODAL
========================= */

function closeFeedbackModal() {
  if (!feedbackModal) return;

  feedbackModal.classList.remove("active");
  feedbackModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  feedbackForm?.reset();

  feedbackRating.value = "";

  feedbackStars.forEach((star) => {
    star.classList.remove("active");
  });

  if (feedbackStatus) {
    feedbackStatus.className = "form-status";
    feedbackStatus.textContent = "";
  }
}

/* =========================
   EVENTOS DO MODAL
========================= */

openFeedbackButton?.addEventListener("click", openFeedbackModal);

closeFeedbackButton?.addEventListener("click", closeFeedbackModal);

feedbackModalOverlay?.addEventListener("click", closeFeedbackModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && feedbackModal?.classList.contains("active")) {
    closeFeedbackModal();
  }
});

/* =========================
   ESTRELAS
========================= */

feedbackStars.forEach((star) => {
  star.addEventListener("click", () => {
    const rating = Number(star.dataset.rating);

    feedbackRating.value = rating;

    feedbackStars.forEach((item) => {
      const itemRating = Number(item.dataset.rating);

      item.classList.toggle("active", itemRating <= rating);
    });
  });
});

/* =========================
   CRIAR CARD
========================= */

function createTestimonialCard(feedback) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const active = index < feedback.rating ? "fa-solid" : "fa-regular";

    return `
        <i class="${active} fa-star"></i>
      `;
  }).join("");

  const firstLetter = feedback.name?.charAt(0).toUpperCase() || "?";

  return `
    <article class="testimonial-card">

      <div class="testimonial-rating">
        ${stars}
      </div>

      <p class="testimonial-message">
        "${escapeFeedbackHTML(feedback.message)}"
      </p>

      <div class="testimonial-author">

        <div class="testimonial-avatar">
          ${escapeFeedbackHTML(firstLetter)}
        </div>

        <div>
          <strong>
            ${escapeFeedbackHTML(feedback.name)}
          </strong>

          <span>
            ${escapeFeedbackHTML(feedback.role || "Cliente")}
          </span>
        </div>

      </div>

    </article>
  `;
}

/* =========================
   CARREGAR FEEDBACKS
========================= */

async function loadTestimonials() {
  if (!testimonialsGrid) return;

  try {
    testimonialsGrid.innerHTML = `
      <p>
        Carregando depoimentos...
      </p>
    `;

    const response = await fetch(`${API_URL}/feedbacks`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (!data.feedbacks || data.feedbacks.length === 0) {
      testimonialsGrid.innerHTML = `
        <p>
          Ainda não há depoimentos publicados.
        </p>
      `;

      return;
    }

    testimonialsGrid.innerHTML = data.feedbacks
      .map(createTestimonialCard)
      .join("");
  } catch (error) {
    console.error("Erro ao carregar depoimentos:", error);

    testimonialsGrid.innerHTML = `
      <p>
        Não foi possível carregar os depoimentos.
      </p>
    `;
  }
}

/* =========================
   ENVIAR FEEDBACK
========================= */

feedbackForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("feedback-name")?.value.trim();

  const role = document.getElementById("feedback-role")?.value.trim();

  const message = document.getElementById("feedback-message")?.value.trim();

  const rating = Number(feedbackRating?.value);

  /* =========================
       VALIDAÇÃO FRONT-END
    ========================= */

  if (!name) {
    showFeedbackStatus("Digite seu nome.", "error");

    return;
  }

  if (!rating || rating < 1 || rating > 5) {
    showFeedbackStatus("Selecione uma avaliação de 1 a 5 estrelas.", "error");

    return;
  }

  if (!message) {
    showFeedbackStatus("Digite sua mensagem.", "error");

    return;
  }

  /* =========================
       BOTÃO
    ========================= */

  const submitButton = feedbackForm.querySelector(".feedback-submit");

  const buttonText = submitButton?.querySelector("span");

  const originalText = buttonText?.textContent;

  if (submitButton) {
    submitButton.disabled = true;
  }

  if (buttonText) {
    buttonText.textContent = "Enviando...";
  }

  showFeedbackStatus("Enviando seu feedback...", "");

  try {
    const response = await fetch(`${API_URL}/feedbacks`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        role,
        rating,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Não foi possível enviar o feedback.");
    }

    showFeedbackStatus(
      "Feedback enviado! Ele será analisado antes de aparecer no portfólio.",
      "success",
    );

    feedbackForm.reset();

    feedbackRating.value = "";

    feedbackStars.forEach((star) => {
      star.classList.remove("active");
    });

    setTimeout(() => {
      closeFeedbackModal();
    }, 2500);
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);

    showFeedbackStatus(
      error.message || "Não foi possível enviar o feedback.",
      "error",
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }

    if (buttonText) {
      buttonText.textContent = originalText || "Enviar feedback";
    }
  }
});

/* =========================
   STATUS
========================= */

function showFeedbackStatus(message, type) {
  if (!feedbackStatus) return;

  feedbackStatus.textContent = message;

  feedbackStatus.className = `form-status ${type}`;
}

/* =========================
   INICIAR
========================= */

loadTestimonials();
