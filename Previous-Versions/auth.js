// LOGIN HANDLER

const express = require('express');
const router = express.Router();
const User   = require('../backend/models/User');
const jwt    = require('jsonwebtoken'); 
const axios = require('axios');              // For making HTTP requests
const Catch = require('../backend/models/Catch');    // Mongoose model for user fish catches




// POST /api/register
router.post('/register', async (req, res) => 
{
  try 
  {
    const { password, firstName, lastName, email } = req.body;

    // Basic validation
    if ( !password || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'password, firstName, lastName and email are required'
      });
    }

    // Create & save
    const user = new User({ password, firstName, lastName, email });
    await user.save();
    res.json({ success: true, message: 'Registered' });
  } 
  catch (err) 
  {
    // Duplicate key or validation error
    res.status(400).json({ success: false, message: err.message });
  }
});



// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const payload = { id: user._id, email: user.email };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add a new fish catch
router.post('/catch', async (req, res) => {
  const { userId, species, weight, length, photoUrl, location } = req.body;
  try {
    const catchRecord = await Catch.create({
      userId,
      species,
      weight,
      length,
      photoUrl,
      location,
      caughtAt: new Date()
    });
    res.status(201).json({ success: true, data: catchRecord });
  } catch (err) {
    console.error('Error adding catch:', err);
    res.status(500).json({ success: false, message: 'Server error adding catch' });
  }
});

// Get fish species info
router.get('/fish/:species', async (req, res) => {
  const { species } = req.params;
  try {
    const apiUrl = `https://fishbase.ropensci.org/species?genus_species=${encodeURIComponent(species)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    if (!data || !data.data || data.data.length === 0) {
      return res.status(404).json({ success: false, message: 'Species not found' });
    }
    const fish = data.data[0];
    res.json({
      success: true,
      species: fish.Genus + ' ' + fish.Species,
      commonName: fish.FBname,
      status: fish.IUCN,
      habitat: fish.Habitats,
      distribution: fish.Distribution
    });
  } catch (err) {
    console.error('Error fetching fish info:', err);
    res.status(500).json({ success: false, message: 'Error contacting fish database' });
  }
});



module.exports = router;
