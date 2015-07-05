// the amount of blog posts to show on each page of the home screen
var postsPerPage = 5;
var currentBlogPostToSave;

var carlsonCoderControllers = angular.module('carlsoncoder.controllers', []);

carlsonCoderControllers.controller('MainController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    'auth',
    'blogposts',
    function($scope, $rootScope, $state, $stateParams, auth, blogposts) {
        // always clear this out when not in admin controller
        currentBlogPostToSave = null;

        $scope.posts = blogposts.blogPosts;
        $scope.filteredBlogIds = [];
        $scope.isLoggedIn = auth.isLoggedIn;

        if ($stateParams.fullLinkPath) {
            $scope.currentLoadedBlogPathLink = $stateParams.fullLinkPath;
            for (var i = 0; i < blogposts.blogPosts.length; i++) {
                var post = blogposts.blogPosts[i];
                if (post.linkPath === $stateParams.fullLinkPath) {
                    $scope.currentBlogPost = post;
                    break;
                }
            }
        }

        determineCurrentBlogFilter();

        $scope.shouldShowPost = function(post) {
            return $scope.filteredBlogIds.indexOf(post.uniqueIdentifier) > -1;
        };

        $scope.loadOlderBlogs = function() {

            // every time we load older blogs, we assume there is a "newer blogs" link available
            $scope.showNewerPostsLink = true;

            var newPageNumber = $rootScope.currentPageNumber + 1;

            // first time - current page is 0, new page is 1
            // we want to start at (newPageNumber * postsPerPage), and go to ((newPageNumber * postsPerPage) + postsPerPage)
            var startIndex = newPageNumber * postsPerPage;
            var endIndex = (newPageNumber * postsPerPage) + postsPerPage;

            var filtered = $scope.posts.slice(startIndex, endIndex);
            resetFilteredIds(filtered);

            if (filtered.length !== postsPerPage) {
                // we didn't get a full page back - we're DEFINITELY at the end of the list
                // "Show Older" button should no longer be shown
                $scope.showOlderPostsLink = false;
            }

            // we're almost done
            // however, they COULD have the exact match of records per page, but still not have any new records
            // need to see if we're truly at the end...
            if (endIndex === $scope.posts.length) {
                $scope.showOlderPostsLink = false;
            }

            $rootScope.currentPageNumber = newPageNumber;
        };

        $scope.loadNewerBlogs = function() {
            // every time we load newer blogs, we assume there is a "older blogs" link available
            $scope.showOlderPostsLink = true;

            var newPageNumber = $rootScope.currentPageNumber - 1;

            // as long as we're not on the first page (page index 0), the newer posts link will always show
            if (newPageNumber > 0) {
                $scope.showNewerPostsLink = true;
            }
            else {
                $scope.showNewerPostsLink = false;
            }

            // first time - current page is 1, new page is 0  (should get 0,2)
            // we want to start at (newPageNumber * postsPerPage), and go to ((newPageNumber * postsPerPage) + postsPerPage)
            var startIndex = newPageNumber * postsPerPage;
            var endIndex = (newPageNumber * postsPerPage) + postsPerPage;

            var filtered = $scope.posts.slice(startIndex, endIndex);
            resetFilteredIds(filtered);

            $rootScope.currentPageNumber = newPageNumber;
        };

        $scope.editBlogPost = function() {
            currentBlogPostToSave = $scope.currentBlogPost;
            currentBlogPostToSave.tagString = buildDelimitedStringFromTagArray($scope.currentBlogPost.tags);
            $state.go('newblogpost');
        };

        function determineCurrentBlogFilter() {
            var filtered = [];
            if (IsNullOrUndefined($rootScope.currentPageNumber) || $rootScope.currentPageNumber === 0) {
                // if we're in this code block, we're in an initial load (or the user never migrated from the first loaded blog page)
                $rootScope.currentPageNumber = 0;

                filtered = $scope.posts.slice(0, postsPerPage);
                resetFilteredIds(filtered);

                // initial load NEVER shows the "Newer Posts" link
                $scope.showNewerPostsLink = false;

                // "Older Posts" link initially shows if there are more posts than the postsPerPage value
                $scope.showOlderPostsLink = $scope.posts.length > postsPerPage;
            }
            else {
                // in here, it means a user was probably viewing a blog and hit the 'back' button
                // since we know we're not on page 0, we can assume that the "show newer" will always show
                $scope.showNewerPostsLink = true;

                var startIndex = $rootScope.currentPageNumber * postsPerPage;
                var endIndex = ($rootScope.currentPageNumber * postsPerPage) + postsPerPage;

                filtered = $scope.posts.slice(startIndex, endIndex);
                resetFilteredIds(filtered);

                if (filtered.length !== postsPerPage) {
                    // we didn't get a full page back - we're DEFINITELY at the end of the list
                    // "Show Older" button should no longer be shown
                    $scope.showOlderPostsLink = false;
                }

                // we're almost done
                // however, they COULD have the exact match of records per page, but still not have any new records
                // need to see if we're truly at the end...
                if (endIndex === $scope.posts.length) {
                    $scope.showOlderPostsLink = false;
                }
            }
        }

        function resetFilteredIds(filtered) {
            $scope.filteredBlogIds = [];
            for (var j = 0; j < filtered.length; j++) {
                $scope.filteredBlogIds.push(filtered[j].uniqueIdentifier);
            }
        }
    }]);

