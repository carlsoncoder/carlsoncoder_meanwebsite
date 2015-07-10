// change this to 'true' to get detailed debug output
var shouldLogToConsole = false;

var latestSelectedHexColor;

// NOTE: Bootstrap has been modified to have the @grid-float-breakpoint value be 1200px - if that is changed, change this as well
var bootstrap_grid_float_breakpoint_pixel_value = 1200;

// initialize global variable used for Disqus
var disqus_shortname;

var homeSectionLinkId = '#homeSectionLink';
var aboutSectionLinkId = '#aboutSectionLink';
var coolsitesSectionLinkId = '#coolsitesSectionLink';
var archivesSectionLinkId = '#archivesSectionLink';
var adminSectionLinkId = '#adminSectionLink';

/// <summary>
/// Handles JavaScript code that must run when a given Angular controller is initialized.
/// </summary>
/// <param name="sectionLinkID">The ID of the main section of the application we have loaded.</param>
/// <param name="shouldHighlight">Whether or not we should try to highlight source code.</param>
/// <param name="isFullBlogPage">Whether or not we are loading the full blog page, or a single blog entry page.</param>
/// <param name="blogUniqueIdentifier">The unique identifier of the blog being loaded, if applicable.</param>
/// <param name="blogTitle">The title of the blog being loaded, if applicable.</param>
/// <param name="blogUrl">The URL of the blog being loaded, if applicable.</param>
function initializeOnControllerLoad(sectionLinkID, shouldHighlight, isFullBlogPage, blogUniqueIdentifier, blogTitle, blogUrl) {
    // set the active menu item in the navbar
    $('.sectionLink').removeClass('active');
    $(sectionLinkID).addClass('active');

    // we need to scroll to the top when a user navigates to a new page
    $("html, body").animate({ scrollTop: 0 }, "slow");

    if (shouldHighlight === true) {
        // This is important.  If we don't wrap this in a setTimeout callback, it will execute from the calling function,
        // which in this case is an AngularJS controller...and it will execute prior to the DOM being loaded and the actual
        // <pre /> tags existing on the page.  Wait a second, then try to highlight the source code
        setTimeout(function() {
            highlightSourceCode();
        }, 1000);
    }

    if (isFullBlogPage === true) {
        // see comments above that explain why we do this in a timeout - similar reason here
        setTimeout(function() {
            initDisqusCommentCounts();
        }, 1000);
    }
    else if (!IsNullOrUndefined(blogUniqueIdentifier) && blogUniqueIdentifier !== '') {
        // see comments above that explain why we do this in a timeout - similar reason here
        setTimeout(function() {
            initializeDisqusCommentDiv(blogUniqueIdentifier, blogTitle, blogUrl);
        }, 1000);
    }

    if (sectionLinkID === homeSectionLinkId || sectionLinkID === adminSectionLinkId) {
        // initialize iLightBox
        // see comments above that explain why we do this in a timeout - similar reason here
        setTimeout(function() {
            initILightBox();
            resizeImages();
        }, 1000);
    }

    if (sectionLinkID === adminSectionLinkId) {
        var colorPickerDiv = document.getElementById('color-picker');
        if (!IsNullOrUndefined(colorPickerDiv)) {
            ColorPicker(
                document.getElementById('color-picker'),
                function (hex, hsv, rgb) {
                    latestSelectedHexColor = hex.toUpperCase();
                    $('#colorDisplayDiv').css('background-color', hex);
                    $('#selectedHexColor').text(hex.toUpperCase());
                });
        }
    }
}

/// <summary>
/// Attempts to highlight source code snippets with the SyntaxHighlighter plugin.
/// </summary>
function highlightSourceCode() {
    SyntaxHighlighter.highlight();
}

/// <summary>
/// Initializes the Disqus comment count links present on the home page
/// </summary>
function initDisqusCommentCounts() {
    // by setting window.DISQUSWIDGETS to undefined, we force it to always reload the counts
    window.DISQUSWIDGETS = undefined;
    $.getScript('http://' + disqus_shortname + '.disqus.com/count.js');
}

