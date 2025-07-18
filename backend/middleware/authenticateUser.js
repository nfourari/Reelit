
// Guards any route that requires a logged-in user. 
// Parses and verifies JWT, then makes req.user.id available to all controllers

// middleware/requireAuth.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export default function authenticateUser(request, response, next)
{
  // Check for Authorization header
  const authHeader = request.headers.authorization;
  if (!authHeader) 
    return response.status(401).json({ message: 'No token provided' });


  // Expect format "Bearer <token>"
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token)
    return response.status(401).json({ message: 'Invalid authentication format' });


  // Verify JWT and attach userId to request.user for downstream controller(s)
  try
  {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = { id: payload.id };
    next();
  } 
  catch (err)
  {
    return response.status(401).json({ message: 'Token invalid or expired' });
  }
}

