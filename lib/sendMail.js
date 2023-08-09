const nodemailer = require('nodemailer');
require("dotenv").config();

// Create a transporter with your email service configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.emailPassword,
  },
});

// Function to send emails
const sendEmail = async (recipient, subject, text, attachments = []) => {
  try {
    // Send email using Nodemailer
    const info = await transporter.sendMail({
      from: process.env.email,
      to: recipient,
      subject: subject,
      text: text,
      attachments: attachments,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;