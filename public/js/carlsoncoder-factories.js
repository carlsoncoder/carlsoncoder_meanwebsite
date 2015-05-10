var carlsonCoderFactories = angular.module('carlsoncoder.factories', []);

carlsonCoderFactories.factory('blogposts', ['$http', '$state', function($http, $state) {
    var blogPostFactory = {};
    blogPostFactory.blogPosts = [];

    blogPostFactory.getAll = function() {
        return $http.get('/blog').success(function(data) {
            angular.copy(data, blogPostFactory.blogPosts);
        });
    };

    blogPostFactory.saveBlogPost = function(blogPost) {
        var postToSave = {};

        // some fields are the same on an edit or a new post
        postToSave.title = encodeSpecialCharactersInBlogTitle(blogPost.title);
        postToSave.htmlContent = blogPost.htmlContent;
        postToSave.tags = buildTagArrayFromString(blogPost.tagString);

        if (blogPost.uniqueIdentifier) {
            // we are editing an existing blog record
            postToSave.uniqueIdentifier = blogPost.uniqueIdentifier;
            postToSave.whenCreated = blogPost.whenCreated;
            postToSave.author = blogPost.author;
            postToSave.linkPath = blogPost.linkPath;
        }
        else {
            // saving a new blog post, set some defaults
            postToSave.whenCreated = new Date();
            postToSave.author = 'Justin Carlson';
            postToSave.linkPath = '';
        }

        return $http.post('/blog/saveBlogPost', postToSave)
            .success(function(data) {
                $state.go('home');
            });
    };

    return blogPostFactory;
}]);

carlsonCoderFactories.factory('coolsites', ['$http', function($http) {
    var coolSitesFactory = {};
    coolSitesFactory.coolSites = [];

    coolSitesFactory.getAll = function() {
        return $http.get('/coolsites').success(function(data) {
            angular.copy(data, coolSitesFactory.coolSites);
        });
    };

    return coolSitesFactory;
}]);

carlsonCoderFactories.factory('images', ['$http', '$state', '$rootScope', 'Upload', function($http, $state, $rootScope, Upload) {
    var imagesFactory = {};
    imagesFactory.images = [];

    imagesFactory.getAll = function() {
        return $http.get('/admin/allimages')
            .success(function(data) {
                angular.copy(data, imagesFactory.images);
            });
    };

    imagesFactory.uploadImage = function(fileToUpload, imageDetails, callback) {
        // these are normally set by the $httpInterceptor, however, this call is not using $http so we have to manually set them
        $rootScope.activeCalls += 1;
        $rootScope.loadingText = "Uploading Image...";

        Upload.upload({
            url: 'admin/uploadimage',
            method: 'POST',
            file: fileToUpload,
            data: {
                imageName: imageDetails.name,
                imageCaption: imageDetails.caption,
                imageDescription: imageDetails.description,
                imageDivisor: imageDetails.divisor
            }
        })
        .success(function(data, status, headers, config) {
            $rootScope.activeCalls -= 1;
            if (data.toString().indexOf('The application has encountered an unexpected error') > -1) {
                return callback('An Internal Server Error Has Occurred');
            }

            callback(null);
        })
        .error(function(data, status, headers, config) {
            $rootScope.activeCalls -= 1;
            callback(data);
        });
    };

    return imagesFactory;
}]);

carlsonCoderFactories.factory('auth', ['$http', '$window', function($http, $window) {
    var authFactory = {};

    authFactory.saveToken = function(token) {
        $window.localStorage['carlson-coder-website-token'] = token;
    };

    authFactory.getToken = function() {
        return $window.localStorage['carlson-coder-website-token'];
    };

    authFactory.isLoggedIn = function() {
        var token = authFactory.getToken();
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        }
        else {
            return false;
        }
    };

    authFactory.currentUser = function() {
        if (authFactory.isLoggedIn()) {
            var token = authFactory.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    authFactory.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            authFactory.saveToken(data.token);
        });
    };

    authFactory.logOut = function() {
        $window.localStorage.removeItem('carlson-coder-website-token');
    };

    return authFactory;
}]);