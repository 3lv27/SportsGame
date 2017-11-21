'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

const Challenge = require('../models/challenge');

router.get('/new', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('challenges/new', { user: req.user });
});

module.exports = router;
