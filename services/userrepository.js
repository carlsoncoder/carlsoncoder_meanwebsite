var mongoose = require('mongoose');
var User = mongoose.model('User');

var userRepository = {};

userRepository.findUser = function(username, callback) {
    var query = User.findOne({username: username});
    query.exec(function(err, user) {
       if (err) {
           return callback(err);
       }

       return callback(err, user);
    });
};

userRepository.attemptLogin = function(username, password, callback) {
    userRepository.findUser(username, function(err, user) {
        if (err) {
            return callback(err);
        }
        
        if (!user || !user.hasValidPassword(password)) {
            return callback(null, 'Invalid Login Details');
        }

        return callback(null, null, user);
    })
};

module.exports = userRepository;