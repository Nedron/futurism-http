module.exports = function(arr, opts) {
    'use strict';
    
    arr = arr || [];
    var page = opts.page || 1;
    var count = opts.count || 10;
    var index = (page - 1) * count;
    var reply = {
        page: page,
        pageCount: Math.ceil(arr.length / count),
        results: arr.splice(index, count)
    };
    
    return reply;
            
};