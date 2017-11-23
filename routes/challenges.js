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
  const challengeName = req.body.challengeName;
  const description = req.body.description;
  const linkValidation = req.body.linkValidation;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  const newChallenge = new Challenge({
    challengeName: challengeName,
    owner: req.user._id,
    location: {
      latitud: latitude,
      longitud: longitude
    },
    sports: null,
    description: description,
    linkValidation: linkValidation,
    timelimit: null,
    enrolled: null
  });

  newChallenge.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/home');
  });
});

//* **********************************BRYAN************************************************************* */
/* GET users listing. */
router.get('/select-sport', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Challenge.find({}, 'sports', (err, sports) => {
    if (err) {
      return next(err);
    }
    const sport = Challenge.schema.path('sports').enumValues;
    const data = {

      sports: sport

    };
    res.render('selectSport', data);
  });
});

router.post('/select-sport/', (req, res, next) => {
  const sport = req.body.sport;
  console.log(sport);
  const newChallenge = new Challenge({
    challengeName: null,
    owner: null,
    location: null,
    sports: sport,
    description: null,
    linkValidation: null,
    timelimit: null,
    enrolled: null
  });

  newChallenge.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/new');
  });
});

//* ****************************************************************************************************************************************************************************** */

module.exports = router;
