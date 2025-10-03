const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  tripCode: { type: String, required: true },
  tripTitle: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// One reservation per user per trip (optional, prevents duplicates)
reservationSchema.index({ userId: 1, tripCode: 1 }, { unique: true });

module.exports = mongoose.model('reservations', reservationSchema);