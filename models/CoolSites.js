var mongoose = require('mongoose');

var CoolSiteSchema = new mongoose.Schema({
    name: String,
    link: String,
    description: String
});

mongoose.model('CoolSite', CoolSiteSchema);