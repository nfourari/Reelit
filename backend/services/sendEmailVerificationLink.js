

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import dotenvFlow from 'dotenv-flow';
dotenv.config();
dotenvFlow.config();

const FROM_EMAIL = process.env.FROM_EMAIL;
const HOST = process.env.API_URL;
const API = `${HOST}/api/users`;


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationEmail(toEmail, verificationToken)
{
  const verificationLink = 
    `${API}/verify-email` +
    `?token=${verificationToken}` +
    `&email=${encodeURIComponent(toEmail)}`;

  const message = 
  {
    to:         toEmail,
    from:       
    {
      email:    FROM_EMAIL || 'no-reply@shuzzy.top',
      name:     'Shuzzy+ | Email Verification'
    },
    subject:    'Welcome to Shuzzy+ - Please confirm your email!',
    html:       `<p>Click <a href="${verificationLink}"here</a> to verify your email.</p>`
  };

  console.log('🔗 verification link:', verificationLink);
  return sgMail.send(message);
}