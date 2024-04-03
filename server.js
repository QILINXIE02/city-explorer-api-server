//3rd party dependencies
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import weatherData from './data/weather.json';

dotenv.config();

//application setup
const app = express();
const PORT = process.env.PORT || 3000;

//allows access to our app from client applications like our react app
app.use(cors()); 

class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = `Low of ${day.min_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  const city = weatherData.find(city =>
    city.city_name.toLowerCase() === searchQuery.toLowerCase()
  );

  if (!city) {
    res.status(404).json({ error: "City not found in placeholder data." });
    return;
  }

  const forecasts = city.data.map(day => new Forecast(day));
  res.json(forecasts);
});

app.use((error, req, res, next) => {
  console.error(error); 
  res.status(500).json({ error: "Something went wrong on the server." });
});


app.use('*', (req, res) => res.status(404).send("Not Found"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
