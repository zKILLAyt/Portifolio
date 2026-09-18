/* =========================================================
   START PAGE AT TOP
   ========================================================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

/* =========================================================
   SEU CÓDIGO ATUAL
   ========================================================= */

/* =========================================================
   SATTURNO SECURITY
   CyberSecurity × Space × Orbital Monitoring
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
       CANVAS
       ===================================================== */

  const canvas = document.getElementById("cyber-background");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  /* =====================================================
       CONFIGURAÇÕES
       ===================================================== */

  const config = {
    stars: Math.min(130, Math.floor(window.innerWidth / 10)),

    gridSize: 70,

    orbitCount: 3,

    scanSpeed: 0.0018,
  };

  /* =====================================================
       ESTRELAS
       ===================================================== */

  const stars = [];

  const createStars = () => {
    stars.length = 0;

    for (let i = 0; i < config.stars; i++) {
      stars.push({
        x: Math.random() * width,

        y: Math.random() * height,

        radius: Math.random() * 1.3 + 0.2,

        speed: Math.random() * 0.18 + 0.025,

        opacity: Math.random() * 0.65 + 0.15,

        twinkle: Math.random() * Math.PI * 2,

        twinkleSpeed: Math.random() * 0.025 + 0.008,
      });
    }
  };

  createStars();

  /* =====================================================
       ORBITAL PARTICLES
       ===================================================== */

  const orbitalParticles = [];

  for (let i = 0; i < 8; i++) {
    orbitalParticles.push({
      orbit: Math.floor(Math.random() * config.orbitCount),

      angle: Math.random() * Math.PI * 2,

      speed: 0.0015 + Math.random() * 0.002,

      size: Math.random() * 1.5 + 0.7,
    });
  }

  /* =====================================================
       SCAN LINE
       ===================================================== */

  let scanPosition = -100;

  /* =====================================================
       TEMPO
       ===================================================== */

  let lastTime = performance.now();

  /* =====================================================
       DESENHAR ESTRELAS
       ===================================================== */

  const drawStars = (delta) => {
    stars.forEach((star) => {
      star.twinkle += star.twinkleSpeed * delta;

      const pulse = (Math.sin(star.twinkle) + 1) / 2;

      const opacity = star.opacity * (0.55 + pulse * 0.45);

      /*
       * Pequeno movimento vertical
       */

      star.y += star.speed * delta * 0.03;

      if (star.y > height + 5) {
        star.y = -5;

        star.x = Math.random() * width;
      }

      ctx.beginPath();

      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(196, 181, 253, ${opacity})`;

      ctx.fill();
    });
  };

  /* =====================================================
       GRID
       ===================================================== */

  const drawGrid = () => {
    const size = config.gridSize;

    ctx.lineWidth = 0.5;

    /*
     * Linhas verticais
     */

    for (let x = 0; x <= width; x += size) {
      ctx.beginPath();

      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);

      ctx.strokeStyle = "rgba(139, 92, 246, 0.022)";

      ctx.stroke();
    }

    /*
     * Linhas horizontais
     */

    for (let y = 0; y <= height; y += size) {
      ctx.beginPath();

      ctx.moveTo(0, y);
      ctx.lineTo(width, y);

      ctx.strokeStyle = "rgba(34, 211, 238, 0.018)";

      ctx.stroke();
    }
  };

  /* =====================================================
       CENTRO DO SISTEMA ORBITAL
       ===================================================== */

  const getOrbitalCenter = () => {
    return {
      x: width * 0.82,

      y: height * 0.48,
    };
  };

  /* =====================================================
       ÓRBITAS
       ===================================================== */

  const drawOrbits = () => {
    const center = getOrbitalCenter();

    const orbitSizes = [
      {
        rx: 180,
        ry: 62,
      },

      {
        rx: 260,
        ry: 92,
      },

      {
        rx: 355,
        ry: 125,
      },
    ];

    orbitSizes.forEach((orbit, index) => {
      ctx.save();

      ctx.translate(center.x, center.y);

      ctx.rotate(-0.18);

      ctx.beginPath();

      ctx.ellipse(0, 0, orbit.rx, orbit.ry, 0, 0, Math.PI * 2);

      ctx.strokeStyle =
        index === 1 ? "rgba(34, 211, 238, 0.10)" : "rgba(139, 92, 246, 0.10)";

      ctx.lineWidth = index === 1 ? 1 : 0.7;

      ctx.stroke();

      ctx.restore();
    });
  };

  /* =====================================================
       NÚCLEO ORBITAL
       ===================================================== */

  const drawOrbitalCore = () => {
    const center = getOrbitalCenter();

    const gradient = ctx.createRadialGradient(
      center.x,
      center.y,
      0,
      center.x,
      center.y,
      100,
    );

    gradient.addColorStop(0, "rgba(139, 92, 246, 0.16)");

    gradient.addColorStop(0.45, "rgba(139, 92, 246, 0.04)");

    gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

    ctx.beginPath();

    ctx.arc(center.x, center.y, 100, 0, Math.PI * 2);

    ctx.fillStyle = gradient;

    ctx.fill();

    /*
     * Núcleo
     */

    ctx.beginPath();

    ctx.arc(center.x, center.y, 3, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(34, 211, 238, 0.75)";

    ctx.shadowBlur = 15;

    ctx.shadowColor = "rgba(34, 211, 238, 0.8)";

    ctx.fill();

    ctx.shadowBlur = 0;
  };

  /* =====================================================
       PARTÍCULAS NAS ÓRBITAS
       ===================================================== */

  const updateOrbitalParticles = (delta) => {
    const center = getOrbitalCenter();

    const orbitSizes = [
      {
        rx: 180,
        ry: 62,
      },

      {
        rx: 260,
        ry: 92,
      },

      {
        rx: 355,
        ry: 125,
      },
    ];

    orbitalParticles.forEach((particle) => {
      particle.angle += particle.speed * delta;

      const orbit = orbitSizes[particle.orbit];

      const x = center.x + Math.cos(particle.angle) * orbit.rx;

      const y = center.y + Math.sin(particle.angle) * orbit.ry;

      ctx.beginPath();

      ctx.arc(x, y, particle.size, 0, Math.PI * 2);

      ctx.fillStyle =
        particle.orbit === 1
          ? "rgba(34, 211, 238, 0.7)"
          : "rgba(167, 139, 250, 0.65)";

      ctx.shadowBlur = 10;

      ctx.shadowColor =
        particle.orbit === 1 ? "rgba(34,211,238,.5)" : "rgba(139,92,246,.5)";

      ctx.fill();

      ctx.shadowBlur = 0;
    });
  };

  /* =====================================================
       SECURITY SCAN
       ===================================================== */

  const drawSecurityScan = (delta) => {
    scanPosition += config.scanSpeed * delta * height;

    if (scanPosition > height + 100) {
      scanPosition = -100;
    }

    /*
     * Linha principal
     */

    const gradient = ctx.createLinearGradient(
      0,
      scanPosition - 80,
      0,
      scanPosition + 80,
    );

    gradient.addColorStop(0, "rgba(34, 211, 238, 0)");

    gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.06)");

    gradient.addColorStop(1, "rgba(34, 211, 238, 0)");

    ctx.fillStyle = gradient;

    ctx.fillRect(0, scanPosition - 80, width, 160);

    /*
     * Linha fina do scanner
     */

    ctx.beginPath();

    ctx.moveTo(0, scanPosition);

    ctx.lineTo(width, scanPosition);

    ctx.strokeStyle = "rgba(34, 211, 238, 0.12)";

    ctx.lineWidth = 1;

    ctx.stroke();
  };

  /* =====================================================
       ANIMAÇÃO PRINCIPAL
       ===================================================== */

  const animate = (time) => {
    const delta = Math.min(time - lastTime, 50);

    lastTime = time;

    ctx.clearRect(0, 0, width, height);

    drawGrid();

    drawStars(delta);

    drawOrbits();

    drawOrbitalCore();

    updateOrbitalParticles(delta);

    drawSecurityScan(delta);

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);

  /* =====================================================
       REVEAL DAS SEÇÕES
       ===================================================== */

  const revealElements = document.querySelectorAll(
    ".security-card, " +
      ".security-about-text, " +
      ".security-terminal, " +
      ".projects-empty, " +
      ".saturno-security-content",
  );

  revealElements.forEach((element) => {
    element.style.opacity = "0";

    element.style.transform = "translateY(30px)";

    element.style.transition = "opacity .8s ease, " + "transform .8s ease";
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.style.opacity = "1";

        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  /* =====================================================
       TERMINAL
       ===================================================== */

  const terminalLine = document.querySelector(".terminal-content p:last-child");

  if (terminalLine) {
    const originalText = terminalLine.textContent.trim();

    terminalLine.textContent = "";

    let index = 0;

    const typeTerminal = () => {
      if (index < originalText.length) {
        terminalLine.textContent += originalText[index];

        index++;

        setTimeout(typeTerminal, 70);
      }
    };

    setTimeout(typeTerminal, 1000);
  }

  /* =====================================================
       CARDS — EFEITO HOLOGRÁFICO
       ===================================================== */

  const cards = document.querySelectorAll(".security-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      /*
       * Não aplicar em dispositivos
       * sem mouse.
       */

      if (window.innerWidth < 700) {
        return;
      }

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;

      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 45;

      const rotateY = (centerX - x) / 45;

      card.style.transform = `
                        translateY(-7px)
                        perspective(700px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });

  /* =====================================================
       STATUS SATTURNO
       ===================================================== */

  const status = document.querySelector(".saturno-status");

  if (status) {
    setInterval(() => {
      status.classList.toggle("status-pulse");
    }, 1800);
  }

  /* =====================================================
       NAVEGAÇÃO SUAVE
       ===================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") {
        return;
      }

      const target = document.querySelector(id);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* =====================================================
       TERMINAL / CONSOLE
       ===================================================== */

  console.log(
    "%c╔══════════════════════════════════════╗",
    "color:#8b5cf6;font-weight:bold;",
  );

  console.log(
    "%c║       SATTURNO SECURITY SYSTEM       ║",
    "color:#22d3ee;font-weight:bold;",
  );

  console.log(
    "%c╚══════════════════════════════════════╝",
    "color:#8b5cf6;font-weight:bold;",
  );

  console.log(
    "%c[✓] Orbital monitoring initialized",
    "color:#34d399;font-family:monospace;",
  );

  console.log(
    "%c[✓] Security scan active",
    "color:#34d399;font-family:monospace;",
  );

  console.log(
    "%c[✓] Satellite network online",
    "color:#34d399;font-family:monospace;",
  );
});

