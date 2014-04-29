'use strict';

module.exports = function(maxAge) {
    
    return function(req, res, next) {
        res.setHeader('Cache-Control', 'public, max-age=' + (maxAge / 1000));
        next();
    }
};
