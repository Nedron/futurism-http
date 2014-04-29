'use strict';

var _ = require('lodash');
var Lobby = require('../shared/models/Lobby');

var defaultOptions = {
    _id: 'Default',
    server: 1,
    open: true,
    date: new Date(),
    minRank: 0,
    minElo: 0
};


var createLobby = function(options) {
    _.defaults(options, defaultOptions);
    var _id = options._id;
    delete options._id;
    Lobby.findByIdAndUpdate(_id, options, {upsert: true}, function(err) {
        if(err) {
            console.log('createDefaultLobby err', err);
        }
    });
};


var createDefaultLobbies = function() {

    createLobby({
        _id: 'Brutus',
        server: 1,
        open: true,
        date: new Date(),
        minElo: 0
    });


    createLobby({
        _id: 'Masters',
        server: 1,
        open: true,
        date: new Date(),
        minElo: 0
    });
};

module.exports = createDefaultLobbies;