(function() {
    
    'use strict';
    
    var async = require('async');
    var arrayFns = require('../fns/arrayFns');
    var loadStats = require('../middleware/loadStats');
    var Deck = require('../shared/models/Deck');
    
    
    var self = {
        
        init: function(app) {
            app.get('/api/user/:userId/favorite-decks', loadStats(), self.getList);
            app.put('/api/user/:userId/favorite-decks/:deckId', loadStats(), self.put);
            app.del('/api/user/:userId/favorite-decks/:deckId', loadStats(), self.del);
        },
        
        
        getList: function(req, res) {
            var reply = arrayFns.paginate(req.stats.favDecks, req.body);
            async.map(reply.results, Deck.findById.bind(Deck), function(err, decks) {
                reply.results = decks;
                res.apiOut(err, reply);
            });
        },
        
        
        put: function(req, res) {
            arrayFns.add(req.stats, 'favDecks', req.params.deckId, res.apiOut);
        },
        
        
        del: function(req, res) {
            arrayFns.remove(req.stats, 'favDecks', req.params.deckId, res.apiOut);
        }
    };
    
    module.exports = self;
    
}());