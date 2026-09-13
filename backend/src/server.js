require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARES
// ===============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5500",
  }),
);

app.use(express.json());

// ===============================
// ROTAS
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/feedbacks", feedbackRoutes);

// ===============================
// SERVIDOR
// ===============================

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🚀 API rodando na porta ${PORT}`);

  try {
    await pool.query("SELECT NOW()");
    console.log("🗄️ PostgreSQL conectado!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", error.message);
  }
});
