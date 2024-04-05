const axios = require('axios');
let yelpCache = {};

async function getYelp(req, res) {
    const { latitude, longitude } = req.query;
    const cacheKey = `yelp-${latitude}-${longitude}`;
    const now = Date.now();
    const cacheTime = 3600 * 1000; // 1 hour in milliseconds

    if (yelpCache[cacheKey] && now - yelpCache[cacheKey].timestamp < cacheTime) {
        return res.json(yelpCache[cacheKey].data);
    }

    try {
        const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
            headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` },
            params: { latitude, longitude, limit: 20 },
        });

        const businesses = response.data.businesses.map(business => ({
            name: business.name,
            image_url: business.image_url,
            price: business.price,
            rating: business.rating,
            url: business.url,
        }));

        // Update cache
        yelpCache[cacheKey] = { timestamp: now, data: businesses };

        res.json(businesses);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Yelp data');
    }
}

module.exports = getYelp;
