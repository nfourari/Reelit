// LOGIN HANDLER

const express = require('express');
const router = express.Router();
const User   = require('../models/User');
const jwt    = require('jsonwebtoken'); 



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
        error: 'password, firstName, lastName and email are required'
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
    res.status(400).json({ success: false, error: err.message });
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


module.exports = router;