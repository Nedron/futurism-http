'use strict';

module.exports = function(maxAge) {
    
    return function(req, res, next) {
        console.log('proxyifiyng and reques');
        res.setHeader('Cache-Control', 'public, max-age=' + (maxAge / 1000));
        next();
    }
};