/* =====================================================
   ORBITAL MONITOR
   ===================================================== */

const orbitalMonitor = document.querySelector(".orbital-monitor");

if (orbitalMonitor) {
  orbitalMonitor.addEventListener("mouseenter", () => {
    orbitalMonitor.style.borderColor = "rgba(34, 211, 238, 0.35)";

    orbitalMonitor.style.boxShadow = `
                0 35px 90px rgba(0,0,0,.45),
                0 0 60px rgba(34,211,238,.08)
                `;
  });

  orbitalMonitor.addEventListener("mouseleave", () => {
    orbitalMonitor.style.borderColor = "rgba(139,92,246,.22)";

    orbitalMonitor.style.boxShadow = `
                0 35px 90px rgba(0,0,0,.45),
                0 0 60px rgba(139,92,246,.08)
                `;
  });
}
/* =========================================================
   SATTURNO SECURITY CENTER
   Simulação de monitoramento em tempo real
   ========================================================= */

const SecurityCenter = (() => {
  const packetsElement = document.getElementById("packets-value");
  const trafficElement = document.getElementById("traffic-value");
  const connectionsElement = document.getElementById("connections-value");
  const logContainer = document.getElementById("security-log-container");

  // Se o dashboard não estiver na página, não executa
  if (!packetsElement || !trafficElement || !connectionsElement) {
    return;
  }

  let packets = 12847;
  let traffic = 64;
  let connections = 23;

  const logs = [
    {
      type: "OK",
      message: "Network integrity verified",
    },
    {
      type: "OK",
      message: "Security protocols active",
    },
    {
      type: "INFO",
      message: "Orbital monitoring initialized",
    },
    {
      type: "OK",
      message: "SAT-SEC communication established",
    },
    {
      type: "INFO",
      message: "Security modules synchronized",
    },
    {
      type: "OK",
      message: "Firewall status verified",
    },
    {
      type: "INFO",
      message: "Network traffic analysis running",
    },
  ];

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateCounters() {
    packets += randomNumber(8, 42);

    traffic += randomNumber(-5, 6);

    connections += randomNumber(-2, 3);

    // Limites
    traffic = Math.max(25, Math.min(95, traffic));
    connections = Math.max(8, Math.min(50, connections));

    packetsElement.textContent = packets.toLocaleString("pt-BR");

    trafficElement.textContent = `${traffic}%`;

    connectionsElement.textContent = connections;
  }

  function getCurrentTime() {
    const now = new Date();

    return now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function addLog() {
    if (!logContainer) return;

    const randomLog = logs[Math.floor(Math.random() * logs.length)];

    const logEntry = document.createElement("div");

    logEntry.className = "log-entry";

    logEntry.innerHTML = `
            <span class="log-time">
                ${getCurrentTime()}
            </span>

            <span class="log-type ${randomLog.type.toLowerCase()}">
                [${randomLog.type}]
            </span>

            <span class="log-message">
                ${randomLog.message}
            </span>
        `;

    logContainer.prepend(logEntry);

    // Limita quantidade de logs
    const allLogs = logContainer.querySelectorAll(".log-entry");

    if (allLogs.length > 8) {
      allLogs[allLogs.length - 1].remove();
    }
  }

  function animateValue(element) {
    element.classList.remove("value-update");

    void element.offsetWidth;

    element.classList.add("value-update");
  }

  function updateDashboard() {
    updateCounters();

    animateValue(packetsElement);
    animateValue(trafficElement);
    animateValue(connectionsElement);
  }

  // Atualização inicial
  updateDashboard();

  // Atualiza números
  setInterval(updateDashboard, 2200);

  // Novo log
  setInterval(addLog, 3500);

  console.log(
    "%c[ SATTURNO SECURITY CENTER ]",
    "color:#9b5cff;font-weight:bold;font-size:14px",
  );

  console.log("%cMonitoring simulation initialized.", "color:#00e5ff");
})();
/* =========================================================
   SECURITY ARSENAL
   ========================================================= */

const SecurityArsenal = (() => {
  const progressBars = document.querySelectorAll(".skill-progress");

  if (!progressBars.length) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const bars = entry.target.querySelectorAll(".skill-progress");

        bars.forEach((bar) => {
          const progress = bar.dataset.progress;

          setTimeout(() => {
            bar.style.width = `${progress}%`;
          }, 150);
        });

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.25,
    },
  );

  const arsenal = document.querySelector(".security-arsenal");

  if (arsenal) {
    observer.observe(arsenal);
  }
})();

