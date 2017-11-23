'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

const Challenge = require('../models/challenge');

router.get('/new', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('challenges/new', { user: req.user });
});

router.get('/search', function (req, res, next) {
  console.log(req.user);
  const promise = Challenge.find({});
  promise.then((result) => {
    const data = {
      challenger: result
    };
    res.render('challenges/search', data);
  });
  promise.catch((error) => {
    next(error);
  });
});

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

router.get('/:id', (req, res, next) => {
  const idChallenger = req.params.id;
  const idUser = req.user._id;
  const promise = Challenge.findOne({ _id: idChallenger });
  promise.then((result) => {
    const data = {
      challenge: result
    };

    var isEnrroled = false;
    data.challenge.enrolled.forEach((item) => {
      if ((item + '') == (idUser + '')) {
        isEnrroled = true;
      }
    });
    if (isEnrroled) {
      res.render('challenges/start', data);
    } else {
      res.render('challenges/summary', data);
    }
  });
  promise.catch((error) => {
    next(error);
  });
});

router.post('/:id', (req, res, next) => {
  const idChallenger = req.params.id;
  const idUser = req.user._id;
  const promise = Challenge.findOne({ _id: idChallenger });
  promise.then((result) => {
    let challenge = result;
    challenge.enrolled.push(idUser);

    const secondPromise = Challenge.update({ _id: idChallenger }, { $set: challenge });
    secondPromise.then((result) => {
      res.redirect(`/challenges/${idChallenger}`);
    });
    secondPromise.catch((err) => {
      next(err);
    });
  });
  promise.catch((error) => {
    next(error);
  });
});

router.get('/:id/finished', (req, res, next) => {
  const idChallenger = req.params.id;
  const promise = Challenge.findOne({ _id: idChallenger });
  promise.then((result) => {
    const challenge = result;
    const data = {
      challenge: result
    };
    if (challenge.linkValidation.length === 0) {
      res.render('challenges/loser');
    } else {
      res.render('challenges/congrats', data);
    }
  });
  promise.catch((error) => {
    next(error);
  });
});

router.post('/:id/finished', (req, res, next) => {
  const link = req.body.Link;
  const idChallenger = req.params.id;
  const promise = Challenge.findOneAndUpdate({ _id: idChallenger }, { $set: { linkValidation: link } });
  promise.then((result) => {
    res.redirect(`/challenges/${idChallenger}/finished`);
  });
  promise.catch((error) => {
    next(error);
  });
});

module.exports = router;
