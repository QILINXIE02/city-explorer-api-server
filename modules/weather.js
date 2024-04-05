const axios = require('axios');

let cache = {};

async function getWeather(req, res) {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) throw new Error('Latitude and longitude are required.');

        const cacheKey = `${lat}-${lon}`;
        const cachedData = cache[cacheKey];

        if (cachedData && Date.now() - cachedData.timestamp < 3600000) {
            // If cached data exists and is not expired (1 hour cache)
            return res.json(cachedData.data);
        }

        const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${process.env.API_KEY}`;
        const response = await axios.get(apiUrl);
        const transformedData = response.data.data.map(transformWeatherData);

        // Update cache
        cache[cacheKey] = {
            timestamp: Date.now(),
            data: transformedData,
        };

        res.json(transformedData);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || 'Error fetching weather data.');
    }
}

function transformWeatherData(weatherData) {
    return {
        date: weatherData.ob_time,
        description: `${weatherData.weather.description}, Temp: ${weatherData.temp}`,
    };
}

module.exports = getWeather;
