var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var feedGenerator = require('../services/feedgenerator');
var configOptions = require('../config/config.js');

var auth = jwt({secret: configOptions.JWT_SECRET_KEY, userProperty: 'payload'});

// GET '/'
router.get('/', function(req, res, next) {
    res.render('index', {
        config_disqus_shortname: configOptions.DISQUS_SHORT_NAME,
        config_ga_account_id: configOptions.GA_ACCOUNT_ID
    });
});

// POST '/login'
router.post('/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all required fields'});
    }

    passport.authenticate('local', function(err, user, info) {
       if (err) {
           return next(err);
       }

       if (user) {
           return res.json({token: user.generateJWT()});
       }
       else {
           return res.status(401).json(info);
       }
    })(req, res, next);
});

// GET '/feed.xml'
router.get('/feed.xml', function(req, res, next) {
    feedGenerator.generateFeed(false, function(err, feedXml) {
       if (err) {
           return next(err);
       }

       res.set('Content-Type', 'application/rss+xml');
       res.send(feedXml);
    });
});

module.exports = router;