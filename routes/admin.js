var express = require('express');
var router = express.Router();
var exceptionRepository = require('../services/exceptionrepository');
var jwt = require('express-jwt');
var AWSService = require('../services/awsservice');
var configOptions = require('../config/config.js');

var auth = jwt({secret: configOptions.JWT_SECRET_KEY, userProperty: 'payload'});

// GET '/admin/exceptions'
router.get('/exceptions', auth, function(req, res, next) {
    exceptionRepository.loadAll(function(err, exceptions) {
       if (err) {
           return next(err);
       }

       return res.json(exceptions);
    });
});

// GET '/admin/allimages'
router.get('/allimages', auth, function(req, res, next) {
    var awsServiceInstance = AWSService();
    awsServiceInstance.getAllFilesWithMetaData(function(err, files) {
        if (err) {
            return next(err);
        }

        return res.json(files);
    });
});

// POST '/admin/uploadimage'
router.post('/uploadimage', auth, function(req, res, next) {
    var dataForm = JSON.parse(req.body.data);
    var awsServiceInstance = AWSService();
    awsServiceInstance.upload(req.files.file.path, dataForm, function(err) {
        if (err) {
            return next(err);
        }

        return res.status(200).json({message: 'File upload process completed sucessfully!'});
    });
});

module.exports = router;