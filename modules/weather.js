const axios = require('axios');

async function getWeather(req, res) {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) throw new Error('Latitude and longitude are required.');

        const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${process.env.API_KEY}`;
        const response = await axios.get(apiUrl);
        const data = response.data.data.map(transformWeatherData);

        res.json(data);
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
