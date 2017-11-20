'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// passport
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const flash = require('connect-flash');

const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

// database

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sports-game', {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});

// session

app.use(session({
    secret: 'our-passport-local-strategy-app',
    resave: true,
    saveUninitialized: true
}));

// passport

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findOne({ '_id': id }, (err, user) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(null, false, { message: 'Incorrect username' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: 'Incorrect password' });
        }

        return next(null, user);
    });
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals = {
    user: req.user
  };
  next();
});

// use routes

app.use('/', auth);
app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
<<<<<<< HEAD
    const err = new Error('Not Found');
    err.status = 404;
    res.render("not-found");
=======
  const err = new Error('Not Found');
  err.status = 404;
  res.render('not-found');
>>>>>>> 9954e63f970fb807870fef664f9bcc130616486b
});

// error handler
app.use(function(err, req, res, next) {
<<<<<<< HEAD
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
=======
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
>>>>>>> 9954e63f970fb807870fef664f9bcc130616486b
});



module.exports = app;