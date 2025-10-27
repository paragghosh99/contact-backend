const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Basic test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running with Resend");
});

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("📬 Received POST /contact", { name, email, message });

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // or use your domain
      to: "ghosh.parag2025@gmail.com",
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `,
    });

    console.log("✅ Email sent via Resend!");
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
