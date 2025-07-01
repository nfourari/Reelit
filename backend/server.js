// backend/server.js
// This is the main entry point for the backend server.
// It sets up the Express server, connects to MongoDB, and mounts the API routes.
// It also includes a simple health check endpoint.

// Make sure to install the required packages: express, cors, mongoose, dotenv
// You can run this server with `node server.js` after setting up your environment 
// variables in a .env file (e.g., MONGO_URI for MongoDB connection string).
// Ensure you have a .env file with the necessary environment variables.
//    Example .env file:
//      MONGO_URI=mongodb://localhost:27017/mydatabase
//      PORT=5000
//      JWT_SECRET = your_jwt_secret_key


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
// const authRouter = require('./api/auth');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const app = express();

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`→ [${req.method}] ${req.url}`);
  next();
});

// Global middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Mount routers under their feature paths
// app.use('/api/auth', authRouter);

// (Optional) health check
// app.get('/ping', (_req, res) => res.send('pong'));
const User = require('./models/User');

app.post('/api/addcard', async (req, res) => 
{
  const { userId, card } = req.body;

  // TEMP FOR LOCAL TESTING
  cardList.push(card);

  const ret = { error: '' };
  res.status(200).json(ret);

});

app.post('/api/login', async (req, res, next) =>
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
  const { login, password } = req.body;
  
  try 
  {
    // Find user document matching both login and password
    const user = await User.findOne( { login, password } ).exec();

    if (!user)
    {
      // If no user found, return error
      return res.status(401).json({error: 'Invalid credentials'});
    }

    // Return only the fields your client needs
    return res.json({
        id: user._id,
        firstName: user.FirstName,
        lastName: user.lastName,
        error: ''

      });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json( {error: 'Server error'});
  }
  // let error = '';
  // const db = client.db('Shuzzam'); // Use your database name here
  // const results = await db.collection('Users').find({Login:login, Password:password}).toArray();
  // let id = -1, fn = '', ln = '';
  
  // // if ( login.toLowerCase() === 'thud' && password === 'COP4331C')
  // // {
  // //   id = 1; 
  // //   fn = 'Thu';
  // //   ln = 'Do';
  // // }
  // if ( results.length > 0 )
  // {
  //   id = results[0].UserID;
  //   fn = results[0].FirstName;
  //   ln = results[0].LastName;
  // }

  // else
  // {
  //   error = 'Invalid username / password';
  // }

  // var ret = {id: id, firstName:fn, lastName: ln, error: error};
  // res.status(200).json({id, firstName: fn, lastName: ln, error});
});

app.post('/api/searchcards', async (req, res, next) =>
{
  // incoming: userID, search
  // outgoing: results[], error

  const { userId, search } = req.body;
  var _search = search.toLowerCase().trim();
  var _ret = [];

  for (var i = 0; i < cardList.length; i++)
  {
    var lowerFromList = cardList[i].toLocaleLowerCase();
    if ( lowerFromList.indexOf (_search) >= 0)
    {
      _ret.push( cardList[i] );
    }
  }

  var ret = {results: _ret, error:''};
  res.status(200).json(ret);

});


// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





// Simple schemas
// const User = mongoose.model('User', new mongoose.Schema({
//   login: String,
//   password: String,
//   firstName: String,
//   lastName: String
// }));

// const Card = mongoose.model('Card', new mongoose.Schema({
//   card: String,
//   userId: Number
// }));

// app.post('/api/login', async (req, res) => {
//   const { login, password } = req.body;
//   const user = await User.findOne({ login, password });

// if (user) {
//   res.json({ id: user._id, firstName: user.firstName, lastName:
//   user.lastName });
// } 
// else {
//   res.json({ id: -1 });
// }
// });

// app.post('/api/addcard', async (req, res) => {
// const { userId, card } = req.body;

