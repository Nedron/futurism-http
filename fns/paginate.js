(function() {

    'use strict';

    var _ = require('lodash');

    var defaultData = {
        page: 1,
        count: 10,
        find: {},
        sort: {_id: 1},
        maxPage: 50,
        minPage: 1,
        maxCount: 25,
        allowFindBy: [],
        allowSortBy: ['_id']
    };


    var paginate = function(data, callback) {

        // defaults
        _.defaults(data, defaultData);
        callback = callback || data.callback || function() {};

        
        // copy values that may change
        var find = data.find;
        var sort = data.sort;
        var page = data.page;
        var count = data.count;
        
        
        // parse json
        if(_.isString(data.find)) {
            find = JSON.parse(find);
        }
        if(_.isString(sort)) {
            sort = JSON.parse(sort);
        }


        // limit fields that can be filtered and sorted on
        if(data.allowFindBy) {
            find = _.pick(find, data.allowFindBy);
        }
        if(data.allowSortBy) {
            sort = _.pick(sort, data.allowSortBy);
        }


        // limit page range
        page = Math.max(page, data.minPage);
        page = Math.min(page, data.maxPage);


        // limit possible count range
        count = Math.max(count, 1);
        count = Math.min(count, data.maxCount);


        // query for the data
        data.model
            .find(find)
            .skip((page-1)*count)
            .limit(count)
            .sort(sort)
            .exec(function(err, results) {
                if(err) {
                    return callback(err);
                }

                // query for the number of pages
                data.model.count(find, function(err, totalItemCount) {
                    if(err) {
                        return callback(err);
                    }

                    // return the results
                    var pageCount = Math.ceil(totalItemCount / count) || 1;
                    return callback(null, {page: page, pageCount: pageCount, results: results});
                });
            });

    };

    module.exports = paginate;
    
}());