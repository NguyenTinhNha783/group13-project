require('dotenv').config();

const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Email đã được gửi thành công!');
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error);
  }
};

module.exports = sendEmail;