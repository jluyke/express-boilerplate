var models  = require('../models');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var sessions = require('./../sessions.js');

var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({ username: username }).then(function(user) {
      bcrypt.compare(password, user.password, function(err, res) {
        if(err) return done(err);
        if(!res) return done({ message: 'Username or password mismatch.' });
        return done(null, user);
      });
    }).catch(function(err) {
      return done({ message: 'Username or password mismatch.' });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findOne(id).then(function(user) {
    done(null, user);
  }).catch(function(err) {
    done(new Error('User ' + id + ' does not exist'));
  });
});

router.get('/', function(req, res, next) {
  if(sessions.isLoggedIn(req)) return res.redirect('/dashboard');
  res.render('signin', { title: 'Log In' });
});

router.get('/sign-up', function(req, res, next) {
  if(sessions.isLoggedIn(req)) return res.redirect('/dashboard');
  res.render('signup', { title: 'Sign Up' });
});

router.post('/ajax/register', function(req, res, next) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      models.User.create({
        username: req.body.username,
        password: hash
      }).then(function(user) {
        req.login(user, function(err) {
          res.json({});
        });
      }).catch(function(err) {
        res.status(500).json({ error: 'User already exists.' });
      });
    });
  });
});

router.post('/ajax/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return res.status(500).json({ error: err.message });
    req.logIn(user, function(err) {
      res.json({});
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/dashboard', function(req, res, next) {
  if(!sessions.isLoggedIn(req)) return res.redirect('/');
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
