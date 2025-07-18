
// Groups all catch-related enpoints under /api/catches and ensures only a
// logged-in user can use them


import { Router } from 'express';
import {
  createCatch,
  listCatches
} from '../controllers/catchController.js'
import authenticateUser from '../middleware/authenticateUser.js';


const catchesRouter = Router();

catchesRouter.post('/',  authenticateUser, createCatch);
catchesRouter.get('/',   authenticateUser, listCatches);

export default catchesRouter;