const mongoose = require('mongoose');
require('../models/trips'); // Ensure Trip model is registered
const Trip = mongoose.model('Trip');
const User = mongoose.model('users');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
  const q = await Trip
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
      const trip = await Trip.find({ code: tripCode }).exec();
      
      if (!trip || trip.length === 0) {
        return res.status(404).json({ message: 'Trip not found' });
      }
  
      return res.status(200).json(trip);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
};
  
const tripsAddTrip = async (req, res) => {
  getUser(req, res, async () => {
    try {
      const trip = await Trip.create({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: new Date(req.body.start),
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      });
      return res.status(201).json(trip);
    } catch (err) {
      return res.status(400).json(err);
    }
  });
};

const tripsUpdateTrip = async (req, res) => {
  getUser(req, res, async () => {
    try {
      const updatedTrip = await Trip.findOneAndUpdate(
        { code: req.params.tripCode },
        {
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        { new: true }
      );

      if (!updatedTrip) {
        return res
          .status(404)
          .json({ message: "Trip not found with code " + req.params.tripCode });
      }

      return res.status(200).json(updatedTrip);
    } catch (err) {
      return res.status(400).json(err);
    }
  });
};

const getUser = async (req, res, callback) => {
  if (req.payload && req.payload.email) {
    try {
      const user = await User.findOne({ email: req.payload.email }).exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      callback(req, res, user.name);
    } catch (err) {
      console.log(err);
      return res.status(404).json(err);
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

const publicTravelPage = async (req, res) => {
  try {
    const trips = await Trip.find({}).exec();
    res.render('travel', {
      title: 'All Travel Trips',
      trips: trips
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving trips', error: err });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  publicTravelPage
};
