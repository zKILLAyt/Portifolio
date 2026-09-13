const pool = require("../config/database");

// GET - Feedbacks aprovados
async function getApprovedFeedbacks(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM feedbacks
             WHERE status = 'approved'
             ORDER BY created_at DESC`,
    );

    res.json({
      success: true,
      feedbacks: result.rows,
    });
  } catch (error) {
    console.error("Erro ao buscar feedbacks:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar feedbacks.",
    });
  }
}

// GET - Feedbacks pendentes
async function getPendingFeedbacks(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM feedbacks
             WHERE status = 'pending'
             ORDER BY created_at DESC`,
    );

    res.json({
      success: true,
      feedbacks: result.rows,
    });
  } catch (error) {
    console.error("Erro ao buscar feedbacks pendentes:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar feedbacks pendentes.",
    });
  }
}

// POST - Criar feedback
async function createFeedback(req, res) {
  let { name, role, rating, message } = req.body;

  // ========================================
  // NORMALIZAR DADOS
  // ========================================

  name = typeof name === "string" ? name.trim() : "";
  role = typeof role === "string" ? role.trim() : "";
  message = typeof message === "string" ? message.trim() : "";

  // ========================================
  // VALIDAR NOME
  // ========================================

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "O nome é obrigatório.",
    });
  }

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({
      success: false,
      message: "O nome deve ter entre 2 e 100 caracteres.",
    });
  }

  // ========================================
  // VALIDAR MENSAGEM
  // ========================================

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "A mensagem é obrigatória.",
    });
  }

  if (message.length < 5 || message.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "A mensagem deve ter entre 5 e 1000 caracteres.",
    });
  }

  // ========================================
  // VALIDAR CARGO / FUNÇÃO
  // ========================================

  if (role.length > 100) {
    return res.status(400).json({
      success: false,
      message: "O cargo deve ter no máximo 100 caracteres.",
    });
  }

  // ========================================
  // VALIDAR RATING
  // ========================================

  if (rating === undefined || rating === null || rating === "") {
    return res.status(400).json({
      success: false,
      message: "A avaliação é obrigatória.",
    });
  }

  rating = Number(rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "A avaliação deve ser um número inteiro entre 1 e 5.",
    });
  }

  // ========================================
  // SALVAR NO BANCO
  // ========================================

  try {
    const result = await pool.query(
      `INSERT INTO feedbacks
            (name, role, rating, message)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [name, role || null, rating, message],
    );

    res.status(201).json({
      success: true,
      message: "Feedback enviado com sucesso!",
      feedback: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao criar feedback:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao salvar feedback.",
    });
  }
}

// PATCH - Aprovar feedback
async function approveFeedback(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE feedbacks
             SET status = 'approved'
             WHERE id = $1
             RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback não encontrado.",
      });
    }

    res.json({
      success: true,
      message: "Feedback aprovado!",
      feedback: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao aprovar feedback:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao aprovar feedback.",
    });
  }
}

// PATCH - Rejeitar feedback
async function rejectFeedback(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE feedbacks
             SET status = 'rejected'
             WHERE id = $1
             RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback não encontrado.",
      });
    }

    res.json({
      success: true,
      message: "Feedback rejeitado!",
      feedback: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao rejeitar feedback:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao rejeitar feedback.",
    });
  }
}

// DELETE - Excluir feedback
async function deleteFeedback(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM feedbacks
             WHERE id = $1
             RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback não encontrado.",
      });
    }

    res.json({
      success: true,
      message: "Feedback excluído com sucesso!",
      feedback: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao excluir feedback:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao excluir feedback.",
    });
  }
}

module.exports = {
  getApprovedFeedbacks,
  getPendingFeedbacks,
  createFeedback,
  approveFeedback,
  rejectFeedback,
  deleteFeedback,
};
