'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

const Challenge = require('../models/challenge');

router.get('/edit', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('challenges/edit', { user: req.user });
});

router.post('/edit', (req, res, next) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  const newChallenge = new Challenge({
    challengeName: null,
    owner: req.user._id,
    location: {
      latitud: latitude,
      longitud: longitude
    },
    sports: null,
    description: null,
    linkValidation: null,
    timelimit: null,
    enrolled: null
  });

  newChallenge.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/challenges/edit');
  });
});

module.exports = router;
