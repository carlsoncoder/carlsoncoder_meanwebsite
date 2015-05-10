'use strict';

function AWSFileInfo(key, url) {
    this.key = key;
    this.url = url;

    this.thumbnailUrl = '';
    this.thumbnailHeight = '';
    this.thumbnailWidth = '';

    this.name = '';
    this.caption = '';
    this.description = '';
    this.category = '';
    this.height = '';
    this.width = '';
}

AWSFileInfo.prototype.setMetadata = function(metadata) {
    this.name = metadata.filename;
    this.caption = metadata.caption;
    this.description = metadata.description;
    this.category = metadata.category;
    this.height = metadata.height;
    this.width = metadata.width;
};

module.exports = AWSFileInfo;