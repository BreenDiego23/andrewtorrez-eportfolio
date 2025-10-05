const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = new User();
  user.name = req.body.name;
  user.email = (req.body.email || '').toLowerCase().trim();
  user.setPassword(req.body.password);

  try {
    await user.save();
    const token = user.generateJwt();
    res.status(201).json({
      token,
      role: user.role || 'user',
      email: user.email
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    res.status(400).json({ message: 'Registration error.', error: err });
  }
};

const login = (req, res) => {
  console.log("Login route hit");

  const normEmail = (req.body.email || '').toLowerCase().trim();
  req.body.email = normEmail;

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error("Passport error:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (user) {
      const token = user.generateJwt();
      return res.status(200).json({
        token,
        role: user.role || 'user',
        email: user.email
      });
    }

    return res.status(401).json(info);
  })(req, res);
};

module.exports = { register, login };