import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';


// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://chinglefong:gQFangwhH2dLWZf5@shuzzydb.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoUri)
  .then(() => console.log('🗄️  MongoDB connected'))
  .catch(err => console.error(err));

// app.use((req, res, next) => 
// {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, DELETE, OPTIONS'
//   );
//   next();
// });

// Example endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// app.listen(5000); // start Node + Express server on port 5000
