// import axios from 'axios';

// const ORLANDO_LAT = 28.5383;
// const ORLANDO_LNG = -81.3792;

// /**
//  * Fetches the current weather conditions for Orlando.
//  * @returns {Promise<Object>} An object with current temperature, humidity, apparent temperature, precipitation, weather code, and wind speed.
//  */
// export async function getOrlandoWeather() {
//   try {
//     const response = await axios.get(
//       `https://api.open-meteo.com/v1/forecast`, {
//         params: {
//           latitude: ORLANDO_LAT,
//           longitude: ORLANDO_LNG,
//           current_weather: true,
//           current_temperature: true,
//           temperature_unit: 'fahrenheit',
//           wind_speed_unit: 'mph',
//           precipitation_unit: 'inch',
//           hourly: 'relative_humidity_2m',
//         }
//       }
//     );

//     const data = response.data;
//     if (!data.current_weather) {
//       throw new Error('No current weather data returned');
//     }

//     return {
//       temperature: data.current_weather.temperature,
//       windSpeed: data.current_weather.windspeed,
//       precipitation: data.current_weather.precipitation,
//       weatherCode: data.current_weather.weathercode,
//       // If humidity is present in hourly data, get the latest:
//       humidity: data.hourly?.relative_humidity_2m?.slice(-1)[0] ?? null,
//       timestamp: data.current_weather.time,
//     };
//   } catch (err) {
//     console.error('Error fetching Orlando weather:', err);
//     throw err;
//   }
// }
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