/* =========================================================
   SATTURNO SECURITY - INTERACTIVE TERMINAL
   ========================================================= */

const SatturnoTerminal = (() => {
  const terminal = document.getElementById("terminal-output");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");

  if (!terminal || !form || !input) return;

  let commandHistory = [];
  let historyIndex = -1;

  const commands = {
    saturn: () => `
    <div class="terminal-line terminal-purple">
        ◉ SATTURNO CORE
    </div>

    <div class="terminal-line">
        Orbital identity system initialized.
    </div>

    <div class="terminal-line terminal-cyan">
        SATURN STATUS: STABLE
    </div>

    <div class="terminal-line terminal-muted">
        Rings detected: 7
    </div>

    <div class="terminal-line terminal-muted">
        Security orbit: ACTIVE
    </div>
`,

    orbit: () => `
    <div class="terminal-line terminal-cyan">
        [ SATTURNO ORBITAL MONITOR ]
    </div>

    <div class="terminal-line">
        Establishing orbital synchronization...
    </div>

    <div class="terminal-line terminal-green">
        [✓] PRIMARY ORBIT ........ STABLE
    </div>

    <div class="terminal-line terminal-green">
        [✓] SECURITY ORBIT ....... ACTIVE
    </div>

    <div class="terminal-line terminal-green">
        [✓] SAT-SEC LINK .......... CONNECTED
    </div>

    <div class="terminal-line terminal-muted">
        Orbital monitoring simulation complete.
    </div>
`,

    scan: () => `
    <div class="terminal-line terminal-cyan">
        [ SATTURNO SECURITY SCANNER ]
    </div>

    <div class="terminal-line">
        Initializing security scan...
    </div>

    <div class="terminal-line">
        [████████████████████] 100%
    </div>

    <br>

    <div class="terminal-line terminal-green">
        [✓] Local environment analyzed
    </div>

    <div class="terminal-line terminal-green">
        [✓] Security modules checked
    </div>

    <div class="terminal-line terminal-green">
        [✓] Network simulation analyzed
    </div>

    <br>

    <div class="terminal-line terminal-green">
        THREAT LEVEL: LOW
    </div>

    <div class="terminal-line terminal-muted">
        No real network scanning performed.
    </div>
`,

    matrix: () => `
    <div class="terminal-line terminal-cyan">
        SATTURNO // SECURITY MATRIX
    </div>

    <div class="terminal-line terminal-muted">
        Initializing knowledge matrix...
    </div>

    <br>

    <div class="terminal-line">
        LINUX ................. BASIC
    </div>

    <div class="terminal-line">
        NETWORKING ............ BASIC
    </div>

    <div class="terminal-line">
        WEB SECURITY .......... BASIC
    </div>

    <div class="terminal-line">
        OWASP ................ BASIC
    </div>

    <div class="terminal-line">
        PYTHON ............... BASIC
    </div>

    <div class="terminal-line">
        ETHICAL HACKING ....... BASIC
    </div>

    <br>

    <div class="terminal-line terminal-purple">
        KNOWLEDGE MATRIX: INITIALIZED
    </div>
`,

    "sudo satturno": () => `
    <div class="terminal-line terminal-purple">
        Accessing SATTURNO CORE...
    </div>

    <div class="terminal-line">
        [████████████████████] 100%
    </div>

    <br>

    <div class="terminal-line terminal-green">
        ACCESS GRANTED
    </div>

    <br>

    <div class="terminal-line terminal-cyan">
        Welcome back, Operator.
    </div>

    <br>

    <div class="terminal-line terminal-green">
        &gt; SATTURNO CORE ONLINE
    </div>

    <div class="terminal-line terminal-green">
        &gt; SECURITY PROTOCOLS ACTIVE
    </div>

    <div class="terminal-line terminal-green">
        &gt; ORBITAL SYSTEM CONNECTED
    </div>
`,
    help: () => `
            <div class="terminal-line terminal-cyan">
                Available commands:
            </div>

            <div class="terminal-command-list">

                <div>
                    <span>help</span>
                    <small>Lista os comandos disponíveis</small>
                </div>

                <div>
                    <span>about</span>
                    <small>Sobre o Satturno Security</small>
                </div>

                <div>
                    <span>skills</span>
                    <small>Visualiza minhas áreas de estudo</small>
                </div>

                <div>
                    <span>projects</span>
                    <small>Lista projetos relacionados</small>
                </div>

                <div>
                    <span>status</span>
                    <small>Verifica o status do sistema</small>
                </div>

                <div>
                    <span>clear</span>
                    <small>Limpa o terminal</small>
                </div>

                <div>
                    <span>whoami</span>
                    <small>Identificação do operador</small>
                </div>

                <div>
                    <span>date</span>
                    <small>Mostra a data atual</small>
                </div>

            </div>
        `,

    about: () => `
            <div class="terminal-line terminal-purple">
                SATTURNO SECURITY
            </div>

            <div class="terminal-line">
                Security & Technology Laboratory
            </div>

            <div class="terminal-line">
                Ambiente experimental focado em CyberSecurity,
                desenvolvimento e automação.
            </div>

            <div class="terminal-line terminal-muted">
                Status: LEARNING / BUILDING / EVOLVING
            </div>
        `,

    skills: () => `
            <div class="terminal-line terminal-cyan">
                SECURITY SKILLS
            </div>

            <div class="terminal-line">
                [ BASIC ] Linux
            </div>

            <div class="terminal-line">
                [ BASIC ] Networking
            </div>

            <div class="terminal-line">
                [ BASIC ] Web Security
            </div>

            <div class="terminal-line">
                [ BASIC ] OWASP
            </div>

            <div class="terminal-line">
                [ BASIC ] Python
            </div>

            <div class="terminal-line">
                [ BASIC ] Ethical Hacking
            </div>
        `,

    projects: () => `
            <div class="terminal-line terminal-cyan">
                SECURITY PROJECTS
            </div>

            <div class="terminal-line">
                [01] Satturno Security
            </div>

            <div class="terminal-line">
                [02] Security Monitoring Interface
            </div>

            <div class="terminal-line">
                [03] Interactive Security Terminal
            </div>

            <div class="terminal-line terminal-muted">
                More projects are currently being developed...
            </div>
        `,

    status: () => `
            <div class="terminal-line terminal-green">
                SYSTEM STATUS
            </div>

            <div class="terminal-line">
                [✓] CORE SYSTEM ............ ONLINE
            </div>

            <div class="terminal-line">
                [✓] NETWORK ................ SECURE
            </div>

            <div class="terminal-line">
                [✓] SECURITY MODULES ....... ACTIVE
            </div>

            <div class="terminal-line">
                [✓] ORBITAL MONITORING ..... ACTIVE
            </div>

            <div class="terminal-line">
                [!] THREAT LEVEL ........... LOW
            </div>
        `,

    whoami: () => `
            <div class="terminal-line terminal-cyan">
                OPERATOR IDENTIFICATION
            </div>

            <div class="terminal-line">
                User: Gustavo
            </div>

            <div class="terminal-line">
                Role: Developer / Security Student
            </div>

            <div class="terminal-line">
                Environment: SATTURNO SECURITY
            </div>
        `,

    date: () => {
      return `
                <div class="terminal-line terminal-muted">
                    ${new Date().toLocaleString("pt-BR")}
                </div>
            `;
    },
  };

  /* =====================================================
       ESCAPAR HTML
       ===================================================== */

  function escapeHTML(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  }

  /* =====================================================
       PRINT
       ===================================================== */

  function printCommand(command) {
    const line = document.createElement("div");

    line.className = "terminal-command";

    line.innerHTML = `
            <span class="terminal-prompt-text">
                SATTURNO@SECURITY:~$
            </span>

            <span>
                ${escapeHTML(command)}
            </span>
        `;

    terminal.appendChild(line);
  }

  /* =====================================================
       PRINT RESULT
       ===================================================== */

  function printResult(result) {
    const resultElement = document.createElement("div");

    resultElement.className = "terminal-result";

    resultElement.innerHTML = result;

    terminal.appendChild(resultElement);
  }

  /* =====================================================
       UNKNOWN COMMAND
       ===================================================== */

  function unknownCommand(command) {
    return `
            <div class="terminal-line terminal-error">
                Command not found: ${escapeHTML(command)}
            </div>

            <div class="terminal-line terminal-muted">
                Type "help" to see available commands.
            </div>
        `;
  }

  /* =====================================================
       CLEAR
       ===================================================== */

  function clearTerminal() {
    terminal.innerHTML = "";
  }

  /* =====================================================
       EXECUTE
       ===================================================== */

  function executeCommand(command) {
    const normalizedCommand = command.trim().toLowerCase();

    if (!normalizedCommand) return;

    printCommand(command);

    if (normalizedCommand === "clear") {
      clearTerminal();

      return;
    }

    if (commands[normalizedCommand]) {
      printResult(commands[normalizedCommand]());
    } else {
      printResult(unknownCommand(command));
    }

    terminal.scrollTop = terminal.scrollHeight;
  }

  /* =====================================================
       SUBMIT
       ===================================================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const command = input.value.trim();

    if (!command) return;

    commandHistory.push(command);

    historyIndex = commandHistory.length;

    executeCommand(command);

    input.value = "";
  });

  /* =====================================================
       COMMAND HISTORY
       ===================================================== */

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!commandHistory.length) return;

      historyIndex = Math.max(0, historyIndex - 1);

      input.value = commandHistory[historyIndex] || "";
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!commandHistory.length) return;

      historyIndex = Math.min(commandHistory.length, historyIndex + 1);

      input.value = commandHistory[historyIndex] || "";
    }

    if (event.key === "Tab") {
      event.preventDefault();

      const current = input.value.trim().toLowerCase();

      const matches = Object.keys(commands).filter((command) =>
        command.startsWith(current),
      );

      if (matches.length === 1) {
        input.value = matches[0];
      }
    }
  });

  /* =====================================================
       FOCUS
       ===================================================== */

  document.addEventListener("click", (event) => {
    if (event.target.closest(".satturno-terminal")) {
      input.focus();
    }
  });

  /* =====================================================
       START
       ===================================================== */
   
  console.log("%c[ SATTURNO TERMINAL ]", "color:#00e5ff;font-weight:bold");
})();


