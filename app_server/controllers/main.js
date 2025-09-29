const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const index = (req, res) => {
  res.render('index', { title: "Travlr Getaways", loggedIn: req.session && req.session.token});
};

const login = (req, res) => {
  res.render('login', {
    title: 'Login'
  });
};

const doLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', {
        title: 'Login',
        error: 'Email not found'
      });
    }

    const hash = crypto
      .pbkdf2Sync(password, user.salt, 10000, 64, 'sha512')
      .toString('hex');

    if (hash !== user.hash) {
      return res.render('login', {
        title: 'Login',
        error: 'Incorrect password'
      });
    }

    req.session.token = 'mock-jwt-token';
    req.session.user = {
      email: user.email,
      role: user.role
    };

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', {
      title: 'Login',
      error: 'An error occurred. Please try again.'
    });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

const news = (req, res) => {
  res.render('news', {
    title: 'Travel News'
  });
};

const reservations = (req, res) => {
  if (req.session && req.session.token) {
    res.render('reservations', {
      title: 'Your Reservations',
      message: 'You have no reservations yet.'
    });
  } else {
    res.redirect('/login');
  }
};

const registerForm = (req, res) => {
  res.render('register', {
    title: 'Register'
  });
};

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        title: 'Register',
        error: 'Email is already registered'
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    const newUser = new User({
      name,
      email,
      salt,
      hash
    });

    await newUser.save();

    req.session.token = 'mock-jwt-token';
    req.session.user = {
      email: newUser.email,
      role: newUser.role
    };

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', {
      title: 'Register',
      error: 'Registration failed. Please try again.'
    });
  }
};

module.exports = {
  index,
  login,
  doLogin,
  logout,
  news,
  reservations,
  registerForm,
  registerUser
};