carlsonCoderControllers.controller('AboutController', [
    '$scope',
    function($scope) {
        // always clear this out when not in admin controller
        currentBlogPostToSave = null;
}]);

carlsonCoderControllers.controller('CoolSitesController', [
    '$scope',
    'coolsites',
    function($scope, coolsites) {
        $scope.coolsites = coolsites.coolSites;

        // always clear this out when not in admin controller
        currentBlogPostToSave = null;
}]);

carlsonCoderControllers.controller('ArchivesController', [
    '$scope',
    '$stateParams',
    'blogposts',
    function($scope, $stateParams, blogposts) {
        $scope.blogArchives = [];
        $scope.taggedBlogs = [];

        // always clear this out when not in admin controller
        currentBlogPostToSave = null;

        if ($stateParams.tagName) {
            // only show the ones matching the tag searched for
            $scope.showAllArchives = false;
            $scope.tagName = decodeSpecialCharactersInBlogTitle($stateParams.tagName).toLowerCase();

            for (var j = 0; j < blogposts.blogPosts.length; j++) {
                var searchPost = blogposts.blogPosts[j];
                var index = $.inArray($scope.tagName, searchPost.tags);
                if (index !== -1) {
                    $scope.taggedBlogs.push(searchPost);
                }
            }
        }
        else {
            // show all archives
            $scope.showAllArchives = true;
            var currentBlogMonth = '';
            var currentBlogArchives = [];
            for (var i = 0; i < blogposts.blogPosts.length; i++) {
                var currentPost = blogposts.blogPosts[i];
                var monthDate = currentPost.whenCreated.toString().substring(0, 7);
                if (currentBlogMonth === '') {
                    currentBlogMonth = monthDate;
                }

                if (monthDate !== currentBlogMonth) {
                    // starting with a new collection
                    $scope.blogArchives.push({
                        displayMonth: formatMonthString(currentBlogMonth),
                        thisMonthsArchives: currentBlogArchives.slice(0)
                    });

                    // reset local array
                    currentBlogArchives = [];
                    currentBlogMonth = monthDate;
                }

                currentBlogArchives.push(currentPost);
            }

            // add the last one to the list
            $scope.blogArchives.push({
                displayMonth: formatMonthString(currentBlogMonth),
                thisMonthsArchives: currentBlogArchives.slice(0)
            });
        }
}]);

