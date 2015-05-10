var express = require('express');
var router = express.Router();
var coolSiteRepository = require('../services/coolsiterepository');

// GET '/coolsites'
router.get('/', function(req, res, next) {
    coolSiteRepository.loadAll(function(err, coolsites) {
       if (err) {
           return next(err);
       }

       return res.json(coolsites);
    });
});

module.exports = router;