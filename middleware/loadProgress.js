'use strict';

var Progress = require('../shared/models/Progress');
var _ = require('lodash');

module.exports = function (query, fields) {
    query = query || {};
    fields = fields || {};

    return function (req, res, next) {

        query._id = query._id || req.param('userId');

        if (_.size(query) === 0) {
            return res.apiOut('loadProgress: no query or userId found');
        }

        Progress.findOne(query, fields, function (err, progress) {
            if (err) {
                return res.apiOut(err);
            }
            if (!progress) {
                return res.send(404, 'Progress not found');
            }

            req.progress = progress;
            return next();
        });
    };
};