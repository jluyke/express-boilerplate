var crypto = require('crypto');

this.generateId = function() {
    return this.generateRandom(32);
};

this.generateRandom = function(length) {
    return crypto.randomBytes(length)
        .toString('hex');
};
