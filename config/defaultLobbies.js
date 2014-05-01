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
        _id: 'Travelers',
        server: 1,
        open: true,
        date: new Date(),
        minFame: 0
    });

    createLobby({
        _id: 'Adventurers',
        server: 1,
        open: true,
        date: new Date(),
        minFame: 10
    });

    createLobby({
        _id: 'Masters',
        server: 1,
        open: true,
        date: new Date(),
        minFame: 20
    });
};

module.exports = createDefaultLobbies;