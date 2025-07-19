// App setup

import express  from 'express';
import cors     from 'cors';
import usersRouter from './routes/usersRouter.js';
import catchesRouter from './routes/catchesRouter.js';
import speciesRouter from './routes/speciesRouter.js';
import weatherRouter from './routes/weather.js';

const app = express();
app.use(cors());
app.use(express.json());



// Mount all API routes
app.use('/api/users', usersRouter);
app.use('/api/catches', catchesRouter);
app.use('/api/species', speciesRouter);
app.use('/api/weather', weatherRouter);

export default app;
