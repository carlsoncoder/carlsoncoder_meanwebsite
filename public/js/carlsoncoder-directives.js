var carlsonCoderDirectives = angular.module('carlsoncoder.directives', []);

carlsonCoderDirectives.directive('scriptLoader', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var pageName = attrs.pagename;
            switch (pageName)
            {
                case 'home':
                {
                    initializeOnControllerLoad(homeSectionLinkId, true, true);
                    break;
                }

                case 'blogentry':
                {
                    initializeOnControllerLoad(homeSectionLinkId, true, false, attrs.blogIdentifier, attrs.blogTitle, attrs.blogUrl);
                    break;
                }

                case 'about':
                {
                    initializeOnControllerLoad(aboutSectionLinkId, false, false);
                    break;
                }

                case 'coolsites':
                {
                    initializeOnControllerLoad(coolsitesSectionLinkId, false, false);
                    break;
                }

                case 'login':
                {
                    initializeOnControllerLoad(homeSectionLinkId, false, false);
                    break;
                }

                case 'archives':
                {
                    initializeOnControllerLoad(archivesSectionLinkId, false, false);
                    break;
                }

                case 'admin':
                {
                    initializeOnControllerLoad(adminSectionLinkId, true, false);
                    break;
                }
            }
        }
    };
});

carlsonCoderDirectives.directive('loadingSpinner', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch('activeCalls', function(newValue, oldValue) {
                if (newValue === 0) {
                    $(element).hide();
                }
                else {
                    $(element).show();
                }
            });
        }
    };
});

carlsonCoderDirectives.directive('blogFilterWatcher', function() {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            scope.$watch('currentPageNumber', function(newValue, oldValue) {
                // we don't care what the new value or old value is...if it's changed, we need to re-scroll
                $("html, body").animate({ scrollTop: 0 }, "slow");
            });
        }
    };
});

carlsonCoderDirectives.directive('replaceAnchorTitle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var desiredTitle = attrs.desiredtitle;
            $(element).prop('title', desiredTitle);
        }
    };
});