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

router.get('/search/:id', (req, res) => {
    const idChallenger = req.params.id;
    const idUser = req.user.id;
    const promise = Challenge.find({ _id: id });
    promise.then((result) => {
        const data = {
            challenge: result
        };

        let isEnrroled = false;
        data.challenge.enrolled.forEach((item) => {
            if (item === idUser) {
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

module.exports = router;