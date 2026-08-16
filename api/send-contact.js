const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  const {
    name,
    email,
    phone,
    message
  } = req.body;

  try {

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_TO,

      subject: `New Contact Message - ${name}`,

      html: `
        <h2>New Contact Form Submission</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "-"}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    return res.json({ success: true });

  } catch (error) {

    console.error("Contact email error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};