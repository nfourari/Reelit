
// Exposes a clean /api/species/____ for fish lookups with no
// authentication required

import { Router } from 'express';
import { lookupSpecies } from '../controllers/speciesController.js';

const speciesRouter = Router();
speciesRouter.get('/:species', lookupSpecies);
export default speciesRouter;

