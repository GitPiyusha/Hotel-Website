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

  const { name, phone, checkin, checkout, rooms, guests } = req.body || {};

  if (!name || !phone || !checkin || !checkout || !rooms) {
    return res.status(400).json({ success: false, error: "Please fill all required booking details." });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: CONTACT_TO,
      subject: `New Room Booking - ${name}`,
      html: `
        <h2>New Room Booking</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Check-in:</b> ${checkin}</p>
        <p><b>Check-out:</b> ${checkout}</p>
        <p><b>Rooms:</b> ${rooms}</p>
        <p><b>Guests:</b> ${guests || "-"}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