/// <summary>
/// Initializes the Disqus comments div for a specific blog post.
/// </summary>
/// <param name="blogUniqueIdentifier">The unique identifier of the blog to load the Disqus comments div for.</param>
/// <param name="blogTitle">The title of the blog to load the Disqus comments div for.</param>
/// <param name="blogUrl">The URL of the blog to load the Disqus comments div for.</param>
function initializeDisqusCommentDiv(blogUniqueIdentifier, blogTitle, blogUrl) {
    DISQUS.reset({
        reload: true,
        config: function() {
            this.page.identifier = blogUniqueIdentifier;
            this.page.url = blogUrl;
            this.page.title = blogTitle;
        }
    });
}

/// <summary>
/// Initializes the iLightBox plugin.
/// </summary>
function initILightBox() {
    var isMobile = IsMobileViewPort();

    $('.ilightbox').iLightBox({
        skin: 'dark',
        infinite: true,
        fullViewPort: 'fit',
        innerToolbar: !isMobile,
        controls: {
            arrows: true,
            slideshow: true
        },
        social: {
            buttons: {
                facebook: true,
                twitter: true,
                googleplus: true
            }
        }
    });
}

/// <summary>
/// Resizes any and all images on the page to fit.
/// </summary>
function resizeImages() {
    var contentWidth = $('#contentBox').width();
    var desiredPhotoWidth = contentWidth * 0.95;

    // size and scale the images to fit
    $('.scalableThumbnail').each(function () {
        var currentHeight = $(this).attr('data-thumb-height');
        var currentWidth = $(this).attr('data-thumb-width');

        // we don't care about height - we are scaling to fit width, so set this to a stupidly high number
        var maximumHeight = 100000;
        var newSizes = DetermineScaledDimensions(currentHeight, currentWidth, maximumHeight, desiredPhotoWidth);
        var newHeight = newSizes[0];
        var newWidth = newSizes[1];

        $(this).width(newWidth);
        $(this).height(newHeight);
    });
}

/// <summary>
/// Formats a pipe-delimited string (such as tag1|tag2|tag3) into an array of items.
/// </summary>
/// <param name="tagString">The pipe-delimited string to parse.</param>
/// <returns>The fully parsed array.</returns>
function buildTagArrayFromString(tagString) {
    var tagArray = [];
    if (tagString) {
        var tempArray = tagString.split("|");
        for (var i = 0; i < tempArray.length; i++) {
            var tag = tempArray[i].toLowerCase();
            tagArray.push(tag);
        }
    }

    return tagArray;
}

/// <summary>
/// Builds a pipe-delimited string (such as tag1|tag2|tag3) from an array of items.
/// </summary>
/// <param name="tags">The array to build into the string.</param>
/// <returns>The delimited string.</returns>
function buildDelimitedStringFromTagArray(tags) {
    return tags.join("|");
}

/// <summary>
/// Formats a string in the format "YYYY-MM" to a format of "MONTH NAME YYYY".
/// Turns "2015-04" into "April 2015".
/// </summary>
/// <param name="message">The date string in the format 'YYYY-MM' to be formatted.</param>
/// <returns>The formatted date string.</returns>
function formatMonthString(monthString) {
    var year = monthString.substring(0, 4);
    var month = monthString.substring(5,7);
    var displayMonth = '';

    switch (month)
    {
        case '01':
        {
            displayMonth = 'January';
            break;
        }
        case '02':
        {
            displayMonth = 'February';
            break;
        }
        case '03':
        {
            displayMonth = 'March';
            break;
        }
        case '04':
        {
            displayMonth = 'April';
            break;
        }
        case '05':
        {
            displayMonth = 'May';
            break;
        }
        case '06':
        {
            displayMonth = 'June';
            break;
        }
        case '07':
        {
            displayMonth = 'July';
            break;
        }
        case '08':
        {
            displayMonth = 'August';
            break;
        }
        case '09':
        {
            displayMonth = 'September';
            break;
        }
        case '10':
        {
            displayMonth = 'October';
            break;
        }
        case '11':
        {
            displayMonth = 'November';
            break;
        }
        case '12':
        {
            displayMonth = 'December';
            break;
        }
        default:
        {
            displayMonth = 'UNKNOWN';
            break;
        }
    }

    return displayMonth + ' ' + year;
}

