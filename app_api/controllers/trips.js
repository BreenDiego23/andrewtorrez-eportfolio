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
          start: new Date(req.body.start),
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

// Replace your current getUser with this:
const getUser = async (req, res, callback) => {
  // express-jwt v7 puts the decoded token on req.auth
  const claims = req.auth || req.payload || {};
  const email = (claims.email || '').toLowerCase().trim();
  const id    = claims._id || claims.id || null;

  console.log('[getUser] claims:', claims);
  console.log('[getUser] seeking by:',
    email ? `email=${email}` : (id ? `id=${id}` : 'none'));

  try {
    let user = null;

    if (email) {
      user = await User.findOne({ email }).exec();
    }
    if (!user && id) {
      user = await User.findById(id).exec();
    }

    if (!user) {
      console.warn('[getUser] token valid, but user not found in DB');
      return res.status(404).json({ message: 'User not found' });
    }

    return callback(req, res, user.name);
  } catch (err) {
    console.error('[getUser] error:', err);
    return res.status(500).json({ message: 'User lookup failed', error: err });
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
