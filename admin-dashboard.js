const API_URL = "https://gustavo-portfolio-api-qzrk.onrender.com/api";

const token = localStorage.getItem("adminToken");

const feedbackList = document.getElementById("feedbackList");
const publishedList = document.getElementById("publishedList");
const pendingCount = document.getElementById("pendingCount");
const publishedCount = document.getElementById("publishedCount");
const logoutButton = document.getElementById("logoutButton");

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "admin.html";
    return true;
  }
  return false;
}

if (!token) {
  window.location.href = "admin.html";
}

async function loadPendingFeedbacks() {
  try {
    const response = await fetch(`${API_URL}/feedbacks/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (handleUnauthorized(response)) return;

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    pendingCount.textContent = data.feedbacks.length;

    if (data.feedbacks.length === 0) {
      feedbackList.innerHTML = `<p>Nenhum feedback pendente.</p>`;
      return;
    }

    feedbackList.innerHTML = data.feedbacks
      .map((feedback) => createFeedbackCard(feedback, true))
      .join("");
  } catch (error) {
    console.error(error);
    feedbackList.innerHTML = `<p>Erro ao carregar os feedbacks pendentes.</p>`;
  }
}

async function loadPublishedFeedbacks() {
  try {
    const response = await fetch(`${API_URL}/feedbacks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (handleUnauthorized(response)) return;

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    publishedCount.textContent = data.feedbacks.length;

    if (data.feedbacks.length === 0) {
      publishedList.innerHTML = `<p>Nenhum feedback publicado.</p>`;
      return;
    }

    publishedList.innerHTML = data.feedbacks
      .map((feedback) => createFeedbackCard(feedback, false))
      .join("");
  } catch (error) {
    console.error(error);
    publishedList.innerHTML = `<p>Erro ao carregar os feedbacks publicados.</p>`;
  }
}

function createFeedbackCard(feedback, pending = false) {
  const stars = "⭐".repeat(feedback.rating);

  return `
    <article class="admin-feedback-card">
      <div class="feedback-info">
        <h3>${escapeHTML(feedback.name)}</h3>
        <span>${escapeHTML(feedback.role || "Cliente")}</span>
        <div>${stars}</div>
        <p>"${escapeHTML(feedback.message)}"</p>
      </div>

      <div class="feedback-actions">
        ${pending ? `
          <button onclick="approveFeedback(${feedback.id})">
            ✅ Aprovar
          </button>
          <button onclick="rejectFeedback(${feedback.id})">
            ❌ Rejeitar
          </button>
        ` : ""}

        <button onclick="deleteFeedback(${feedback.id})">
          🗑️ Excluir
        </button>
      </div>
    </article>
  `;
}

async function approveFeedback(id) {
  await updateFeedback(`/feedbacks/${id}/approve`, "Feedback aprovado!");
}

async function rejectFeedback(id) {
  await updateFeedback(`/feedbacks/${id}/reject`, "Feedback rejeitado!");
}

async function updateFeedback(endpoint, successMessage) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (handleUnauthorized(response)) return;

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alert(successMessage);
    await Promise.all([loadPendingFeedbacks(), loadPublishedFeedbacks()]);
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar feedback.");
  }
}

async function deleteFeedback(id) {
  const confirmed = confirm("Tem certeza que deseja excluir este feedback?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/feedbacks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (handleUnauthorized(response)) return;

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alert("Feedback excluído!");
    await Promise.all([loadPendingFeedbacks(), loadPublishedFeedbacks()]);
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir feedback.");
  }
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "admin.html";
});

Promise.all([loadPendingFeedbacks(), loadPublishedFeedbacks()]);
