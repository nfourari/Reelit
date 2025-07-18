import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

// DEBUG
console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'thu.do65@gmail.com', // Replace with recipient
  from: 'no-reply@shuzzy.top', // Must be a verified sender in SendGrid
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
  console.error('SendGrid error:', error.response?.body || error);
});