/* =====================================================
   SECURITY LAB — PASSWORD ANALYZER
   ===================================================== */
(function initPasswordAnalyzer() {
  const panel = document.getElementById("password-analyzer-panel");
  const opener = document.querySelector("[data-open-password]");
  const closer = document.querySelector("[data-close-password]");
  const input = document.getElementById("password-lab-input");
  const toggle = document.querySelector("[data-toggle-password]");
  if (!panel || !opener || !closer || !input || !toggle) return;

  const scoreEl = document.getElementById("password-score");
  const fillEl = document.getElementById("password-score-fill");
  const strengthEl = document.getElementById("password-strength");
  const entropyEl = document.getElementById("password-entropy");
  const feedbackEl = document.getElementById("password-feedback");
  const metrics = {
    length: document.getElementById("metric-length"),
    upper: document.getElementById("metric-upper"),
    lower: document.getElementById("metric-lower"),
    number: document.getElementById("metric-number"),
    symbol: document.getElementById("metric-symbol")
  };

  function mark(el, ok) { el.textContent = ok ? "✓" : "✕"; }

  function analyze(value) {
    const length = value.length;
    const upper = /[A-ZÀ-ÖØ-Þ]/.test(value);
    const lower = /[a-zà-öø-ÿ]/.test(value);
    const number = /\d/.test(value);
    const symbol = /[^A-Za-zÀ-ÖØ-öø-ÿ0-9]/.test(value);
    let pool = 0;
    if (lower) pool += 26;
    if (upper) pool += 26;
    if (number) pool += 10;
    if (symbol) pool += 33;

    const entropy = length && pool ? Math.round(length * Math.log2(pool)) : 0;
    let score = Math.min(100, Math.round((length / 20) * 45) + (upper ? 12 : 0) + (lower ? 10 : 0) + (number ? 12 : 0) + (symbol ? 16 : 0));
    if (length < 8) score = Math.min(score, 35);
    if (/(.)\1\1/.test(value)) score = Math.max(0, score - 10);
    if (/^(password|123456|12345678|qwerty|admin|senha|letmein)/i.test(value)) score = Math.min(score, 15);

    let label = "MUITO FRACA";
    if (score >= 80) label = "MUITO FORTE";
    else if (score >= 60) label = "FORTE";
    else if (score >= 40) label = "MODERADA";
    else if (score >= 20) label = "FRACA";

    metrics.length.textContent = String(length);
    mark(metrics.upper, upper); mark(metrics.lower, lower); mark(metrics.number, number); mark(metrics.symbol, symbol);
    scoreEl.textContent = `${score} / 100`;
    fillEl.style.width = `${score}%`;
    strengthEl.textContent = length ? label : "AGUARDANDO INPUT";
    entropyEl.textContent = `Entropy: ${entropy} bits`;

    const tips = [];
    if (length < 12) tips.push("use pelo menos 12 caracteres");
    if (!upper) tips.push("adicione letras maiúsculas");
    if (!lower) tips.push("adicione letras minúsculas");
    if (!number) tips.push("adicione números");
    if (!symbol) tips.push("adicione símbolos");
    if (/(.)\1\1/.test(value)) tips.push("evite caracteres repetidos em sequência");
    if (/^(password|123456|12345678|qwerty|admin|senha|letmein)/i.test(value)) tips.push("evite palavras ou padrões previsíveis");

    feedbackEl.textContent = !length ? "Digite uma senha para iniciar a análise." : tips.length ? `Recomendação: ${tips.join("; ")}.` : "Boa composição. Prefira ainda uma senha única e longa para cada serviço.";
  }

  function open() {
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => input.focus(), 120);
  }
  function close() { panel.hidden = true; opener.focus(); }

  opener.addEventListener("click", open);
  opener.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  closer.addEventListener("click", close);
  input.addEventListener("input", () => analyze(input.value));
  toggle.addEventListener("click", () => {
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    toggle.setAttribute("aria-label", visible ? "Mostrar senha" : "Ocultar senha");
    toggle.innerHTML = `<i class="fa-solid fa-eye${visible ? "" : "-slash"}"></i>`;
  });
  analyze("");
})();


