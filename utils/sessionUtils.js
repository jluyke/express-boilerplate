var models  = require('./../models');

this.isLoggedIn = function(req) {
    return req.cookies.sessionId;
};

this.getDefaultExpiresAt = function() {
    var date = new Date();
    var days = 1;
    date.setDate(date.getDate() + days);
    return date;
};
