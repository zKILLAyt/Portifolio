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
