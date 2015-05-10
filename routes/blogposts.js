var express = require('express');
var router = express.Router();
var blogRepository = require('../services/blogrepository');
var jwt = require('express-jwt');
var configOptions = require('../config/config.js');

var auth = jwt({secret: configOptions.JWT_SECRET_KEY, userProperty: 'payload'});

// GET '/blog'
router.get('/', function(req, res, next) {
    blogRepository.loadAll(function(err, records) {
       if (err) {
           return next(err);
       }

        return res.json(records);
    });
});

// GET '/blog/uniquetitles'
router.get('/uniquetitles', auth, function(req, res, next) {
    blogRepository.loadUniqueTitles(function(err, titles) {
       if (err) {
           return next(err);
       }

       return res.json(titles);
    });
});

// POST '/blog/saveBlogPost'
router.post('/saveBlogPost', auth, function(req, res, next) {
   blogRepository.saveBlogPost(req, function(err) {
      if (err) {
          return next(err);
      }

       return res.status(200).json({message: 'Blog saved sucessfully!'});
   });
});

module.exports = router;