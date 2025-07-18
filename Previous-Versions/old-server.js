// require('dotenv').config();
// const express = require('express');
// const api = require('./routes');
// const cors = require('cors');
// const mongoose = require('mongoose');


// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB error:', err));

// const app = express();

// // Middleware to log requests
// app.use((req, res, next) => {
//   console.log(`→ [${req.method}] ${req.url}`);
//   next();
// });

// // Global middleware
// app.use(cors());
// app.use(express.json());
// app.use('/api', api);

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


// const User = require('./models/User');
// const Card = require('../Previous-Versions/Card');


// // ADD NEW CARD
// app.post('/api/addcard', async (req, res) => 
// {
//   const { userId, card } = req.body;

//   try
//   {
//     await Card.create({ userId, card});
//     res.json({ error: ''});
//   }
//   catch (err)
//   {
//     console.error('Error adding card:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }

// });



// // SEARCH CARDS

// app.post('/api/searchcards', async (req, res) =>
// {
//   // incoming: userID, search

//   const { userId, search } = req.body;

//   try
//   {
//       const regex = new RegExp(search, 'i'); // 'i' for case-insensitive
//       const cards = await Card.find({ userId, card: regex}).select('card -_id');
//       res.json({ results: cards.map(c => c.card), error: ''});
//   }

//   catch(err)
//   {
//     console.error('Search error:', err);
//     res.status(500).json({ results: [], error: err.message });
//   }
// });




// // Start server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


