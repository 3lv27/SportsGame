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
    if (err) {
      next(err);
      return;
    }

    if (user) {
      const data = {
        message: 'The username already exists'
      };
      res.render('auth/signup', data);
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
        next(err);
        return;
      }

      req.login(newUser, () => {
        res.redirect('/profile');
      });
    });
  });
});

/* _____ LOGIN __________ */

router.get('/login', (req, res, next) => {
  res.render('auth/login', { 'message': req.flash('error') });
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

/* _____ LOGOUT__________ */

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