carlsonCoderControllers.controller('AdminController', [
    '$scope',
    '$state',
    'images',
    'blogposts',
    'colors',
    function($scope, $state, images, blogposts, colors) {
        $scope.newBlogPost = {};
        $scope.imageDetails = {};
        $scope.imageDetails.divisor = 8;
        $scope.currentDate = new Date();
        $scope.allImages = images.images;

        if (!IsNullOrUndefined(currentBlogPostToSave))
        {
            $scope.newBlogPost = currentBlogPostToSave;
        }

        function validateUploadPicture() {
            var error = '';
            if (IsNullOrUndefined($scope.imageDetails.name) || $scope.imageDetails.name === '') {
                error = 'You must define a name for the image';
            }
            else if (IsNullOrUndefined($scope.imageDetails.caption) || $scope.imageDetails.caption === '') {
                error = 'You must define a caption for the image';
            }
            else if (IsNullOrUndefined($scope.imageDetails.description) || $scope.imageDetails.description === '') {
                error = 'You must define a description for the image';
            }
            else if (IsNullOrUndefined($scope.imageDetails.divisor) || $scope.imageDetails.divisor === '') {
                error = 'You must define a divisor value for the image';
            }
            else if (!IsNumber($scope.imageDetails.divisor)) {
                error = 'The divisor value must be a valid decimal';
            }
            else if (!$scope.files || !$scope.files.length) {
                error = 'You must select a file';
            }

            return error;
        }

        // initialize TinyMCE options
        var desiredHeight = GetViewPortHeight() * 0.65;
        var minHeight = desiredHeight * 0.9;
        var maxHeight = desiredHeight * 1.1;

        $scope.tinymceOptions = {
            mode: 'exact',
            elements: "blogHtmlContent",
            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table contextmenu paste"
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
            max_height: maxHeight,
            min_height: minHeight,
            height: desiredHeight
        };

        $scope.validateNewPost = function() {
            $scope.error = '';

            if (IsNullOrUndefined($scope.newBlogPost.title) || $scope.newBlogPost.title === '') {
                $scope.error = 'You must provide a blog title!';
                return;
            }

            if (IsNullOrUndefined($scope.newBlogPost.htmlContent) || $scope.newBlogPost.htmlContent === '') {
                $scope.error = 'You must enter blog content';
                return;
            }

            // assign the validated post ($scope.newBlogPost) to a value outside of the controller (currentBlogPostToSave)
            // this is a little hacky, but better than trying to send all the data through a state change
            $scope.newBlogPost.tags = buildTagArrayFromString($scope.newBlogPost.tagString);
            currentBlogPostToSave = $scope.newBlogPost;
            $state.go('previewblogpost');
        };

        $scope.saveBlogPost = function() {
            currentBlogPostToSave = null;
            blogposts.saveBlogPost($scope.newBlogPost);
        };

        $scope.returnToEditing = function() {
            $state.go('newblogpost');
        };

        $scope.uploadPicture = function() {
            $scope.error = '';
            var validationResult = validateUploadPicture();
            if (validationResult !== '') {
                $scope.error = validationResult;
                return;
            }

            var fileToUpload = $scope.files[0];
            images.uploadImage(fileToUpload, $scope.imageDetails, function(err) {
                if (err) {
                    $scope.error = err;
                    return;
                }
                else {
                    $state.go('viewpictures');
                }
            });
        };

        $scope.validateColor = function() {
            if (IsNullOrUndefined($scope.selectedHexColorCode) || $scope.selectedHexColorCode === '') {
                $scope.error = 'You must enter a hex color code';
                return;
            }

            if (!$scope.selectedHexColorCode.startsWith('#')) {
                $scope.error = 'Hex color codes must start with a # symbol';
                return;
            }

            if ($scope.selectedHexColorCode.match(/^#[a-f0-9]{6}$/i) === null) {
                $scope.error = 'Invalid Hex Color Code Entered: Must be in format #AAFF88';
                return;
            }

            colors.setColor($scope.selectedHexColorCode, function(status, msg) {
                if (status === true) {
                    alert('Color Saved Successfully!');
                    $state.go('admin');
                }
                else {
                    $scope.errorMessage = 'Error saving color: ' + msg;
                }
            });
        };
    }
]);

carlsonCoderControllers.controller('NavigationController', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth) {
        $scope.user = {};

        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;

        $scope.user = {};

        $scope.logIn = function() {
            auth.logIn($scope.user)
                .error(function (error) {
                    $scope.error = error;
                })
                .then(function () {
                    $state.go('admin');
                });
        };

        $scope.logOut = function() {
            auth.logOut();
            $state.go('home');
        };
    }
]);