'use strict';

var _ = require('lodash');


module.exports = {
    
    
    paginate: function(arr, opts) {
        
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
    },
    
    
    add: function(model, field, value, callback) {

        var arr = [];
        if(model[field]) {
            arr = model.toObject()[field];
        }
        
        if(!value) {
            return callback('no ' + value + ' id');
        }
        if(arr.length > 99) {
            return callback('You can only save 99 favorite decks');
        }

        arr.push(value);
        arr = _.unique(arr);

        model[field] = arr;
        model.save(function(err) {
            if(err) {
                return callback(err);
            }
            return callback(null, value);
        });
    },
    
    
    remove: function(model, field, value, callback) {
        
        var arr = model[field].toObject();
        _.remove(arr, function(id) {
            return String(id) === String(value);
        });
        
        model[field] = arr;
        model.save(function(err) {
            if(err) {
                return callback(err);
            }
            return callback(null, null);
        });
    }
            
};