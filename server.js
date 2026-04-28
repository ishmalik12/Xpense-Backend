require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

// Firebase
const { db } = require("./config/firebase");

// 🔐 Auth middleware
const authMiddleware = require("./middleware/auth");

const app = express();

const { generalLimiter } = require("./middleware/rateLimit");

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(generalLimiter);

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Firebase test route
app.get("/test-firebase", async (req, res) => {
  try {
    await db.collection("test").doc("sample").set({
      name: "Ish",
      createdAt: new Date(),
    });

    res.json({ message: "Firestore working ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Secure route (NEW)
app.get("/secure-test", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated ✅",
    userId: req.userId,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});