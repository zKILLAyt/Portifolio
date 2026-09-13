const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const passwordValid = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH,
    );

    if (email !== process.env.ADMIN_EMAIL || !passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res.json({
      success: true,
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);

    res.status(500).json({
      success: false,
      message: "Erro interno ao realizar login.",
    });
  }
});

module.exports = router;