/// <summary>
/// Strips out invalid HTML characters from the blog title, which is used in the link URL.
/// </summary>
/// <param name="currentTitle">The blog title to be encoded.</param>
/// <returns>The encoded string of the blog title.</returns>
/// <remarks>
/// Encodes 'C#' and 'c#' to 'csharp'.
/// Encodes 'F#' and 'f#' to 'fsharp'.
/// </remarks>
function encodeSpecialCharactersInBlogTitle(currentTitle) {
    return currentTitle
        .replace(/C#/g, 'csharp')
        .replace(/c#/g, 'csharp')
        .replace(/F#/g, 'fsharp')
        .replace(/f#/g, 'fsharp');
}

/// <summary>
/// Decodes a string encoded by the "encodeSpecialCharactersInBlogTitle" function above.
/// </summary>
/// <param name="encodedTitle">The blog title to be decoded.</param>
/// <returns>The decoded string of the blog title.</returns>
/// <remarks>
/// Decodes 'csharp' to 'C#'.
/// Decodes 'fsharp' to 'F#'.
/// </remarks>
function decodeSpecialCharactersInBlogTitle(encodedTitle) {
    return encodedTitle
        .replace(/csharp/g, 'C#')
        .replace(/csharp/g, 'F#');
}

/// <summary>
/// Logs a message to the console if the 'shouldLogToConsole' local variable is equal to true.
/// </summary>
/// <param name="message">The message to be logged.</param>
function LogToConsole(message) {
    if (shouldLogToConsole === true) {
        console.log(message);
    }
}

/// <summary>
/// Determines the available viewport width.
/// </summary>
/// <returns>The available width of the viewport.</returns>
function GetViewPortWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

/// <summary>
/// Determines the available viewport height.
/// </summary>
/// <returns>The available height of the viewport.</returns>
function GetViewPortHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

/// <summary>
/// Determines if the object value is null or undefined.
/// </summary>
/// <param name="obj">The object to be evaluated.</param>
/// <returns>True if the object is null or undefined, otherwise false.</returns>
function IsNullOrUndefined(obj) {
    return typeof (obj) === 'undefined' || obj === null;
}

/// <summary>
/// Determines if an object is a number.
/// </summary>
/// <param name="numberToCheck">The object to be evaluated.</param>
/// <returns>True if the object is a number, otherwise false.</returns>
function IsNumber(numberToCheck) {
    return !isNaN(parseFloat(numberToCheck)) && isFinite(numberToCheck);
}

/// <summary>
/// Determines if an object is a number.
/// </summary>
/// <returns>True if the viewport is 'mobile' width, otherwise false.</returns>
function IsMobileViewPort() {

    var viewportWidth = GetViewPortWidth();
    return viewportWidth < bootstrap_grid_float_breakpoint_pixel_value;
}

/// <summary>
/// Scales a picture to be shown in a section of a web page.
/// </summary>
/// <param name="imageHeight">The current height of the image.</param>
/// <param name="imageWidth">The current width of the image</param>
/// <param name="maxHeight">The desired maximum allowed height of the image once scaled.</param>
/// <param name="maxWidth">The desired maximum allowed width of the image once scaled.</param>
/// <returns>An array of integers where the first item is the new scaled height, and the second item is the new scaled width.</returns>
function DetermineScaledDimensions(imageHeight, imageWidth, maxHeight, maxWidth) {

    LogToConsole("DetermineScaledDimensions:");
    LogToConsole("DetermineScaledDimensions - imageHeight: " + imageHeight);
    LogToConsole("DetermineScaledDimensions - imageWidth: " + imageWidth);
    LogToConsole("DetermineScaledDimensions - maxHeight: " + maxHeight);
    LogToConsole("DetermineScaledDimensions - maxWidth: " + maxWidth);

    var returnSizes = [];

    // first figure out if we even have to do anything
    if ((imageHeight <= maxHeight) && (imageWidth <= maxWidth)) {
        returnSizes.push(imageHeight);
        returnSizes.push(imageWidth);
        return returnSizes;
    }

    var newHeight;
    var newWidth;
    var percentageDiff;

    // if only ONE size (H or W) is bigger than the max, we use that for the scale
    var isHeightBiggerThanMax = imageHeight > maxHeight;

    if (!isHeightBiggerThanMax) {
        // we need to start with the width instead
        newWidth = DetermineNewSize(imageWidth, maxWidth);
        percentageDiff = (newWidth / imageWidth) * 100;

        // we know the width matches now, we just need to figure out the height
        newHeight = imageHeight * (percentageDiff / 100);
        if (newHeight > maxHeight) {
            var tempNewHeight = DetermineNewSize(newHeight, maxHeight);
            var heightPercentageDiff = (tempNewHeight / newHeight) * 100;

            // assign tempNewHeight to newHeight
            newHeight = tempNewHeight;
            newWidth = newWidth * (heightPercentageDiff / 100);
        }
    }
    else {
        // we know that the height is bigger than the max, so we can just start with that
        newHeight = DetermineNewSize(imageHeight, maxHeight);
        percentageDiff = (newHeight / imageHeight) * 100;

        // we know the height matches now, we just need to figure out the width
        newWidth = imageWidth * (percentageDiff / 100);
        if (newWidth > maxWidth) {
            var tempNewWidth = DetermineNewSize(newWidth, maxWidth);
            var widthPercentageDiff = (tempNewWidth / newWidth) * 100;

            // assign tempNewWidth to newWidth
            newWidth = tempNewWidth;
            newHeight = newHeight * (widthPercentageDiff / 100);
        }
    }

    LogToConsole("DetermineScaledDimensions - newHeight: " + maxHeight);
    LogToConsole("DetermineScaledDimensions - newWidth: " + maxWidth);

    returnSizes.push(newHeight);
    returnSizes.push(newWidth);

    return returnSizes;
}

/// <summary>
/// Determines a new size by shrinking the current size below a given maximum size.
/// </summary>
/// <param name="currentSize">The current size.</param>
/// <param name="maxSize">The maximum size.</param>
/// <returns>The new smaller size.</returns>
function DetermineNewSize(currentSize, maxSize) {
    if (currentSize <= maxSize) {
        return currentSize;
    }

    // the current size is bigger than the max size
    var newSize;
    var counter = 99;
    while (true) {
        if (counter <= 1) {
            break;
        }

        newSize = currentSize * (counter / 100);
        if (newSize <= maxSize) {
            break;
        }

        counter = counter - 1;
    }

    return newSize;
}

/// <summary>
/// Creates a new CacheContainer object used to store simple cache arrays in memory.
/// </summary>
/// <param name="cacheLength">The age of the cache, in milliseconds.</param>
/// <returns>A new CacheContainer object.</returns>
function CacheContainer(cacheLength) {
    this.updatedOn = new Date();
    this.cachedData = [];
    this.cacheLengthInMs = cacheLength;
    this.isValid = function() {
        if (this.cachedData.length === 0) {
            return false;
        }

        var diffInMilliSeconds = Math.floor((new Date() - this.updatedOn));
        if (diffInMilliSeconds > this.cacheLengthInMs) {
            // clear array
            this.cachedData = [];
            return false;
        }

        return true;
    };

    this.assignData = function(newData) {
        this.updatedOn = new Date();
        this.cachedData = newData;
    };

    this.clearCache = function() {
        this.cachedData = [];
    };

    return this;
}