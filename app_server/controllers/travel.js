// controllers/travel.js
const fs = require('fs');
const path = require('path');

const travelPage = (req, res) => {
  const dataPath = path.join(__dirname, '../../data/trips.json');
  const rawData = fs.readFileSync(dataPath);
  const trips = JSON.parse(rawData);

  res.render('travel', {
    title: 'Travel Destinations',
    trips: trips
  });
};

module.exports = { travelPage };
