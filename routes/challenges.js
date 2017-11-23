'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

const Challenge = require('../models/challenge');

router.get('/new', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('challenges/new', { user: req.user });
});

router.get('/search', function(req, res, next) {
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
            res.render('challenges/start/', data);
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
            next(err)
        });
    });
    promise.catch((error) => {
        next(error);
    });
});

router.post('/start', (req, res, next) => {
    const link = req.body.Link;
    const idChallenger = req.params.id;
    const promise = Challenge.findOne({ _id: idChallenger });
    promise.then((result) => {
        let challenge = result;
        challenge.linkValidation = "link";
        res.redirect(`/challenges/congrats`);
    });
    promise.catch((error) => {
        next(error);
    });
});


/*
router.post('/finish/:id', (req, res, next) => {
    const idChallenger = req.params.id;
    const promise = Challenge.findOne({ _id: idChallenger });
    promise.then((result) => {
        const data = {
            challenge: result
        };

        var isFinnish = false;
        if ((data.challenge.link) !== null) {
            isFinnish = true;
        }

        if (isFinnish) {
            res.render('challenges/congrats', data);
        } else {
            res.render('challenges/loser', data);
        }
    });
    promise.catch((error) => {
        next(error);
    });
});

router.post('/finnish/:id', (req, res, next) => {
    const idChallenger = req.params.id;
    const promise = Challenge.findOne({ _id: idChallenger });
    promise.then((result) => {
        let challenge = result;
        if (challenge.link !== null) {
            res.render('challenges/congrats', challenge);
        } else {
            res.render('/challenges/loser', challenge);
        }

    });
    promise.catch((error) => {
        next(error);
    });
});
*/
module.exports = router;