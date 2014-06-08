'use strict';

var Progress = require('../shared/models/Progress');


module.exports = {


    // create a new progress document if you don't have one
    post: function(req, res) {
        Progress.findByIdAndSave({_id: req.session._id}, function(err, progress) {
            if(err) {
                return res.apiOut(err);
            }
            res.apiOut(null, progress);
        });
    },


    // get a user's progress document
    get: function(req, res) {
        Progress.findById(req.params.userId, '_id updated futures fractures fame elo', function(err, progress) {
            if(err) {
                return res.apiOut(err);
            }
            if(!progress) {
                return res.apiOut({code: 404, message: 'Progress not found'});
            }
            res.apiOut(null, progress);
        });
    }

};