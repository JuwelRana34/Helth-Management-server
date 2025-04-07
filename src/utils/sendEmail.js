const nodemailer = require('nodemailer');

async function sendConfirmationEmail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "rk370613@gmail.com",
      pass: process.env.App_Pass,
    },
  });

  await transporter.sendMail(mailOptions);
  
}

module.exports = sendConfirmationEmail;