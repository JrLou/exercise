var strictMode = function () {
    "use strict";
    return !this;
};
var noStrict = function () {
    return !!this;
};
var checkIE = {
    isIE: function () {
        return ("ActiveXObject" in window);
    }, isIE6: function () {
        return this.isIE() && !window.XMLHttpRequest;
    }, isIE7: function () {
        return this.isIE() && window.XMLHttpRequest && document.documentMode == 7;
    }, isIE8: function () {
        return this.isIE() && !-[1,] && document.documentMode == 8;
    }, isIE9: function () {
        return !strictMode() && noStrict() && !!window.addEventListener && this.isIE();
    }, isIE10: function () {
        return strictMode() && noStrict() && !!window.attachEvent && this.isIE();
    }, isIE11: function () {
        return !window.attachEvent && window.addEventListener && this.isIE();
    }
};