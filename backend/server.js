// // backend/server.js
// // This is the main entry point for the backend server.
// // It sets up the Express server, connects to MongoDB, and mounts the API routes.
// // It also includes a simple health check endpoint.


import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './index.js';


const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI)
        .then(() => 
          {
            console.log('✅ MongoDB connected');
            app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
          })
        .catch(error => console.error('❌ MongoDB connection error:', error));


