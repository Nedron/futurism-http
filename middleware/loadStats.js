'use strict';

var Stats = require('../shared/models/Stats');
var _ = require('lodash');

module.exports = function(query, fields) {
	query = query || {};
	fields = fields || {};

	return function(req, res, next) {

		query._id = query._id || req.param('userId');
        
        if(_.size(query) === 0) {
            return res.apiOut('loadStats: no query or userId found');
        }

		Stats.findOne(query, fields, function(err, stats) {
			if(err) {
				return res.apiOut(err);
			}
			if(!stats) {
				return res.send(404, 'Stats not found');
			}

			req.stats = stats;
			return next();
		});
	};
};