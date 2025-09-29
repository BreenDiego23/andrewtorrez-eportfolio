const Trip = require('../../app_api/models/trips.js');

const travelPage = async (req, res) => {
  console.log("🔍 travelPage route hit");
  try {
    const trips = await Trip.find({});
    res.render('travel', {
      title: 'Travel Destinations',
      trips: trips
    });
  } catch (err) {
    console.error(" Error loading trips:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { travelPage };