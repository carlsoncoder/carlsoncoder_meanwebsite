var Feed = require('feed');
var blogRepository = require('../services/blogrepository');

var feedGenerator = {};

feedGenerator.generateFeed = function(isAtom, callback) {
    blogRepository.loadRecentForFeed(function(err, records) {
        if (err) {
            return callback(err);
        }
        else {
            var feed = new Feed({
                title:          "CarlsonCoder's Blog",
                description:    "CarlsonCoder's Blog",
                link:           "http://www.carlsoncoder.com",
                copyright:      "All Rights Reserved 2015, Justin Carlson",
                author: {
                    name:       "Justin Carlson",
                    email:      "justin@carlsoncoder.com",
                    link:       "http://www.carlsoncoder.com"
                }
            });

            feed.addCategory("Software");
            feed.addCategory("Arduino");
            feed.addCategory("Raspberry Pi");
            feed.addCategory("Coding");
            feed.addCategory("Development");
            feed.addCategory("Leadership");

            for (var i = 0; i < records.length; i++) {
                var post = records[i];
                feed.addItem({
                    title:          post.title,
                    link:           'http://www.carlsoncoder.com/#blog/' + post.linkPath,
                    description:    post.title,
                    content:        post.htmlContent,
                    date:           post.whenCreated,
                    author: {
                        name:       "Justin Carlson",
                        email:      "justin@carlsoncoder.com",
                        link:       "http://www.carlsoncoder.com"
                    }
                })
            }

            if (isAtom =4== true) {
                return callback(null, feed.render('atom-1.0'));
            }
            else {
                return callback(null, feed.render('rss-2.0'));
            }
        }
    })
};

module.exports = feedGenerator;