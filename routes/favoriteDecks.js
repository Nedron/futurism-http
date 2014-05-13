(function() {
    
    'use strict';
    
    var _ = require('lodash');
    var async = require('async');
    var paginateArray = require('../fns/paginateArray');
    var loadStats = require('../middleware/loadStats');
    var Deck = require('../shared/models/Deck');
    
    
    var self = {
        
        init: function(app) {
            app.get('/api/user/:userId/favorite-decks', loadStats(), self.getList);
            app.put('/api/user/:userId/favorite-decks/:deckId', loadStats(), self.put);
            app.del('/api/user/:userId/favorite-decks/:deckId', loadStats(), self.del);
        },
        
        
        getList: function(req, res) {
            var reply = paginateArray(req.stats.favDecks, req.body);
            async.map(reply.results, Deck.findById.bind(Deck), function(err, decks) {
                reply.results = decks;
                res.apiOut(err, reply);
            });
        },
        
        
        put: function(req, res) {
            var deckId = req.params.deckId;
            var favDecks = [];
            
            if(req.stats.favDecks) {
                favDecks = req.stats.toObject().favDecks;
            }
            
            if(!deckId) {
                return res.apiOut('no deckId');
            }
            
            favDecks.push(deckId);
            favDecks = _.unique(favDecks);
            
            if(favDecks.length > 99) {
                return res.apiOut('You can only save 99 favorite decks');
            }
            
            req.stats.favDecks = favDecks;
            req.stats.save(res.apiOut);
        },
        
        
        del: function(req, res) {
            var favDecks = req.stats.favDecks.toObject();
            _.remove(favDecks, function(deckId) {
                return String(deckId) === String(req.params.deckId);
            });
            req.stats.favDecks = favDecks;
            req.stats.save(res.apiOut);
        }
    };
    
    module.exports = self;
    
}());