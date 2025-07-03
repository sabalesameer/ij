// utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // ✅ Should be a Gmail address
        pass: process.env.SMTP_PASS  // ✅ Must be a Gmail App Password
      }
    });

    const mailOptions = {
      from: `"JobSakura Team" <${process.env.SMTP_USER}>`,
      to,                     // ✅ recipient
      subject,                // ✅ subject of email
      html                    // ✅ HTML content of email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
