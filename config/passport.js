const passport = require('passport');
const User = require('../model/user');

// Initialize Passport
function initialize(passport) {
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}

module.exports = initialize;
