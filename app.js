require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
const User = require("./schema.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const MONGO_URL = process.env.DB_CONNECTION;
const PORT = process.env.PORT || 3000;

// ── Nodemailer Transporter ──────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your real password)
  },
});

// ── MongoDB Connection ──────────────────────────────────────────────────────
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// ── Contact Form Route ──────────────────────────────────────────────────────
app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Validation — redirect with error status if any field is empty
  if (!name || !email || !message) {
    return res.redirect("/#contact?status=required");
  }

  try {
    // Save to MongoDB
    const newUser = new User({ name, email, message });
    await newUser.save();

    // Send email notification to yourself
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name} — Portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #1A1714; padding: 24px; text-align: center;">
            <h2 style="color: #FAF8F4; margin: 0; font-family: Georgia, serif;">New Portfolio Message</h2>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <p style="margin: 0 0 16px; font-size: 15px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 16px; font-size: 15px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #C4622D;">${email}</a></p>
            <p style="margin: 0 0 8px; font-size: 15px;"><strong>Message:</strong></p>
            <div style="background: #F5F0E8; padding: 16px; border-radius: 4px; color: #1A1714; font-size: 15px; line-height: 1.6;">
              ${message}
            </div>
          </div>
          <div style="background: #f0f0f0; padding: 16px; text-align: center; font-size: 12px; color: #888;">
            Sent from <a href="https://aadilportfolio.me" style="color: #C4622D;">aadilportfolio.me</a>
          </div>
        </div>
      `,
    });

    // Success — redirect with success status
    res.redirect("/#contact?status=success");
  } catch (err) {
    console.error("Error:", err);

    // Server error — redirect with error status
    res.redirect("/#contact?status=error");
  }
});
