require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');
const getLocation = require('./modules/location');
const getYelp = require('./modules/yelp');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = `Low of ${day.min_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

class Movie {
  constructor(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
    this.popularity = movieData.popularity;
  }
}

app.get('/weather', getWeather);
app.get('/movies', getMovies);
app.get('/location', getLocation);
app.get('/yelp', getYelp);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use('*', (req, res) => res.status(404).send("Not Found"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
