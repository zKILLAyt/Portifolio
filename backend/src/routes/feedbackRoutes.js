const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const {
  getApprovedFeedbacks,
  getPendingFeedbacks,
  createFeedback,
  approveFeedback,
  rejectFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Muitos envios de feedback. Tente novamente mais tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===============================
// ROTAS PÚBLICAS
// ===============================

// Listar feedbacks aprovados
router.get("/", getApprovedFeedbacks);

// Enviar novo feedback
router.post("/", feedbackLimiter, createFeedback);

// ===============================
// ROTAS ADMINISTRATIVAS
// ===============================

// Listar feedbacks pendentes
router.get("/pending", authMiddleware, getPendingFeedbacks);

// Aprovar
router.patch("/:id/approve", authMiddleware, approveFeedback);

// Rejeitar
router.patch("/:id/reject", authMiddleware, rejectFeedback);

// Excluir
router.delete("/:id", authMiddleware, deleteFeedback);

module.exports = router;