/* =========================================================
   SECURITY LAB — HASH GENERATOR
   ========================================================= */
(function initHashGenerator() {
  const panel = document.getElementById("hash-generator-panel");
  const opener = document.querySelector("[data-open-hash]");
  const closer = document.querySelector("[data-close-hash]");
  const input = document.getElementById("hash-lab-input");
  const algorithm = document.getElementById("hash-algorithm");
  const generateBtn = document.getElementById("hash-generate-btn");
  const copyBtn = document.getElementById("hash-copy-btn");
  const result = document.getElementById("hash-result");
  const resultLabel = document.getElementById("hash-result-label");
  const charCount = document.getElementById("hash-char-count");
  const feedback = document.getElementById("hash-feedback");

  if (!panel || !opener || !closer || !input || !algorithm || !generateBtn || !copyBtn || !result || !resultLabel || !charCount || !feedback) return;

  let currentHash = "";

  function updateCount() {
    const length = input.value.length;
    charCount.textContent = `${length} ${length === 1 ? "caractere" : "caracteres"}`;
  }

  function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, "0")).join("");
  }

  async function generateHash() {
    const value = input.value;
    if (!value) {
      currentHash = "";
      result.textContent = "Digite um texto para gerar o hash.";
      copyBtn.disabled = true;
      feedback.textContent = "Nenhuma entrada fornecida.";
      return;
    }

    if (!window.crypto || !window.crypto.subtle) {
      feedback.textContent = "Web Crypto API indisponível neste navegador.";
      return;
    }

    generateBtn.disabled = true;
    generateBtn.setAttribute("aria-busy", "true");
    feedback.textContent = "Processando localmente...";

    try {
      const data = new TextEncoder().encode(value);
      const hashBuffer = await window.crypto.subtle.digest(algorithm.value, data);
      currentHash = bufferToHex(hashBuffer);
      result.textContent = currentHash;
      resultLabel.textContent = `${algorithm.value} OUTPUT`;
      copyBtn.disabled = false;
      feedback.textContent = "Hash gerado localmente. Nenhum dado foi enviado ao servidor.";
    } catch (error) {
      currentHash = "";
      result.textContent = "Não foi possível gerar o hash.";
      copyBtn.disabled = true;
      feedback.textContent = "Erro ao processar a entrada.";
    } finally {
      generateBtn.disabled = false;
      generateBtn.removeAttribute("aria-busy");
    }
  }

  async function copyHash() {
    if (!currentHash) return;
    try {
      await navigator.clipboard.writeText(currentHash);
      feedback.textContent = "Hash copiado para a área de transferência.";
    } catch {
      feedback.textContent = "Não foi possível copiar automaticamente. Selecione o hash manualmente.";
    }
  }

  function open() {
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => input.focus(), 120);
  }

  function close() {
    panel.hidden = true;
    opener.focus();
  }

  opener.addEventListener("click", open);
  opener.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
  closer.addEventListener("click", close);
  input.addEventListener("input", updateCount);
  algorithm.addEventListener("change", () => {
    if (input.value) generateHash();
    else resultLabel.textContent = `${algorithm.value} OUTPUT`;
  });
  generateBtn.addEventListener("click", generateHash);
  copyBtn.addEventListener("click", copyHash);

  updateCount();
})();


