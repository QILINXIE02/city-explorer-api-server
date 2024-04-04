// 3rd party dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const weatherData = require('./data/weather.json');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');

// Application setup
const app = express();
const PORT = process.env.PORT || 3001;

// Allows access to our app from client applications like our react app
app.use(cors());

// Define Forecast class
class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = `Low of ${day.min_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

// Define Movies class
class Movies {
  constructor(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
    this.popularity = movieData.popularity;
  }
}

// Weather endpoint
app.get('/weather', getWeather);

// Movies endpoint
app.get('/movies', getMovies);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

// 404 Not Found handler
app.use('*', (req, res) => res.status(404).send("Not Found"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
