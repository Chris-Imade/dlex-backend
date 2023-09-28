const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Transaction = require('../schemas/Transaction');
const sendTransactionsWithCustomMail = require('../lib/sendTransactions');
const User = require('../schemas/User');


// Middleware to extract the recipient email from the JWT token
const extractRecipientEmail = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
      req.recipientEmail = decodedToken.email;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', status: 401 });
    }
};


// Send transaction route
router.post('/sendTransaction', extractRecipientEmail, async (req, res) => {
    const userId = req.query.userId;

  try {
    // Get the current User
    const user = await User.findById(userId);
    
    // Fetch transaction data from the database using the Transaction model
    const transactionData = user.transactions;

    const recipientEmail = req.recipientEmail;
    const emailSubject = 'Weekly Transaction Report';

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
                                    <h1>Hi ${recipientEmail.split('@')[0]}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>This is your transactions for the week:</p>
                                </td>
                            </tr>
                        </thead>
                        <tr>
                            <td>Check the attachment below 👇🏿</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="width: 100%; background-color: #3855b3; padding: 20px 0; margin-top: 30px; height: 100px;">
                <div style="margin-left: 30px; display: flex; align-items: center;">
                    <img width="100" height="100" src="https://res.cloudinary.com/dtj0krpma/image/upload/v1691456614/smartweb_logo_qvplgn.jpg" alt="company logo">
                    <div>
                        <p style="margin-left: 24px; color: white; font-size: 16px;">&copy; ${new Date().getFullYear()}</p>
                        <small style="margin-left: 24px;"><a style="text-decoration: none; color: white; font-size: 16px;" href="https://smartweb-technologies.web.app/">SmartWeb-technologies | All rights reserved</a></small>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Call the function to send the email with the custom template and the transaction data
    await sendTransactionsWithCustomMail(recipientEmail, emailSubject, emailBody, transactionData);

    res.status(200).json({ message: 'Email sent successfully', status: 200, detail: 'Report is on it\'s way to you mail🚀' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
});

module.exports = router;