/* =========================================================
   SECURITY LAB — JWT DECODER
   ========================================================= */
(function initJwtDecoder() {
  const panel = document.getElementById("jwt-decoder-panel");
  const openers = document.querySelectorAll("[data-open-jwt]");
  const closer = document.querySelector("[data-close-jwt]");
  const input = document.getElementById("jwt-lab-input");
  const decodeBtn = document.getElementById("jwt-decode-btn");
  const clearBtn = document.getElementById("jwt-clear-btn");
  const count = document.getElementById("jwt-char-count");
  const status = document.getElementById("jwt-status");
  const headerOut = document.getElementById("jwt-header-output");
  const payloadOut = document.getElementById("jwt-payload-output");
  const signatureOut = document.getElementById("jwt-signature-output");
  const headerStatus = document.getElementById("jwt-header-status");
  const payloadStatus = document.getElementById("jwt-payload-status");
  const signatureStatus = document.getElementById("jwt-signature-status");

  if (!panel || !openers.length || !closer || !input || !decodeBtn || !clearBtn) return;

  function base64UrlDecode(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }

  function parseSegment(segment) {
    const text = base64UrlDecode(segment);
    return JSON.parse(text);
  }

  function pretty(value) {
    return JSON.stringify(value, null, 2);
  }

  function updateCount() {
    const length = input.value.length;
    count.textContent = `${length} ${length === 1 ? "caractere" : "caracteres"}`;
  }

  function resetOutput() {
    headerOut.textContent = "Aguardando token...";
    payloadOut.textContent = "Aguardando token...";
    signatureOut.textContent = "A assinatura é exibida apenas para referência.";
    headerStatus.textContent = "WAITING";
    payloadStatus.textContent = "WAITING";
    signatureStatus.textContent = "NOT VERIFIED";
    status.textContent = "Os dados permanecem no navegador.";
  }

  function decode() {
    const token = input.value.trim();
    if (!token) {
      resetOutput();
      status.textContent = "Cole um JWT para iniciar a decodificação.";
      return;
    }

    const parts = token.split(".");
    if (parts.length !== 3 || parts.some(part => !part)) {
      resetOutput();
      status.textContent = "Formato inválido. Um JWT deve conter Header.Payload.Signature.";
      return;
    }

    try {
      const header = parseSegment(parts[0]);
      const payload = parseSegment(parts[1]);
      headerOut.textContent = pretty(header);
      payloadOut.textContent = pretty(payload);
      signatureOut.textContent = parts[2];
      headerStatus.textContent = "DECODED";
      payloadStatus.textContent = "DECODED";
      signatureStatus.textContent = "NOT VERIFIED";
      status.textContent = "JWT decodificado localmente. A assinatura não foi validada.";
    } catch (error) {
      resetOutput();
      status.textContent = "Não foi possível decodificar o token. Verifique Base64URL e JSON do Header/Payload.";
    }
  }

  function open() {
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => input.focus(), 120);
  }

  function close() {
    panel.hidden = true;
    openers[0].focus();
  }

  openers.forEach(opener => {
    opener.addEventListener("click", open);
    opener.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
  });
  closer.addEventListener("click", close);
  input.addEventListener("input", updateCount);
  decodeBtn.addEventListener("click", decode);
  clearBtn.addEventListener("click", () => { input.value = ""; updateCount(); resetOutput(); input.focus(); });
  updateCount();
})();


/* =========================================================
   SECURITY LAB — BASE64 TOOL
   ========================================================= */
(function initBase64Tool() {
  const panel=document.getElementById("base64-tool-panel"), openers=document.querySelectorAll("[data-open-base64]"), closer=document.querySelector("[data-close-base64]"), input=document.getElementById("base64-lab-input"), modeButtons=document.querySelectorAll("[data-base64-mode]"), runBtn=document.getElementById("base64-run-btn"), clearBtn=document.getElementById("base64-clear-btn"), copyBtn=document.getElementById("base64-copy-btn"), result=document.getElementById("base64-result"), resultLabel=document.getElementById("base64-result-label"), count=document.getElementById("base64-char-count"), feedback=document.getElementById("base64-feedback");
  if(!panel||!openers.length||!closer||!input||!runBtn||!clearBtn||!copyBtn)return;
  let mode="encode", currentResult="";
  function updateCount(){const n=input.value.length; count.textContent=`${n} ${n===1?"caractere":"caracteres"}`;}
  function resetResult(){currentResult="";result.textContent="Aguardando entrada...";copyBtn.disabled=true;feedback.textContent="Os dados permanecem no navegador.";}
  function setMode(next){mode=next==="decode"?"decode":"encode";modeButtons.forEach(b=>b.classList.toggle("is-active",b.dataset.base64Mode===mode));runBtn.innerHTML=`<i class="fa-solid fa-bolt"></i> ${mode.toUpperCase()}`;input.placeholder=mode==="encode"?"Digite o texto que deseja codificar...":"Cole uma string Base64 para decodificar...";resultLabel.textContent=mode==="encode"?"BASE64 OUTPUT":"DECODED TEXT";resetResult();}
  function encodeUtf8(value){const bytes=new TextEncoder().encode(value);let binary="";const size=0x8000;for(let i=0;i<bytes.length;i+=size)binary+=String.fromCharCode(...bytes.subarray(i,i+size));return btoa(binary);}
  function decodeUtf8(value){const normalized=value.trim();if(!normalized||normalized.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized))throw new Error("Invalid Base64");const binary=atob(normalized);const bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));return new TextDecoder("utf-8",{fatal:true}).decode(bytes);}
  function run(){const value=input.value;if(!value){resetResult();feedback.textContent=mode==="encode"?"Digite um texto para codificar.":"Cole uma string Base64 para decodificar.";return;}try{currentResult=mode==="encode"?encodeUtf8(value):decodeUtf8(value);result.textContent=currentResult||"(resultado vazio)";copyBtn.disabled=!currentResult;feedback.textContent=mode==="encode"?"Texto convertido para Base64 localmente.":"Base64 decodificado localmente com UTF-8.";}catch(e){currentResult="";result.textContent="Não foi possível decodificar este valor.";copyBtn.disabled=true;feedback.textContent="Base64 inválido ou texto UTF-8 corrompido.";}}
  async function copyResult(){if(!currentResult)return;try{await navigator.clipboard.writeText(currentResult);feedback.textContent="Resultado copiado para a área de transferência.";}catch(e){feedback.textContent="Não foi possível copiar automaticamente. Selecione o resultado manualmente.";}}
  function open(){panel.hidden=false;panel.scrollIntoView({behavior:"smooth",block:"nearest"});setTimeout(()=>input.focus(),120);} function close(){panel.hidden=true;openers[0].focus();}
  openers.forEach(o=>{o.addEventListener("click",open);o.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});});
  modeButtons.forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.base64Mode)));closer.addEventListener("click",close);input.addEventListener("input",updateCount);runBtn.addEventListener("click",run);clearBtn.addEventListener("click",()=>{input.value="";updateCount();resetResult();input.focus();});copyBtn.addEventListener("click",copyResult);updateCount();
})();

