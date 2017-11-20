'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* _____ SIGNUP __________ */

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup', { message: 'Something went wrong' });
      } else {
        res.redirect('/auth/login');
      }
    });
  });
});

/* _____ LOGIN __________ */

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

// private user page
router.get('/home', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/home', { user: req.user });
});

module.exports = router;