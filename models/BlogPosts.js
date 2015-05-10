var mongoose = require('mongoose');

var BlogPostSchema = new mongoose.Schema({
    uniqueIdentifier: {type: String, required: true, trim: true, unique: true },
    whenCreated: {type: Date, required: true, default: Date.now },
    author: String,
    title: {type: String, required: true, trim: true},
    htmlContent: {type: String, required: true},
    linkPath:  {type: String, required: true},
    lastUpdated: Date,
    tags: [String]
});

BlogPostSchema.pre('validate', function(next) {
    if (typeof (this.uniqueIdentifier) === 'undefined' || this.uniqueIdentifier === null) {
        // this code only ever runs when saving a new record - existing records already have this.uniqueIdentifier set
        var year = (this.whenCreated.getYear() + 1900).toString();
        var month = (this.whenCreated.getMonth() + 1).toString();
        if (month.length == 1) {
            month = "0" + month;
        }

        var day = this.whenCreated.getDate().toString();
        if (day.length == 1) {
            day = "0" + day;
        }

        var linkPath = year + "_" + month + "_" + day + "_" + this.title.replace(/\s/g, "-").toString();

        this.linkPath = linkPath;
        this.uniqueIdentifier =  'blog-' + linkPath.replace(/\//g, "-").replace(/_/g, "-");
    }

    next();
});

mongoose.model('BlogPost', BlogPostSchema);