/* =====================================================
   SECURITY LAB — IP / CIDR CALCULATOR
   ===================================================== */
(() => {
  const panel = document.getElementById("ip-calculator-panel");
  const openers = document.querySelectorAll("[data-open-ip]");
  const closer = document.querySelector("[data-close-ip]");
  const input = document.getElementById("ip-lab-input");
  const calculateBtn = document.getElementById("ip-calculate-btn");
  const clearBtn = document.getElementById("ip-clear-btn");
  const status = document.getElementById("ip-status");
  const inputStatus = document.getElementById("ip-input-status");
  const presets = document.querySelectorAll("[data-ip-preset]");
  const outputIds = ["ip-network", "ip-broadcast", "ip-first-host", "ip-last-host", "ip-mask", "ip-host-count", "ip-cidr", "ip-total", "ip-wildcard"];

  if (!panel || !input || !calculateBtn || !clearBtn) return;

  const outputs = Object.fromEntries(outputIds.map(id => [id, document.getElementById(id)]));

  function setOpen(open) {
    panel.hidden = !open;
    if (open) input.focus();
  }

  function ipv4ToNumber(parts) {
    return (((parts[0] * 256) + parts[1]) * 256 + parts[2]) * 256 + parts[3];
  }

  function numberToIPv4(value) {
    return [
      Math.floor(value / 16777216) % 256,
      Math.floor(value / 65536) % 256,
      Math.floor(value / 256) % 256,
      value % 256
    ].join(".");
  }

  function parseIPv4(value) {
    const parts = value.split(".");
    if (parts.length !== 4 || parts.some(part => !/^\d{1,3}$/.test(part))) return null;
    const nums = parts.map(Number);
    if (nums.some(num => num < 0 || num > 255)) return null;
    return nums;
  }

  function maskFromPrefix(prefix) {
    if (prefix === 0) return 0;
    return (0xffffffff << (32 - prefix)) >>> 0;
  }

  function resetOutputs() {
    outputIds.forEach(id => { outputs[id].textContent = "—"; });
  }

  function calculate() {
    const raw = input.value.trim();
    const match = raw.match(/^([^/\s]+)\s*\/\s*(\d{1,2})$/);

    if (!match) {
      resetOutputs();
      inputStatus.textContent = "Formato esperado: IPv4/CIDR";
      status.textContent = "Use, por exemplo, 192.168.1.10/24.";
      return;
    }

    const parts = parseIPv4(match[1]);
    const prefix = Number(match[2]);

    if (!parts || prefix < 0 || prefix > 32) {
      resetOutputs();
      inputStatus.textContent = "Entrada inválida";
      status.textContent = "Informe um IPv4 válido e um prefixo entre /0 e /32.";
      return;
    }

    const ip = ipv4ToNumber(parts) >>> 0;
    const mask = maskFromPrefix(prefix);
    const network = (ip & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const total = 2 ** (32 - prefix);
    let firstHost = network;
    let lastHost = broadcast;
    let hosts = total;

    if (prefix <= 30) {
      firstHost = network + 1;
      lastHost = broadcast - 1;
      hosts = Math.max(total - 2, 0);
    } else if (prefix === 31) {
      hosts = 2;
    } else {
      hosts = 1;
    }

    const wildcard = (~mask) >>> 0;

    outputs["ip-network"].textContent = numberToIPv4(network);
    outputs["ip-broadcast"].textContent = numberToIPv4(broadcast);
    outputs["ip-first-host"].textContent = numberToIPv4(firstHost);
    outputs["ip-last-host"].textContent = numberToIPv4(lastHost);
    outputs["ip-mask"].textContent = numberToIPv4(mask);
    outputs["ip-host-count"].textContent = hosts.toLocaleString("pt-BR");
    outputs["ip-cidr"].textContent = `/${prefix}`;
    outputs["ip-total"].textContent = total.toLocaleString("pt-BR");
    outputs["ip-wildcard"].textContent = numberToIPv4(wildcard);
    inputStatus.textContent = "IPv4 + CIDR válido";
    status.textContent = `Sub-rede calculada localmente para ${numberToIPv4(ip)}/${prefix}.`;
  }

  function clear() {
    input.value = "";
    resetOutputs();
    inputStatus.textContent = "Ex.: 192.168.1.10/24";
    status.textContent = "Digite um IPv4 com CIDR para iniciar o cálculo.";
    input.focus();
  }

  openers.forEach(opener => {
    opener.addEventListener("click", () => setOpen(true));
    opener.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
      }
    });
  });

  closer?.addEventListener("click", () => setOpen(false));
  calculateBtn.addEventListener("click", calculate);
  clearBtn.addEventListener("click", clear);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculate();
    }
  });
  input.addEventListener("input", () => {
    inputStatus.textContent = input.value.trim() ? "Aguardando cálculo" : "Ex.: 192.168.1.10/24";
  });
  presets.forEach(button => button.addEventListener("click", () => {
    input.value = button.dataset.ipPreset || "";
    calculate();
  }));
})();

/* =========================================================
   SECURITY LAB — SECURITY HEADERS ANALYZER
   ========================================================= */
