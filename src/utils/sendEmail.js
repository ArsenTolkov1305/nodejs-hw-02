import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

export const sendEmail = async (options) => {
  try {
    console.log('Attempting to send email with options:', {
      ...options,
      auth: '***hidden***',
    });

    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const result = await transporter.sendMail({
      from: {
        name: 'Password Reset',
        address: process.env.EMAIL_FROM,
      },
      ...options,
    });

    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
