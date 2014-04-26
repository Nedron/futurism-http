'use strict';

var _ = require('lodash');
var Lobby = require('../shared/models/Lobby');
var serverFns = require('../fns/serverFns');


module.exports = {


    getList: function(req, res) {
        Lobby.find({$or: [
            {_id: req.session.guild},
            {open: true}
        ]}, {}, {lean: true}, function(err, lobbies) {
            if(err) {
                return res.apiOut(err);
            }

            _.each(lobbies, function(lobby) {
                if(!lobby.server || !serverFns.isServerId(lobby.server)) {
                    lobby.server = serverFns.nextServerId();
                    Lobby.findByIdAndUpdate(lobby._id, _.omit(lobby, '_id'), {upsert: true});
                }
            });

            return res.apiOut(null, lobbies);
        });
    },


    get: function(req, res) {
        Lobby.findById(req.params.lobbyId, res.apiOut);
    },


    post: function(req, res) {
        var guildId = req.session.guild;
        if(!guildId) {
            return res.apiOut('no guildId in session');
        }

        return Lobby.create({
            _id: guildId,
            open: false,
            server: serverFns.nextServerId(),
            date: new Date(),
            minElo: 0
        }, res.apiOut);
    }
};