(function initSecurityHeadersAnalyzer() {
  const openers = document.querySelectorAll("[data-open-headers]");
  const panel = document.getElementById("security-headers-panel");
  const closer = document.querySelector("[data-close-headers]");
  const modeButtons = document.querySelectorAll("[data-headers-mode]");
  const urlView = document.querySelector('[data-headers-view="url"]');
  const manualView = document.querySelector('[data-headers-view="manual"]');
  const urlInput = document.getElementById("headers-url-input");
  const manualInput = document.getElementById("headers-manual-input");
  const analyzeBtn = document.getElementById("headers-analyze-btn");
  const manualAnalyzeBtn = document.getElementById("headers-manual-analyze-btn");
  const clearBtn = document.getElementById("headers-clear-btn");
  const status = document.getElementById("headers-status");
  const summary = document.getElementById("headers-summary");
  const results = document.getElementById("headers-results");
  const secureCount = document.getElementById("headers-secure-count");
  const reviewCount = document.getElementById("headers-review-count");
  const missingCount = document.getElementById("headers-missing-count");
  const score = document.getElementById("headers-score");

  if (!panel || !openers.length) return;

  const checks = [
    {
      key: "strict-transport-security",
      name: "Strict-Transport-Security",
      description: "Força conexões HTTPS em navegadores que suportam HSTS.",
      required: true,
      evaluate: value => /max-age\s*=\s*\d+/i.test(value) ? "secure" : "review"
    },
    {
      key: "content-security-policy",
      name: "Content-Security-Policy",
      description: "Restringe origens e tipos de conteúdo que a página pode carregar.",
      required: true,
      evaluate: value => value.trim() ? "secure" : "review"
    },
    {
      key: "x-content-type-options",
      name: "X-Content-Type-Options",
      description: "Ajuda a impedir MIME sniffing inesperado pelo navegador.",
      required: true,
      evaluate: value => /nosniff/i.test(value) ? "secure" : "review"
    },
    {
      key: "x-frame-options",
      name: "X-Frame-Options",
      description: "Controla se a página pode ser carregada em frames de outros contextos.",
      required: false,
      evaluate: value => /deny|sameorigin/i.test(value) ? "secure" : "review"
    },
    {
      key: "referrer-policy",
      name: "Referrer-Policy",
      description: "Controla quais informações de referência são enviadas nas requisições.",
      required: false,
      evaluate: value => value.trim() ? "secure" : "review"
    },
    {
      key: "permissions-policy",
      name: "Permissions-Policy",
      description: "Limita recursos e APIs do navegador disponíveis para a página.",
      required: false,
      evaluate: value => value.trim() ? "secure" : "review"
    }
  ];

  let mode = "url";

  function setOpen(open) {
    panel.hidden = !open;
    if (open) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => (mode === "url" ? urlInput : manualInput)?.focus(), 250);
    }
  }

  function setMode(next) {
    mode = next === "manual" ? "manual" : "url";
    modeButtons.forEach(button => button.classList.toggle("is-active", button.dataset.headersMode === mode));
    urlView.hidden = mode !== "url";
    manualView.hidden = mode !== "manual";
    status.textContent = mode === "url"
      ? "O navegador tentará ler os headers públicos da URL."
      : "Cole os headers HTTP para análise 100% local.";
  }

  function resetResults() {
    summary.hidden = true;
    results.innerHTML = "";
    secureCount.textContent = "0";
    reviewCount.textContent = "0";
    missingCount.textContent = "0";
    score.textContent = "0%";
  }

  function normalizeHeaders(raw) {
    const map = new Map();
    String(raw || "").split(/\r?\n/).forEach(line => {
      const separator = line.indexOf(":");
      if (separator < 1) return;
      const key = line.slice(0, separator).trim().toLowerCase();
      const value = line.slice(separator + 1).trim();
      if (key) map.set(key, value);
    });
    return map;
  }

  function render(headers, source) {
    const rows = checks.map(check => {
      const value = headers.get(check.key);
      let state = value ? check.evaluate(value) : "missing";
      return { ...check, value, state };
    });

    const secure = rows.filter(row => row.state === "secure").length;
    const review = rows.filter(row => row.state === "review").length;
    const missing = rows.filter(row => row.state === "missing").length;
    const percentage = Math.round((secure / rows.length) * 100);

    secureCount.textContent = secure;
    reviewCount.textContent = review;
    missingCount.textContent = missing;
    score.textContent = `${percentage}%`;
    summary.hidden = false;

    results.innerHTML = rows.map(row => {
      const label = row.state === "secure" ? "PRESENT" : row.state === "review" ? "REVIEW" : "MISSING";
      const icon = row.state === "secure" ? "✓" : row.state === "review" ? "!" : "×";
      const value = row.value ? escapeHtml(row.value) : "Header não encontrado";
      return `
        <article class="headers-result-row state-${row.state}">
          <div class="headers-result-icon" aria-hidden="true">${icon}</div>
          <div class="headers-result-main">
            <div class="headers-result-title"><strong>${escapeHtml(row.name)}</strong><span>${label}</span></div>
            <p>${escapeHtml(row.description)}</p>
            <code>${value}</code>
          </div>
        </article>`;
    }).join("");

    status.textContent = `${source} analisados localmente. ${secure} de ${rows.length} verificações estão presentes e em conformidade básica.`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[character]));
  }

  function analyzeManual() {
    const raw = manualInput.value.trim();
    if (!raw) {
      resetResults();
      status.textContent = "Cole pelo menos um header no formato Nome: valor.";
      return;
    }
    render(normalizeHeaders(raw), "Headers fornecidos");
  }

  async function analyzeUrl() {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) {
      status.textContent = "Informe uma URL pública para iniciar a análise.";
      urlInput.focus();
      return;
    }

    let url;
    try {
      url = new URL(rawUrl);
      if (!/^https?:$/.test(url.protocol)) throw new Error("protocol");
    } catch {
      status.textContent = "URL inválida. Use http:// ou https://.";
      return;
    }

    resetResults();
    status.textContent = "Consultando headers públicos...";
    analyzeBtn.disabled = true;

    try {
      const response = await fetch(url.href, { method: "GET", mode: "cors", cache: "no-store" });
      const headerMap = new Map();
      response.headers.forEach((value, key) => headerMap.set(key.toLowerCase(), value));
      render(headerMap, `Resposta HTTP ${response.status}`);
    } catch {
      status.textContent = "O navegador bloqueou a leitura da resposta (provavelmente CORS). Use PASTE HEADERS para continuar a análise local.";
    } finally {
      analyzeBtn.disabled = false;
    }
  }

  openers.forEach(opener => {
    opener.addEventListener("click", () => setOpen(true));
    opener.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
      }
    });
  });

  closer?.addEventListener("click", () => setOpen(false));
  modeButtons.forEach(button => button.addEventListener("click", () => setMode(button.dataset.headersMode)));
  analyzeBtn?.addEventListener("click", analyzeUrl);
  manualAnalyzeBtn?.addEventListener("click", analyzeManual);
  clearBtn?.addEventListener("click", () => {
    manualInput.value = "";
    resetResults();
    status.textContent = "Headers removidos. Cole novos valores para analisar.";
    manualInput.focus();
  });

  urlInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      analyzeUrl();
    }
  });

  setMode("url");
})();
