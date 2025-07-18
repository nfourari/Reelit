import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendVerificationEmail } from '../services/sendEmailVerificationLink.js';  
dotenv.config();


/*
 * POST /api/users/register
 * Creates a new User, generates an email‑verification token, and emails it.
 */
export async function registerUser (request, response)
{
  // DEBUG
  console.log('➡️ register payload:', request.body);
  
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
  

  const {firstName, lastName, email, password } = request.body;


  try
  {
    // Prevent duplicate accounts
    if (await User.findOne({ email }))
      return response.status(400).json({ message: 'Email already in use' });

    const newUser = new User(
      {
        firstName,
        lastName,
        email,
        password,
      });
    
    const verificationToken = newUser.generateEmailVerificationToken();
    await newUser.save();

    await sendVerificationEmail(newUser.email, verificationToken);

    response.status(201).json({ message: 'User created; verification email sent'});
  }

  catch (error)
  {
    console.error('Registration error:', error)
    response.status(500).json({ message: 'Server error during user registration' });
  }
}



/*
 * POST /api/users/login
 * Verifies credentials and returns a JWT if valid & email verified.
 */
export async function loginUser(request, response)
{
  // DEBUG
  console.log('➡️ login payload:   ', request.body);

  const { email, password } = request.body;

  try 
  {
    const user = await User.findOne({ email });
    if (!user)
      return response.status(400).json({ message: 'Email not found'});

    if (!user.password) 
    {
      return response
        .status(500)
        .json({ message: 'User has no password set; please register first' });
    }

    const isMatch = await user.verifyPassword(password);
    if (!isMatch)
      return response.status(400).json({ message: 'Incorrect password'});

    if (!user.isEmailVerified) 
      return response.status(403).json({ message: 'Email not verified'});

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return response.json({ token: jwtToken });
  }
  catch(error)
  {
    console.error('Login error:', error);
    return response.status(500).json({ message: 'Server error during user login' });
  }
}



/*
 * GET /api/users/profile
 * Returns the current user’s profile (minus sensitive fields).
 */
export async function getUserProfile(request, response)
{
  try
  {
    const user = await User.findById(request.user.id).select('-password -__v -emailVerification');

    if (!user)
      return response.status(404).json({ message: 'User not found' });

    return response.json(user);
  }
  catch (error)
  {
    console.error('Profile fetch error:', error);
    response.status(500).json({ message: 'Server error fetching profile' });
  }
}



/**
 * GET /api/users/verify-email
 * Validates the email‑verification token, marks email verified, then redirects.
 */
export async function verifyUserEmail(request, response)
{
  console.log('🔔 verifyUserEmail hit:', request.method, request.url, request.query);

  const { token, email } = request.query;

  try
  {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.emailVerification.token !== token ||
      user.emailVerification.expirationDate < Date.now() 
    )
    {
      return response.status(400).send('Invalid or expired token');
    }

    user.isEmailVerified                  = true;
    user.emailVerification.token          = undefined;
    user.emailVerification.expirationDate = undefined;
    await user.save();
    
    // Redirect to front-end confirmation confirmation page
    response.redirect(`${process.env.WEB_URL}/verified-success`);
  }
  catch (error)
  {
    console.error('Email verification error:', error);
    return response.status(500).json({ message: 'Server error verifying email' })
  }
}
