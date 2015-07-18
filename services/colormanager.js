// this is just a default value - it's overridden the first time a user selects a value
var selectedRGBString = '102,255,204';

var colorManager = {};

colorManager.setColor = function(rgbValues, callback) {
    var rgbString = rgbValues.r + ',' + rgbValues.g + ',' + rgbValues.b;

    selectedRGBString = rgbString;
    return callback();
};

colorManager.getSelectedColor = function(callback) {
    return callback('<' + selectedRGBString + '>');
};

module.exports = colorManager;