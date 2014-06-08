'use strict';

var loadProgress = require('./loadProgress');

module.exports = function(fields) {
	fields = fields || {};

	return function(req, res, next) {
        var query = {_id: req.session._id};
		loadProgress(query, fields)(req, res, next);
	};
};