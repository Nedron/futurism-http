'use strict';

var _ = require('lodash');
var Lobby = require('../shared/models/Lobby');

var defaultOptions = {
    _id: 'Default',
    server: 1,
    open: true,
    date: new Date(),
    minFame: 0,
    minElo: 0
};


var createLobby = function(options) {
    _.defaults(options, defaultOptions);
    Lobby.findByIdAndUpdate(options._id, options, {upsert: true});
};


var createDefaultLobbies = function() {

    createLobby({
        _id: 'Time Tourists',
        server: 1,
        open: true,
        date: new Date(),
        minFame: 0
    });

    createLobby({
        _id: 'Time Travelers',
        server: 1,
        open: true,
        date: new Date(),
        minFame: 10
    });

    createLobby({
        _id: 'Time Masters',
        server: 1,
        open: true,
        date: new Date(),
        minFame: 20
    });
};

module.exports = createDefaultLobbies;