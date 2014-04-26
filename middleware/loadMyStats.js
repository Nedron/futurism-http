'use strict';

var loadStats = require('./loadStats');

module.exports = function(fields) {
	fields = fields || {};

	return function(req, res, next) {
        var query = {_id: req.session._id};
		loadStats(query, fields)(req, res, next);
	};
};