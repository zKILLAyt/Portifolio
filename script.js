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
  ".hero-text, .hero-card, .about-text, .skill-card, .project-card, .contact-intro, .contact-panel"
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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(184, 140, 255, 0.65)";
      context.fill();

      particles.slice(index + 1).forEach((otherParticle) => {
        const distance = Math.hypot(
          particle.x - otherParticle.x,
          particle.y - otherParticle.y
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
          particle.y - pointer.y
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
    const nextIndex = (currentIndex + direction + projectTabs.length) % projectTabs.length;

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

  emailjs.sendForm(
    "service_a3p1w2n",
    "template_ybrzzka",
    this
  )
  .then(() => {
    form.reset();
    formStatus.className = "form-status success";
    formStatus.textContent = "Mensagem enviada com sucesso. Em breve entrarei em contato!";
  })
  .catch((error) => {
    formStatus.className = "form-status error";
    formStatus.textContent = "Não foi possível enviar agora. Tente novamente em alguns instantes.";
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

const FEEDBACK_STORAGE_KEY = "gustavo_portfolio_feedbacks_v1";

function feedbackMarkup() {
  if (document.getElementById("testimonials")) return;

  const nav = document.querySelector(".nav-links");
  if (nav && !nav.querySelector('a[href="#testimonials"]')) {
    const item = document.createElement("li");
    item.innerHTML = '<a href="#testimonials">Depoimentos</a>';
    const contact = nav.querySelector('a[href="#contact"]')?.parentElement;
    contact ? nav.insertBefore(item, contact) : nav.appendChild(item);
  }

  const contactSection = document.getElementById("contact");
  if (!contactSection) return;

  const section = document.createElement("section");
  section.className = "testimonials testimonials-modern";
  section.id = "testimonials";
  section.innerHTML = `
    <div class="container">
      <div class="section-title">
        <span><i class="fa-solid fa-comments"></i> Depoimentos</span>
        <h2>Experiências que <strong>falam por mim.</strong></h2>
        <p>Veja avaliações de clientes e colaboradores. Você também pode deixar seu feedback sobre um projeto ou experiência comigo.</p>
      </div>
      <div class="testimonials-toolbar">
        <div class="rating-overview">
          <strong id="average-rating">—</strong>
          <div>
            <div class="rating-stars" id="average-stars" aria-label="Média das avaliações">☆☆☆☆☆</div>
            <small><span id="rating-count">0</span> avaliações</small>
          </div>
        </div>
        <button type="button" class="btn primary" id="open-feedback-modal"><i class="fa-solid fa-pen"></i><span>Deixar um depoimento</span></button>
      </div>
      <div class="testimonials-grid" id="testimonials-list" aria-live="polite"></div>
      <div class="testimonials-empty" id="testimonials-empty">
        <div class="empty-icon"><i class="fa-regular fa-comment-dots"></i></div>
        <h3>Seja o primeiro a deixar um feedback</h3>
        <p>Seu depoimento poderá aparecer aqui depois que você enviar sua avaliação.</p>
        <button type="button" class="btn secondary" id="open-feedback-empty">Enviar primeiro feedback</button>
      </div>
    </div>
  `;
  contactSection.parentNode.insertBefore(section, contactSection);

  const modal = document.createElement("div");
  modal.className = "feedback-modal";
  modal.id = "feedback-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="feedback-backdrop" data-close-feedback></div>
    <div class="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <button type="button" class="feedback-close" id="close-feedback-modal" aria-label="Fechar modal"><i class="fa-solid fa-xmark"></i></button>
      <div class="feedback-dialog-header">
        <span class="feedback-label">novo_feedback.json</span>
        <h3 id="feedback-title">Como foi sua experiência?</h3>
        <p>Conte rapidamente como foi trabalhar comigo ou utilizar algum dos meus projetos.</p>
      </div>
      <form id="feedback-form" class="feedback-form" novalidate>
        <div class="input-group">
          <label for="feedback-name">Nome <span>*</span></label>
          <div class="input-control"><i class="fa-regular fa-user"></i><input id="feedback-name" name="name" type="text" maxlength="60" placeholder="Seu nome" autocomplete="name"></div>
          <small class="field-error" data-error-for="name"></small>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label for="feedback-role">Cargo / Empresa</label>
            <div class="input-control"><i class="fa-solid fa-briefcase"></i><input id="feedback-role" name="role" type="text" maxlength="80" placeholder="Opcional"></div>
          </div>
          <div class="input-group">
            <label>Avaliação <span>*</span></label>
            <div class="feedback-stars" id="feedback-stars" role="radiogroup" aria-label="Selecione uma nota de 1 a 5">
              ${[1,2,3,4,5].map((n) => `<button type="button" class="star-button" data-rating="${n}" aria-label="${n} estrela${n > 1 ? "s" : ""}">★</button>`).join("")}
            </div>
            <small class="rating-hint" id="rating-hint">Selecione de 1 a 5 estrelas</small>
            <small class="field-error" data-error-for="rating"></small>
          </div>
        </div>
        <div class="input-group">
          <label for="feedback-message">Depoimento <span>*</span></label>
          <div class="input-control textarea-control"><i class="fa-regular fa-message"></i><textarea id="feedback-message" name="message" maxlength="500" rows="5" placeholder="Escreva seu feedback..."></textarea></div>
          <div class="feedback-counter"><span id="feedback-char-count">0</span>/500</div>
          <small class="field-error" data-error-for="message"></small>
        </div>
        <p class="feedback-status" id="feedback-status" role="status" aria-live="polite"></p>
        <button type="submit" class="btn primary feedback-submit"><span>Publicar feedback</span><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const style = document.createElement("style");
  style.id = "feedback-styles";
  style.textContent = `
    .testimonials-modern{position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(7,7,12,.88),rgba(10,7,18,.96))}.testimonials-modern .section-title h2 strong{color:var(--purple-light)}
    .testimonials-toolbar{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-bottom:35px;padding:18px;border:1px solid rgba(155,92,255,.12);border-radius:16px;background:rgba(12,12,20,.52)}
    .rating-overview{display:flex;align-items:center;gap:15px}.rating-overview>strong{font-size:34px;color:#f5f1fc}.rating-overview small{display:block;margin-top:4px;color:#77778a;font-size:10px}.rating-stars{color:#ffc857;letter-spacing:3px;font-size:16px}.testimonials-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
    .testimonial-card{position:relative;padding:24px;border:1px solid rgba(155,92,255,.13);border-radius:18px;background:linear-gradient(145deg,rgba(19,17,29,.86),rgba(9,9,15,.72));overflow:hidden;transition:.3s}.testimonial-card:hover{transform:translateY(-5px);border-color:rgba(155,92,255,.3);box-shadow:0 20px 55px rgba(0,0,0,.28)}
    .testimonial-card-top{display:flex;align-items:center;justify-content:space-between;gap:15px}.testimonial-author{display:flex;align-items:center;gap:12px;min-width:0}.testimonial-avatar{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border-radius:12px;border:1px solid rgba(155,92,255,.22);background:rgba(155,92,255,.09);color:var(--purple-light);font-weight:bold;font-size:13px}.testimonial-author strong{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.testimonial-author small{display:block;margin-top:4px;color:#77778a;font-size:9px}.testimonial-rating{color:#ffc857;letter-spacing:1px;font-size:12px;white-space:nowrap}.testimonial-message{position:relative;margin:20px 0 18px;padding-left:17px;color:#a8a8b8;font-size:13px;line-height:1.75}.testimonial-message::before{content:"“";position:absolute;left:0;top:-7px;color:var(--purple);font-size:27px;font-family:Georgia,serif}.testimonial-date{color:#595969;font:9px Consolas,"Courier New",monospace}
    .testimonials-empty{text-align:center;padding:55px 25px;border:1px dashed rgba(155,92,255,.18);border-radius:18px;background:rgba(12,12,20,.35)}.empty-icon{width:52px;height:52px;display:grid;place-items:center;margin:0 auto 15px;border:1px solid rgba(155,92,255,.2);border-radius:14px;color:var(--purple-light);background:rgba(155,92,255,.07);font-size:20px}.testimonials-empty h3{font-size:16px;margin-bottom:8px}.testimonials-empty p{max-width:480px;margin:0 auto 20px;color:#77778a;font-size:12px;line-height:1.6}
    .feedback-modal{position:fixed;inset:0;z-index:2000;display:grid;place-items:center;padding:20px;visibility:hidden;opacity:0;transition:.25s ease}.feedback-modal.open{visibility:visible;opacity:1}.feedback-backdrop{position:absolute;inset:0;background:rgba(3,3,7,.78);backdrop-filter:blur(9px)}.feedback-dialog{position:relative;width:min(680px,100%);max-height:min(90vh,760px);overflow:auto;padding:30px;border:1px solid rgba(155,92,255,.25);border-radius:22px;background:linear-gradient(145deg,rgba(21,19,32,.98),rgba(8,8,14,.98));box-shadow:0 35px 100px rgba(0,0,0,.55);transform:translateY(18px) scale(.98);transition:.25s ease}.feedback-modal.open .feedback-dialog{transform:translateY(0) scale(1)}
    .feedback-close{position:absolute;top:18px;right:18px;width:36px;height:36px;border:1px solid rgba(155,92,255,.14);border-radius:10px;background:rgba(155,92,255,.06);color:#9999aa;cursor:pointer}.feedback-dialog-header{padding-right:45px;margin-bottom:25px}.feedback-label{color:var(--cyan);font:10px Consolas,"Courier New",monospace}.feedback-dialog-header h3{margin-top:9px;font-size:26px}.feedback-dialog-header p{margin-top:8px;color:#77778a;font-size:12px;line-height:1.6}.feedback-form .input-group{margin-bottom:17px}.feedback-form label span{color:var(--purple-light)}.feedback-stars{height:45px;display:flex;align-items:center;gap:2px}.star-button{width:28px;height:38px;padding:0;border:0;background:transparent;color:#494354;cursor:pointer;font-size:25px;transition:.15s}.star-button:hover,.star-button.active{color:#ffc857;text-shadow:0 0 15px rgba(255,200,87,.25);transform:scale(1.08)}.rating-hint{display:block;color:#68687a;font-size:9px}.field-error{display:block;min-height:13px;margin-top:5px;color:#ff7d9a;font-size:9px}.input-group.invalid .input-control{border-color:rgba(255,125,154,.45)}.feedback-counter{margin-top:5px;text-align:right;color:#595969;font:9px Consolas,"Courier New",monospace}.feedback-status{min-height:18px;margin-bottom:10px;font-size:11px}.feedback-status.success{color:var(--cyan)}.feedback-status.error{color:#ff7d9a}.feedback-submit{width:100%;cursor:pointer}body.modal-open{overflow:hidden}
    @media (max-width:900px){.testimonials-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:700px){.testimonials-toolbar{align-items:stretch;flex-direction:column}.testimonials-toolbar .btn{width:100%}.testimonials-grid{grid-template-columns:1fr}.feedback-dialog{padding:23px}.feedback-dialog-header h3{font-size:22px}.feedback-form .form-row{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function getFeedbacks() {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Não foi possível ler os feedbacks.", error);
    return [];
  }
}

function saveFeedbacks(feedbacks) { localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks)); }
function escapeHTML(value) { return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function getInitials(name) { return name.trim().split(/\s+/).slice(0,2).map((part)=>part[0]?.toUpperCase()||"").join(""); }
function formatFeedbackDate(dateString) { const date=new Date(dateString); return Number.isNaN(date.getTime()) ? "data desconhecida" : new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}).format(date); }
function renderFeedbackStars(rating) { return "★★★★★".split("").map((star,index)=>index<rating?star:"☆").join(""); }

function renderFeedbacks() {
  const list=document.getElementById("testimonials-list");
  const empty=document.getElementById("testimonials-empty");
  const average=document.getElementById("average-rating");
  const stars=document.getElementById("average-stars");
  const count=document.getElementById("rating-count");
  if(!list) return;
  const feedbacks=getFeedbacks().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  list.innerHTML="";
  feedbacks.forEach((feedback)=>{
    const card=document.createElement("article");
    card.className="testimonial-card";
    card.innerHTML=`<div class="testimonial-card-top"><div class="testimonial-author"><div class="testimonial-avatar" aria-hidden="true">${escapeHTML(getInitials(feedback.name))}</div><div><strong>${escapeHTML(feedback.name)}</strong><small>${feedback.role?escapeHTML(feedback.role):"Cliente / colaborador"}</small></div></div><div class="testimonial-rating" aria-label="${feedback.rating} de 5 estrelas">${renderFeedbackStars(feedback.rating)}</div></div><p class="testimonial-message">${escapeHTML(feedback.message)}</p><small class="testimonial-date">${formatFeedbackDate(feedback.createdAt)}</small>`;
    list.appendChild(card);
  });
  const hasFeedback=feedbacks.length>0;
  list.hidden=!hasFeedback;
  if(empty) empty.hidden=hasFeedback;
  if(count) count.textContent=feedbacks.length;
  if(!hasFeedback){if(average) average.textContent="—";if(stars) stars.textContent="☆☆☆☆☆";return;}
  const avg=feedbacks.reduce((sum,item)=>sum+Number(item.rating),0)/feedbacks.length;
  if(average) average.textContent=(Math.round(avg*10)/10).toFixed(1).replace(".",",");
  if(stars) stars.textContent=renderFeedbackStars(Math.round(avg));
}

function openFeedbackModal(){const modal=document.getElementById("feedback-modal");if(!modal)return;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");setTimeout(()=>document.getElementById("feedback-name")?.focus(),50);}
function closeFeedbackModal(){const modal=document.getElementById("feedback-modal");if(!modal)return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");}

function bindFeedbackEvents(){
  const modal=document.getElementById("feedback-modal");
  const form=document.getElementById("feedback-form");
  const open=document.getElementById("open-feedback-modal");
  const openEmpty=document.getElementById("open-feedback-empty");
  const close=document.getElementById("close-feedback-modal");
  const message=document.getElementById("feedback-message");
  const stars=document.querySelectorAll(".star-button");
  const hint=document.getElementById("rating-hint");
  const status=document.getElementById("feedback-status");
  const charCount=document.getElementById("feedback-char-count");
  let selectedRating=0;

  open?.addEventListener("click",openFeedbackModal);openEmpty?.addEventListener("click",openFeedbackModal);close?.addEventListener("click",closeFeedbackModal);
  modal?.addEventListener("click",(event)=>{if(event.target.matches("[data-close-feedback]"))closeFeedbackModal();});
  document.addEventListener("keydown",(event)=>{if(event.key==="Escape"&&modal?.classList.contains("open"))closeFeedbackModal();});

  const setRating=(rating)=>{selectedRating=Number(rating);stars.forEach((button)=>button.classList.toggle("active",Number(button.dataset.rating)<=selectedRating));if(hint)hint.textContent=`${selectedRating} ${selectedRating===1?"estrela":"estrelas"} selecionada${selectedRating===1?"":"s"}`;document.querySelector('[data-error-for="rating"]').textContent="";};
  stars.forEach((button)=>{
    button.addEventListener("mouseenter",()=>stars.forEach((star)=>star.classList.toggle("active",Number(star.dataset.rating)<=Number(button.dataset.rating))));
    button.addEventListener("mouseleave",()=>stars.forEach((star)=>star.classList.toggle("active",Number(star.dataset.rating)<=selectedRating)));
    button.addEventListener("click",()=>setRating(button.dataset.rating));
  });
  message?.addEventListener("input",()=>{charCount.textContent=message.value.length;});

  form?.addEventListener("submit",(event)=>{
    event.preventDefault();
    document.querySelectorAll(".field-error").forEach((el)=>el.textContent="");
    document.querySelectorAll(".input-group").forEach((el)=>el.classList.remove("invalid"));
    const name=document.getElementById("feedback-name").value.trim();
    const role=document.getElementById("feedback-role").value.trim();
    const textMessage=message.value.trim();
    let valid=true;
    if(name.length<2){document.querySelector('[data-error-for="name"]').textContent="Digite seu nome.";document.getElementById("feedback-name").closest(".input-group").classList.add("invalid");valid=false;}
    if(selectedRating<1||selectedRating>5){document.querySelector('[data-error-for="rating"]').textContent="Selecione uma nota de 1 a 5.";valid=false;}
    if(textMessage.length<10){document.querySelector('[data-error-for="message"]').textContent="O depoimento precisa ter pelo menos 10 caracteres.";message.closest(".input-group").classList.add("invalid");valid=false;}
    if(!valid){status.className="feedback-status error";status.textContent="Revise os campos destacados antes de enviar.";return;}
    const feedbacks=getFeedbacks();
    feedbacks.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,name,role,rating:selectedRating,message:textMessage,createdAt:new Date().toISOString()});
    saveFeedbacks(feedbacks);renderFeedbacks();
    status.className="feedback-status success";status.textContent="Feedback salvo com sucesso neste navegador.";
    setTimeout(()=>{form.reset();selectedRating=0;stars.forEach((star)=>star.classList.remove("active"));hint.textContent="Selecione de 1 a 5 estrelas";charCount.textContent="0";status.textContent="";status.className="feedback-status";closeFeedbackModal();document.getElementById("testimonials")?.scrollIntoView({behavior:"smooth"});},700);
  });
}

feedbackMarkup();
bindFeedbackEvents();
renderFeedbacks();
