'use strict';

var _ = require('lodash');
var futures = require('../shared/futures');


var isValidFuture = function(future) {
    return _.toArray(futures).indexOf(future) !== -1;
};


var userOwnsFuture = function(progress, future) {
    return progress.futures.indexOf(future) !== -1;
};


var futureCost = function(progress, future) {
    if(userOwnsFuture(progress, future)) {
        return 0;
    }
    return progress.futures.length;
};


module.exports = {
    
    
    getList: function(req, res) {
        return res.apiOut(null, req.progress.futures);
    },
    
    
    put: function(req, res) {
        var future = req.params.futureId;
        var myProgress = req.progress;
        var cost = futureCost(myProgress, future);
        
        if(!isValidFuture(future)) {
            return res.apiOut('Invalid future');
        }
        if(userOwnsFuture(myProgress, future)) {
            return res.apiOut('You already own this future');
        }
        if(cost > myProgress.fractures) {
            return res.apiOut(cost-myProgress.fractures + ' more fracture(s) are needed to unlock this future');
        }
        
        myProgress.fractures -= cost;
        myProgress.futures.push(future);
        
        myProgress.save(res.apiOut);
    }

};

