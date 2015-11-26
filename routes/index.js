var models  = require('./../models');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var sessionUtils = require('./../utils/sessionUtils.js');
var randomUtils = require('./../utils/randomUtils.js');

router.get('/', function(req, res, next) {
    if(sessionUtils.isLoggedIn(req))
        return res.redirect('/dashboard');
    res.render('signin', { title: 'Log In' });
});

router.get('/sign-up', function(req, res, next) {
    if(sessionUtils.isLoggedIn(req))
        return res.redirect('/dashboard');
    res.render('signup', { title: 'Sign Up' });
});

router.get('/logout', function(req, res, next) {
    models.Session.update({
        sessionId: req.cookies.sessionId
    }, {
        where: {
            expiresAt: new Date()
        }
    }).then(function(session) {
        res.clearCookie('sessionId');
        res.clearCookie('accountId');
        res.redirect('/');
    }, function(err) {
        res.redirect('/');
    });
});

router.get('/dashboard', function(req, res, next) {
    if(!sessionUtils.isLoggedIn(req)) return res.redirect('/');
    res.render('dashboard', { title: 'Dashboard' });
});

// AJAX

router.post('/ajax/register', function(req, res, next) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            models.Account.create({
                id: randomUtils.generateId(),
                username: req.body.username,
                password: hash
            }).then(function(account) {
                models.Session.create({
                    id: randomUtils.generateId(),
                    ownerId: account.id
                }).then(function(session) {
                    res.json({
                        sessionId: session.id,
                        accountId: account.id
                    });
                }, function(err) {
                    res.status(500).json({ message: 'Session creation error.' });
                });
            }, function(err) {
                res.status(500).json({ message: 'Model creation error.' });
            });
        });
    });
});

router.post('/ajax/login', function(req, res, next) {
    models.Account.findOne({
            username: req.body.username
        }).then(function(account) {
            if(!account)
                return res.status(403).json({ message: 'Account/password invalid.' });
            bcrypt.compare(req.body.password, account.password, function(err, hash) {
                if(err)
                    return res.status(500).json({ message: 'Unkown error.' });
                if(hash) {
                    models.Session.create({
                        id: randomUtils.generateId(),
                        ownerId: account.id
                    }).then(function(session) {
                        res.json({
                            sessionId: session.id,
                            accountId: account.id
                        });
                    }, function(err) {
                        console.log(err);
                        res.status(500).json({ message: 'Session creation error.' });
                    });
                } else {
                    res.status(403).json({ message: 'Account/password invalid.' });
                }
            });
        }, function(err) {
            res.status(403).json({ message: 'Account/password invalid.' });
        });
});

module.exports = router;
