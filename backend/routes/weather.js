const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: 'Orlando,FL',
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Weather data unavailable' });
  }
});

export default router;
