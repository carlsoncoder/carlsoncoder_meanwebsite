var mongoose = require('mongoose');
var BlogPost = mongoose.model('BlogPost');
var recentBlogPostCount = 10;

var blogRepository = {};

blogRepository.loadAll = function(callback) {
    var query = BlogPost.find().sort('-whenCreated');
    query.exec(function (err, blogposts) {
        if (err) {
            return callback(err);
        }

        return callback(null, blogposts);
    });
};

blogRepository.loadRecentForFeed = function(callback) {
    var query = BlogPost.find().sort('-whenCreated').limit(recentBlogPostCount);
    query.exec(function(err, blogposts) {
        if (err) {
            return callback(err);
        }

        return callback(null, blogposts);
    });
};

blogRepository.loadUniqueTitles = function(callback) {
    var query = BlogPost.find().sort('-whenCreated').select('title');
    query.exec(function(err, titles) {
        if (err) {
            return callback(err);
        }

        return callback(null, titles);
    });
};

blogRepository.saveBlogPost = function(req, callback) {
    if (req.body.uniqueIdentifier) {
        // we are updating an existing record
        var updateData = {
            title: req.body.title,
            htmlContent: req.body.htmlContent,
            tags: req.body.tags,
            lastUpdated: new Date()
        };

        BlogPost.update({uniqueIdentifier: req.body.uniqueIdentifier}, updateData, function(err, affected) {
            if (err) {
                return callback(err);
            }

            return callback(null);
        });
    }
    else {
        // we are saving a new record
        var post = new BlogPost(req.body);
        post.save(function (err, post) {
            if (err) {
                return callback(err);
            }

            return callback(null);
        });
    }
};

module.exports = blogRepository;