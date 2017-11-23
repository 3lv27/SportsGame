'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

const Challenge = require('../models/challenge');

router.get('/home', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('challenges/new', { user: req.user });
});

//***********************************BRYAN************************************************************* */
/* GET users listing. */
router.get('/select-sport', ensureLogin.ensureLoggedIn(), (req, res, next) => {



  Challenge.find({}, 'sports', (err, sports) => {
    if (err) {
      return next(err)
    }
    const sport = Challenge.schema.path('sports').enumValues;
    const data = {

      sports: sport

    }
    res.render('selectSport', data)
  });
});

router.post('/select-sport/', (req, res, next) => {

  const sport = req.body.sport;
  console.log(sport);
  const newChallenge = new Challenge({
    challengerName: null,
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
    res.redirect('/new')
  });
});

//******************************************************************************************************************************************************************************* */

module.exports = router;

