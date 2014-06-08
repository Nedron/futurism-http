(function() {
    
    'use strict';
    
    var async = require('async');
    var arrayFns = require('../fns/arrayFns');
    var loadProgress = require('../middleware/loadProgress');
    var Deck = require('../shared/models/Deck');
    
    
    var self = {
        
        init: function(app) {
            app.get('/api/user/:userId/favorite-decks', loadProgress(), self.getList);
            app.put('/api/user/:userId/favorite-decks/:deckId', loadProgress(), self.put);
            app.del('/api/user/:userId/favorite-decks/:deckId', loadProgress(), self.del);
        },
        
        
        getList: function(req, res) {
            var reply = arrayFns.paginate(req.progress.favDecks, req.body);
            async.map(reply.results, Deck.findById.bind(Deck), function(err, decks) {
                reply.results = decks;
                res.apiOut(err, reply);
            });
        },
        
        
        put: function(req, res) {
            Deck.findById(req.params.deckId, function(err, deck) {
                if(err) {
                    return res.apiOut(err);
                }
                if(!deck) {
                    return res.apiOut('deck not found');
                }
                if(!deck.share) {
                    return res.apiOut('deck can not be favorited');
                }
                
                arrayFns.add(req.progress, 'favDecks', req.params.deckId, res.apiOut);
            });
        },
        
        
        del: function(req, res) {
            arrayFns.remove(req.progress, 'favDecks', req.params.deckId, res.apiOut);
        }
    };
    
    module.exports = self;
    
}());