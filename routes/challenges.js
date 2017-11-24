'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

const Challenge = require('../models/challenge');

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
    const newChallenge = new Challenge({
        challengeName: null,
        owner: req.user._id,
        location: null,
        sports: sport,
        description: null,
        linkValidation: null,
        timelimit: null,
        enrolled: null
    });

    newChallenge.save((err, result) => {
        if (err) {
            return next(err);
        }
        res.redirect(`/challenges/edit/${result._id}`);
    });
});

router.get('/edit/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const data = {
        challengeId: req.params.id
    };
    res.render('challenges/edit', data);
});

router.post('/edit/:id', (req, res, next) => {
    const challengeName = req.body.challengeName;
    const description = req.body.description;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const newChallenge = {
        challengeName: challengeName,
        location: {
            latitud: latitude,
            longitud: longitude
        },
        description: description,
        enrolled: []
    };

    Challenge.findOneAndUpdate({ _id: req.params.id }, { $set: newChallenge }, (err, result) => {
        if (err) {
            return next(err);
        }
        res.redirect('/challenges/search');
    });
});

router.get('/search', ensureLogin.ensureLoggedIn(), function(req, res, next) {
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

router.get('/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
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

router.get('/:id/finished', ensureLogin.ensureLoggedIn(), (req, res, next) => {
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


router.post('/:id/results', (req, res, next) => {
    const idChallenger = req.params.id;
    const promise = Challenge.findOneAndUpdate({ _id: idChallenger }, { linkValidation: null });
    promise.then((result) => {
        res.redirect('/home');
    });
    promise.catch((error) => {
        next(error);
    });
});



module.exports = router;