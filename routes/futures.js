'use strict';

var _ = require('lodash');
var futures = require('../shared/futures');


var isValidFuture = function(future) {
    return _.toArray(futures).indexOf(future) !== -1;
};


var userOwnsFuture = function(user, future) {
    return user.futures.indexOf(future) !== -1;
};


var futureCost = function(user, future) {
    if(userOwnsFuture(user, future)) {
        return 0;
    }
    return user.futures.length + 1;
};


module.exports = {
    
    
    getList: function(req, res) {
        var user = req.user;
        return res.apiOut(null, user.futures);
    },
    
    
    put: function(req, res) {
        var future = req.params.future;
        var myself = req.myself;
        var cost = futureCost(myself, future);
        
        if(!isValidFuture(future)) {
            return res.apiOut('Invalid future');
        }
        if(userOwnsFuture(myself, future)) {
            return res.apiOut('You already own this future');
        }
        if(cost > myself.fractures) {
            return res.apiOut(cost-myself.fractures + ' more fracture(s) are needed to unlock this future');
        }
        
        myself.fractures -= cost;
        myself.futures.push(future);
        
        myself.save(res.apiOut);
    }

};

