var readmoreIdentifier = '<!--readmore-->';

var carlsonCoderFilters = angular.module('carlsoncoder.filters', []);

carlsonCoderFilters.filter('shortenBlogPost', function() {
    return function(input, fullLinkPath) {
        var indexOfReadMore = input.toString().indexOf(readmoreIdentifier);
        var modifiedHtml = '';
        if (indexOfReadMore === -1) {
            modifiedHtml = input;
        }
        else {
            modifiedHtml = input.toString().substring(0, indexOfReadMore);

            // This is sort of a hack.  Would like to use the ui-sref directive instead, but it doesn't work that
            // great with dynamically generated HTML - maybe switch to an Angular directive in the future?
            var readMoreLink = "<a class=\"readMoreLink\" href=\"#/blog/" + fullLinkPath + "\">Read More...</a>";
            modifiedHtml = modifiedHtml + readMoreLink + '<br />';
        }

        return modifiedHtml;
    };
});

carlsonCoderFilters.filter('to_trusted_html', ['$sce', function($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    };
}]);

carlsonCoderFilters.filter('encodeBlogTitle', function() {
    return function(input) {
        return encodeSpecialCharactersInBlogTitle(input);
    };
});

carlsonCoderFilters.filter('decodeBlogTitle', function() {
    return function(input) {
        return decodeSpecialCharactersInBlogTitle(input);
    };
});