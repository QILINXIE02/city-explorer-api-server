'use strict';

const axios = require('axios');

async function getLocation(req, res) {
    try {
        let city = req.query.city;
        let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.VITE_LOCATION_ACCESS_TOKEN}&q=${city}&format=json`;

        let axiosResponse = await axios.get(url);
        let locationData = axiosResponse.data[0]; // Access the first location data

        let location = new Location(locationData);

        res.json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching location data." });
    }
}

class Location {
    constructor(locationData) {
        this.name = locationData.display_name;
        this.latitude = locationData.lat;
        this.longitude = locationData.lon;
    }
}

module.exports = getLocation;
