const API_URL = "http://localhost:3000/api";

// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  loginMessage.textContent = "Entrando...";

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      loginMessage.textContent = data.message;
      return;
    }

    // Salvar token
    localStorage.setItem("adminToken", data.token);

    loginMessage.textContent = "Login realizado!";

    // Ir para o painel
    window.location.href = "admin-dashboard.html";
  } catch (error) {
    console.error(error);

    loginMessage.textContent = "Não foi possível conectar ao servidor.";
  }
});
