const API_URL = "https://gustavo-portfolio-api-qzrk.onrender.com/api";

const token = localStorage.getItem("adminToken");

const feedbackList = document.getElementById("feedbackList");
const pendingCount = document.getElementById("pendingCount");
const logoutButton = document.getElementById("logoutButton");

// ========================================
// PROTEÇÃO CONTRA HTML / XSS
// ========================================

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ========================================
// TRATAMENTO DE SESSÃO EXPIRADA
// ========================================

function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.removeItem("adminToken");

    window.location.href = "admin.html";

    return true;
  }

  return false;
}

// ========================================
// VERIFICAR AUTENTICAÇÃO
// ========================================

if (!token) {
  window.location.href = "admin.html";
}

// ========================================
// BUSCAR FEEDBACKS PENDENTES
// ========================================

async function loadPendingFeedbacks() {
  try {
    const response = await fetch(`${API_URL}/feedbacks/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verificar se o JWT expirou ou é inválido
    if (handleUnauthorized(response)) {
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    pendingCount.textContent = data.feedbacks.length;

    if (data.feedbacks.length === 0) {
      feedbackList.innerHTML = `
        <p>
          Nenhum feedback pendente.
        </p>
      `;

      return;
    }

    feedbackList.innerHTML = data.feedbacks
      .map((feedback) => createFeedbackCard(feedback))
      .join("");
  } catch (error) {
    console.error(error);

    feedbackList.innerHTML = `
      <p>
        Erro ao carregar os feedbacks.
      </p>
    `;
  }
}

// ========================================
// CRIAR CARD
// ========================================

function createFeedbackCard(feedback) {
  const stars = "⭐".repeat(feedback.rating);

  return `
    <article class="admin-feedback-card">

      <div class="feedback-info">

        <h3>
          ${escapeHTML(feedback.name)}
        </h3>

        <span>
          ${escapeHTML(feedback.role || "Cliente")}
        </span>

        <div>
          ${stars}
        </div>

        <p>
          "${escapeHTML(feedback.message)}"
        </p>

      </div>

      <div class="feedback-actions">

        <button
          onclick="approveFeedback(${feedback.id})"
        >
          ✅ Aprovar
        </button>

        <button
          onclick="rejectFeedback(${feedback.id})"
        >
          ❌ Rejeitar
        </button>

        <button
          onclick="deleteFeedback(${feedback.id})"
        >
          🗑️ Excluir
        </button>

      </div>

    </article>
  `;
}

// ========================================
// APROVAR
// ========================================

async function approveFeedback(id) {
  await updateFeedback(`/feedbacks/${id}/approve`, "Feedback aprovado!");
}

// ========================================
// REJEITAR
// ========================================

async function rejectFeedback(id) {
  await updateFeedback(`/feedbacks/${id}/reject`, "Feedback rejeitado!");
}

// ========================================
// ATUALIZAR FEEDBACK
// ========================================

async function updateFeedback(endpoint, successMessage) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verificar se o JWT expirou ou é inválido
    if (handleUnauthorized(response)) {
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    alert(successMessage);

    loadPendingFeedbacks();
  } catch (error) {
    console.error(error);

    alert("Erro ao atualizar feedback.");
  }
}

// ========================================
// EXCLUIR
// ========================================

async function deleteFeedback(id) {
  const confirmed = confirm("Tem certeza que deseja excluir este feedback?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/feedbacks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verificar se o JWT expirou ou é inválido
    if (handleUnauthorized(response)) {
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    alert("Feedback excluído!");

    loadPendingFeedbacks();
  } catch (error) {
    console.error(error);

    alert("Erro ao excluir feedback.");
  }
}

// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("adminToken");

  window.location.href = "admin.html";
});

// ========================================
// INICIAR
// ========================================

loadPendingFeedbacks();
