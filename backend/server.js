require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors({
  origin: "https://lead-alert-frontend.vercel.app",
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.post("/api/leads", async (req, res) => {
  const { name, email, company, message } = req.body;
  
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Invalid email" });

  try {
    await axios.post("https://email-server-bzuk.onrender.com/webhook/webhook", {
      name, email, company, message
    });
    res.status(200).json({ message: "Lead submitted" });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ error: "Failed to notify webhook" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));