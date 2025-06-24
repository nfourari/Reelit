import 'dotenv/config'
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri)
  .then(() => console.log('🗄️  MongoDB connected'))
  .catch(err => console.error(err));

// Example endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
 // start Node + Express server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


