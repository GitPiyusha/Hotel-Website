require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const CONTACT_TO = process.env.CONTACT_TO || process.env.SMTP_USER;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, phone, email, date, time, guests, occasion, requests } = req.body || {};

  if (!name || !phone || !date || !time) {
    return res.status(400).json({ success: false, error: "Please fill all required table reservation fields." });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: CONTACT_TO,
      subject: `New Table Reservation - ${name}`,
      html: `
        <h2>New Table Reservation</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email || "-"}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Guests:</b> ${guests || "-"}</p>
        <p><b>Occasion:</b> ${occasion || "-"}</p>
        <p><b>Special Requests:</b> ${requests || "-"}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
