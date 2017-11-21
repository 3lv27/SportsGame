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
    let challengesOne = new Challenge({
        challengerName: 'qwer',
        owner: null,
        location: {
            latitud: 12342134,
            longitud: 12342134
        },
        sports: [1, 2, 4],
        description: 'qwerqwe',
        linkValidation: 'qwerqwer',
        timeLimit: null,
        enrolled: null
    })
    let challengesTwo = new Challenge({
        challengerName: 'qwerwerwqerqwer',
        owner: null,
        location: {
            latitud: 1223342134,
            longitud: 123342342134
        },
        sports: [1, 2, 4],
        description: 'wqerwer',
        linkValidation: 'qwerwqerwqer',
        timeLimit: null,
        enrolled: null
    })
    const data = {
        challenger: [challengesOne, challengesTwo]
    }
    res.render('challenges/search', data);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const promise = Challenge.find({ _id: id });
    promise.then((result) => {
        const data = {
            challenge: result
        };
        res.render('challenges/details', data);
    });
    promise.catch((error) => {
        next(error);
    });
});



module.exports = router;