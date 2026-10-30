/* =========================
   PORTFOLIO SCRIPT
========================= */

/* =========================
   HEADER SHADOW ON SCROLL
========================= */

const header = document.querySelector(".header");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");

function closeNavigation() {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Abrir menu");
  navMenu?.classList.remove("is-open");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navMenu?.classList.toggle("is-open", !isOpen);
});

navMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

/* =========================
   SCROLL REVEAL ANIMATION
========================= */

const revealElements = document.querySelectorAll(
  ".hero-text, .hero-card, .about-text, .skill-card, .project-card, .contact-intro, .contact-panel",
);

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("show"));
}

/* =========================
   ANIMATED TECH BACKGROUND
========================= */

const backgroundCanvas = document.getElementById("tech-background");

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
      context.fillStyle = "rgba(215, 193, 154, 0.62)";
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
          context.strokeStyle = `rgba(197, 164, 109, ${0.13 * (1 - distance / 115)})`;
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
          context.strokeStyle = `rgba(215, 193, 154, ${0.22 * (1 - pointerDistance / 150)})`;
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

    document.querySelector("#projects-panel")?.setAttribute("aria-labelledby", tab.id);

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

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const trackedSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${visibleSection.target.id}`;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] });

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

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
   CONSOLE MESSAGE
========================= */

console.log(`
 Portfólio desenvolvido por zKILLA
Satturno | HTML | CSS | JavaScript
`);
