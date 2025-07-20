import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // hit weatherapi.com (or your preferred) via the secret key in env
    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: 'Orlando,FL',
        aqi: 'no'
      }
    });

    const w = response.data.current;
    // reshape to just what the Flutter client needs
    res.json({
      location: response.data.location.name + ', ' + response.data.location.region,
      temp: w.temp_f,
      cond: w.condition.text,
      precip: w.precip_in + ' in',
      wind: w.wind_mph + ' mph',
      humid: w.humidity + '%',
      forecast: response.data.forecast?.forecastday?.map(day => ({
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: day.day.maxtemp_f,
        low: day.day.mintemp_f,
        cond: day.day.condition.text
      })) || []
    });
  } catch (err) {
    console.error('Weather route error:', err.message);
    res.status(500).json({ error: 'Weather data unavailable' });
  }
});

export default router;
