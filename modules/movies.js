require('dotenv').config();
const axios = require('axios');

// Define the class for movies
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

// Define the function to get movies
async function getMovies(request, response, next) {
    try {
        const { city } = request.query;

        if (!city) {
            return response.status(400).send('City is required');
        }

        const movieAPI = process.env.MOVIE_API_KEY;
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(city)}&api_key=${movieAPI}`;

        const movieResponse = await axios.get(url);
       
        const movies = movieResponse.data.results.map(item => new Movies(item));

        response.json(movies);
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
}

module.exports = getMovies;
