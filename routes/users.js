var express = require('express');
var router = express.Router();
var Challenger = require('../models/challenger');

/* GET users listing. */
router.get('/profile', function (req, res, next) {
  res.render('auth/profile');
});

router.get('/challenge', (req, res, next) => {
  const demo = new Challenger();
  const sports =
    demo.schema.path('sports').enumValues;
  console.log(sports)

  res.render('selecSport');




})

module.exports = router;

