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


const User = require('./models/User');
const Card = require('./models/Card');


// ADD NEW CARD
app.post('/api/addcard', async (req, res) => 
{
  const { userId, card } = req.body;

  try
  {
    await Card.create({ userId, card});
    res.json({ error: ''});
  }
  catch (err)
  {
    console.error('Error adding card:', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});


// REGISTER
const bcrypt = require('bcrypt');

app.post(
  '/api/register',
  async (req, res) =>
  {
    const { login, email, password, firstName, lastName,} = req.body;

    if (!login || !email || ! password || !firstName || !lastName)
    {
      return res.status(400).json({ error: 'All fields are required' });
    }
      
    try 
    {
      // Check for existing user
      const existing = await User.findOne({ login }).exec();

      if (existing)
      {
        return res.status(409).json({ error: 'Account already exists'});
      }

      // Hash password
      const hash = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create(
        {
          login, 
          email, 
          password: hash,
          firstName,
          lastName
        }
      );

      // Return minimal user information
      return res.status(201).json(
        {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          error: ''
        }
      );
    }
    catch (err)
    {
      console.error('Register error', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);


// LOGIN
app.post('/api/login', async (req, res) =>
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
  const { login, password } = req.body;
  
  try 
  {
    // Find user document matching both login and password
    const user = await User.findOne( { login } ).exec();

    if (!user)
    {
      // If no user found, return error
      return res.status(401).json({error: 'Account not found'});
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match)
    {
      return res.status(401).json({error: 'Incorrect password. Please try again.'});
    }

    // Return only the fields your client needs if there's a match
    return res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        error: ''

      });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json( {error: 'Server error'});
  }
});


// SEARCH CARDS
app.post('/api/searchcards', async (req, res) =>
{
  // incoming: userID, search

  const { userId, search } = req.body;

  try
  {
      const regex = new RegExp(search, 'i'); // 'i' for case-insensitive
      const cards = await Card.find({ userId, card: regex}).select('card -_id');
      res.json({ results: cards.map(c => c.card), error: ''});
  }

  catch(err)
  {
    console.error('Search error:', err);
    res.status(500).json({ results: [], error: err.message });
  }
});




// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


