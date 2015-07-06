// this is just a default value
var selectedRGBString = '102,255,204';

var colorManager = {};

colorManager.setColor = function(hexColorCode, callback) {
    var hex = parseInt(hexColorCode.substring(1), 16);

    var r = hex >> 16;
    var g = hex >> 8 & 0xFF;
    var b = hex & 0xFF;

    var rgbString = r + ',' + g + ',' + b;

    selectedRGBString = rgbString;
    return callback();
};

colorManager.getSelectedColor = function(callback) {
    return callback('<' + selectedRGBString + '>');
};

module.exports = colorManager;