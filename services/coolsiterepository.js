var mongoose = require('mongoose');
var CoolSites = mongoose.model('CoolSite');

var coolSiteRepository = {};

coolSiteRepository.loadAll = function(callback) {
    CoolSites.find(function(err, sites) {
        if (err) {
            return callback(err);
        }

        return callback(null, sites);
    });
};

module.exports = coolSiteRepository;