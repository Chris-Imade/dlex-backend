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

// Function to send emails with a custom email template
const sendEmailWithCustomTemplate = async (recipient, subject, product, imageUrl) => {
  try {
    const emailBody = `
    <div style="">
        <div style="width: 100%; height: 80px; background-color: #3855b3; padding: 20px 0; margin-bottom: 30px;">
            <img style="margin-left: 30px;" width="200" src="https://res.cloudinary.com/dtj0krpma/image/upload/v1691459913/onDark_qfjhbx.png" alt="company logo">
        </div>

          <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
              <table width="800">
                  <tbody style="">
                      <thead>
                          <tr>
                              <td>
                                  <h1>Hi ${recipient.split('@')[0]}</h1>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <p>The product ${product.name} was deleted. Here are the details:</p>
                              </td>
                          </tr>
                      </thead>
                      <tr>
                          <td colspan="2" style="text-align: center;">
                              <img style="" width="600" src="${imageUrl}" alt="Product Preview">
                          </td>
                      </tr>
                      <tr>
                          <td style="font-size: 24px; max-width: 70px;">Item name:</td>
                          <td style="font-size: 16px;">
                            <p>${product.name}</p>
                          </td>
                      </tr>
                      <tr>
                          <td style="font-size: 24px; max-width: 70px;">Price:</td>
                          <td style="font-size: 16px;">
                            <p>₦${product.price}</p>
                          </td>
                      </tr>
                      <tr>
                          <td style="font-size: 24px; max-width: 70px;">Description:</td>
                          <td style="font-size: 16px;">
                            <p>${product.desc}</p>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          
          <div style="width: 100%; background-color: #3855b3; padding: 20px 0; margin-top: 30px; height: 100px;">
              <div style="margin-left: 30px; display: flex; align-items: center;">
                  <img width="100" height="100" src="https://res.cloudinary.com/dtj0krpma/image/upload/v1691456614/smartweb_logo_qvplgn.jpg" alt="company logo">
                  <div>
                      <p style="margin-left: 24px; color: white; font-size: 16px;">&copy; 2023</p>
                      <small style="margin-left: 24px;"><a style="text-decoration: none; color: white; font-size: 16px;" href="https://smartweb-technologies.web.app/">SmartWeb-technologies | All rights reserved</a></small>
                  </div>
              </div>
          </div>
    `;

    // Send email using Nodemailer
    const info = await transporter.sendMail({
      from: process.env.email,
      to: recipient,
      subject: subject,
      html: emailBody
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmailWithCustomTemplate;
