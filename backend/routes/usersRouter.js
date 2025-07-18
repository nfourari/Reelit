
import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyUserEmail
} from '../controllers/userController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const usersRouter = Router();

usersRouter.post('/register',      registerUser);
usersRouter.post('/login',         loginUser);
usersRouter.get('/profile',        authenticateUser, getUserProfile);
usersRouter.get('/verify-email',   verifyUserEmail);

export default usersRouter;