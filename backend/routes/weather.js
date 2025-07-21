import axios from 'axios';

const ORLANDO_LAT = 28.5383;
const ORLANDO_LNG = -81.3792;

/**
 * Fetches the current weather conditions for Orlando.
 * @returns {Promise<Object>} An object with current temperature, humidity, apparent temperature, precipitation, weather code, and wind speed.
 */
export async function getOrlandoWeather() {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast`, {
        params: {
          latitude: ORLANDO_LAT,
          longitude: ORLANDO_LNG,
          current_weather: true,
          current_temperature: true,
          temperature_unit: 'fahrenheit',
          wind_speed_unit: 'mph',
          precipitation_unit: 'inch',
          hourly: 'relative_humidity_2m',
        }
      }
    );

    const data = response.data;
    if (!data.current_weather) {
      throw new Error('No current weather data returned');
    }

    return {
      temperature: data.current_weather.temperature,
      windSpeed: data.current_weather.windspeed,
      precipitation: data.current_weather.precipitation,
      weatherCode: data.current_weather.weathercode,
      // If humidity is present in hourly data, get the latest:
      humidity: data.hourly?.relative_humidity_2m?.slice(-1)[0] ?? null,
      timestamp: data.current_weather.time,
    };
  } catch (err) {
    console.error('Error fetching Orlando weather:', err);
    throw err;
  }
}
