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
  ".hero-text, .hero-card, .about-text, .skill-card, .project-card"
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
    });

    projectCards.forEach((card) => {
      card.hidden = card.dataset.category !== selectedCategory;
    });
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

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

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

    const diameter = Math.max(
      this.clientWidth,
      this.clientHeight
    );

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

const heroTitle = document.querySelector(".hero-text h2");

const text = "Criando interfaces modernas e experiências digitais";

let index = 0;

function typeWriter() {

  if (index < text.length) {

    heroTitle.innerHTML += text.charAt(index);

    index++;

    setTimeout(typeWriter, 40);

  }
}

heroTitle.innerHTML = "";

window.addEventListener("load", typeWriter);

/* =========================
   PARALLAX EFFECT
========================= */

window.addEventListener("mousemove", (e) => {

  const glow = document.querySelector(".card-glow");

  const x = (window.innerWidth - e.pageX * 2) / 90;
  const y = (window.innerHeight - e.pageY * 2) / 90;

  glow.style.transform = `translate(${x}px, ${y}px)`;
});


/* =========================
   CONTACT FORM
========================= */

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {

  e.preventDefault();

  emailjs.sendForm(
    "service_a3p1w2n",
    "template_ybrzzka",
    this
  )
  .then(() => {

    alert("Mensagem enviada com sucesso 🚀");

    form.reset();

  })
  .catch((error) => {

    alert("Erro ao enviar mensagem 😢");

    console.log(error);

  });

});

/* =========================
   CONSOLE MESSAGE
========================= */

console.log(`
 Portfólio desenvolvido por zKILLA
💜 HTML | CSS | JavaScript
`);
