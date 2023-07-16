const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const initializePassport = require('../config/passport');
const User = require('../model/user');
const path = require('path');

// Initialize passport
initializePassport(passport);

// Configure session middleware
router.use(session({
  secret: 'mern stack project',
  resave: false,
  saveUninitialized: false,
}));

// Initialize passport and session middleware
router.use(passport.initialize());
router.use(passport.session());

// Your login and registration routes go here
router.get('/login', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../public/login.html'));
});

router.get('/register', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../public/register.html'));
});

router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(path.resolve(__dirname, '../public/admin.html'));
} else {
    res.redirect('/login');
  }
});

router.post('/register', function (req, res) {
  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (err) {
      console.log("error", err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/login');
      });
    }
  });
});

router.post('/login', function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function (err) {
    if (err) {
      res.redirect('/login');
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    }
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    req.logout(function () {}); // Use an empty callback function
    res.redirect('/login');
  });
});

module.exports = router;