// try {
//   await Card.create({ userId, card });
//   res.json({ error: '' });
// } 
// catch (err) {
//   res.json({ error: err.message });
// }
// });

// app.post('/api/searchcards', async (req, res) => {
//   const { userId, search } = req.body;
//   const cards = await Card.find({ userId, card: { $regex: search, $options:
//   'i' } });
//   res.json({ results: cards.map(c => c.card), error: '' });
// });


// import 'dotenv/config'
// import mongoose from 'mongoose';
// import express from 'express';
// import cors from 'cors';

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const mongoUri = process.env.MONGODB_URI;
// mongoose.connect(mongoUri)
//   .then(() => console.log('🗄️  MongoDB connected'))
//   .catch(err => console.error(err));

// // Example endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK' });
// });

// // Start server
//  // start Node + Express server on port 5000
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// var cardList = 
// [
//   'Roy Campanella',
//   'Paul Molitor',
//   'Tony Gwynn',
//   'Dennis Eckersley',
//   'Reggie Jackson',
//   'Gaylord Perry',
//   'Buck Leonard',
//   'Rollie Fingers',
//   'Charlie Gehringer',
//   'Wade Boggs',
//   'Carl Hubbell',
//   'Dave Winfield',
//   'Jackie Robinson',
//   'Ken Griffey, Jr.',
//   'Al Simmons',
//   'Chuck Klein',
//   'Mel Ott',
//   'Mark McGwire',
//   'Nolan Ryan',
//   'Ralph Kiner',
//   'Yogi Berra',
//   'Goose Goslin',
//   'Greg Maddux',
//   'Frankie Frisch',
//   'Ernie Banks',
//   'Ozzie Smith',
//   'Hank Greenberg',
//   'Kirby Puckett',
//   'Bob Feller',
//   'Dizzy Dean',
//   'Joe Jackson',
//   'Sam Crawford',
//   'Barry Bonds',
//   'Duke Snider',
//   'George Sisler',
//   'Ed Walsh',
//   'Tom Seaver',
//   'Willie Stargell',
//   'Bob Gibson',
//   'Brooks Robinson',
//   'Steve Carlton',
//   'Joe Medwick',
//   'Nap Lajoie',
//   'Cal Ripken, Jr.',
//   'Mike Schmidt',
//   'Eddie Murray',
//   'Tris Speaker',
//   'Al Kaline',
//   'Sandy Koufax',
//   'Willie Keeler',
//   'Pete Rose',
//   'Robin Roberts',
//   'Eddie Collins',
//   'Lefty Gomez',
//   'Lefty Grove',
//   'Carl Yastrzemski',
//   'Frank Robinson',
//   'Juan Marichal',
//   'Warren Spahn',
//   'Pie Traynor',
//   'Roberto Clemente',
//   'Harmon Killebrew',
//   'Satchel Paige',
//   'Eddie Plank',
//   'Josh Gibson',
//   'Oscar Charleston',
//   'Mickey Mantle',
//   'Cool Papa Bell',
//   'Johnny Bench',
//   'Mickey Cochrane',
//   'Jimmie Foxx',
//   'Jim Palmer',
//   'Cy Young',
//   'Eddie Mathews',
//   'Honus Wagner',
//   'Paul Waner',
//   'Grover Alexander',
//   'Rod Carew',
//   'Joe DiMaggio',
//   'Joe Morgan',
//   'Stan Musial',
//   'Bill Terry',
//   'Rogers Hornsby',
//   'Lou Brock',
//   'Ted Williams',
//   'Bill Dickey',
//   'Christy Mathewson',
//   'Willie McCovey',
//   'Lou Gehrig',
//   'George Brett',
//   'Hank Aaron',
//   'Harry Heilmann',
//   'Walter Johnson',
//   'Roger Clemens',
//   'Ty Cobb',
//   'Whitey Ford',
//   'Willie Mays',
//   'Rickey Henderson',
//   'Babe Ruth'
// ];