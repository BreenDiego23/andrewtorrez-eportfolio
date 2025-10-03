const mongoose = require('mongoose');
const Reservation = require('../models/reservations');
const User = mongoose.model('users');


// Middleware-style helper to get userId from req.auth (JWT)
function requireAuth(req, res) {
  // Optional: debug to verify what's in the token
  console.log('[reservations] req.auth =', req.auth);

  const userId = req.auth && (req.auth._id || req.auth.id);
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return userId;
}

const add = async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { tripCode, tripTitle } = req.body || {};
  if (!tripCode || !tripTitle) {
    return res.status(400).json({ message: 'tripCode and tripTitle are required' });
  }

  try {
    const doc = await Reservation.findOneAndUpdate(
      { userId, tripCode },
      { $setOnInsert: { userId, tripCode, tripTitle } },
      { upsert: true, new: true }
    );
    return res.status(201).json({ ok: true, reservation: doc });
  } catch (err) {
    // duplicate index will land here if race: handle nicely
    if (err && err.code === 11000) {
      return res.status(200).json({ ok: true, message: 'Already in reservations' });
    }
    return res.status(500).json({ message: 'Error saving reservation', error: err });
  }
};

const listMine = async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    const items = await Reservation.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, reservations: items });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching reservations', error: err });
  }
};

const remove = async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { tripCode } = req.params;
  if (!tripCode) return res.status(400).json({ message: 'tripCode required' });

  try {
    await Reservation.deleteOne({ userId, tripCode });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting reservation', error: err });
  }
};

module.exports = { add, listMine, remove };