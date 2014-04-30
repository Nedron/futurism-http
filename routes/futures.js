'use strict';

var _ = require('lodash');
var futures = require('../shared/futures');


var isValidFuture = function(future) {
    return _.toArray(futures).indexOf(future) !== -1;
};


var userOwnsFuture = function(stats, future) {
    return stats.futures.indexOf(future) !== -1;
};


var futureCost = function(stats, future) {
    if(userOwnsFuture(stats, future)) {
        return 0;
    }
    return stats.futures.length + 1;
};


module.exports = {
    
    
    getList: function(req, res) {
        var stats = req.stats;
        return res.apiOut(null, stats.futures);
    },
    
    
    put: function(req, res) {
        var future = req.params.futureId;
        var myStats = req.stats;
        var cost = futureCost(myStats, future);
        
        if(!isValidFuture(future)) {
            return res.apiOut('Invalid future');
        }
        if(userOwnsFuture(myStats, future)) {
            return res.apiOut('You already own this future');
        }
        if(cost > myStats.fractures) {
            return res.apiOut(cost-myStats.fractures + ' more fracture(s) are needed to unlock this future');
        }
        
        myStats.fractures -= cost;
        myStats.futures.push(future);
        
        myStats.save(res.apiOut);
    }

};

