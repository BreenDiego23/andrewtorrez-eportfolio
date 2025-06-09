const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
  const q = await Model
    .find({}) // No filter, return all records
    .exec();

  // Uncomment the following line to show results of query
  // on the console
  // console.log(q);

  if (!q) {
    // Database returned no data
    return res
      .status(404)
      .json({ message: 'No trips found' });
  } else {
    // Return resulting trip list
    return res
      .status(200)
      .json(q);
  }
};

const tripsFindByCode = async (req, res) => {
    const tripCode = req.params.tripCode;
  
    try {
      const trip = await Model.find({ code: tripCode }).exec();
      
      if (!trip || trip.length === 0) {
        return res.status(404).json({ message: 'Trip not found' });
      }
  
      return res.status(200).json(trip);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
};
  
const tripsAddTrip = async (req, res) => {
    try {
      const trip = await Model.create(req.body);
      res.status(201).json(trip);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip 
};
