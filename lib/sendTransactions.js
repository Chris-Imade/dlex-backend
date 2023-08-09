const fs = require('fs');
const createCsv = require('./createCsv');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

const sendTransactionsWithCustomMail = async (recipient, subject, emailBody, transactionData) => {
  try {
    // Create the CSV file
    createCsv(transactionData);

    // Send email using Nodemailer with CSV file as attachment
    const info = await transporter.sendMail({
      from: process.env.email,
      to: recipient,
      subject: subject,
      html: emailBody,
      attachments: [
        {
          filename: 'transactions.csv',
          path: 'transactions.csv',
        },
      ],
    });

    // Delete the CSV file after sending the email
    fs.unlinkSync('transactions.csv');

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendTransactionsWithCustomMail;