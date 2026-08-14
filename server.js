require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const CONTACT_TO = process.env.CONTACT_TO;

// ROOM BOOKING
app.post("/send-booking", async (req, res) => {
  const { name, phone, checkin, checkout, rooms, guests } = req.body;
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
        <p><b>Guests:</b> ${guests}</p>
      `
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TABLE / MENU RESERVATION
app.post("/send-table-booking", async (req, res) => {
  const { name, phone, email, date, time, guests, occasion, requests } = req.body;
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
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Occasion:</b> ${occasion || "-"}</p>
        <p><b>Special Requests:</b> ${requests || "-"}</p>
      `
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CONTACT FORM
app.post("/send-contact", async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: CONTACT_TO,
      subject: `New Contact Message - ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "-"}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);