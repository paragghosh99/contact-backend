const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route to confirm the server is running
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("📬 Received POST /contact", { name, email, message });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
});

  const mailOptions = {
    from: email,
    to: process.env.EMAIL, // Send it to yourself
    subject: `New message from ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
