const fs = require('fs');
const path = require('path');

const travelPage = (req, res) => {
  console.log("🔍 travelPage route hit");
  const dataPath = path.join(__dirname, '../../data/trips.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const trips = JSON.parse(rawData);

  res.render('travel', {
    title: 'Travel Destinations',
    trips: trips
  });
};

module.exports = { travelPage };