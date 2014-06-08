(function() {
    
    'use strict';
    
    var async = require('async');
    var loadProgress = require('../middleware/loadProgress');
    var arrayFns = require('../fns/arrayFns');
    var Card = require('../shared/models/Card');
    
    
    var self = {
        
        init: function(app) {
            app.put('/api/user/:userId/favorite-cards/:cardId', loadProgress(), self.put);
            app.get('/api/user/:userId/favorite-cards', loadProgress(), self.getList);
            app.del('/api/user/:userId/favorite-cards/:cardId', loadProgress(), self.del);
        },
        
        
        getList: function(req, res) {
            var reply = arrayFns.paginate(req.progress.favCards, req.body);
            async.map(reply.results, Card.findById.bind(Card), function(err, cards) {
                reply.results = cards;
                res.apiOut(err, reply);
            });
        },
        
        
        put: function(req, res) {
            Card.findById(req.params.cardId, function(err, card) {
                if(err) {
                    return res.apiOut(err);
                }
                if(!card) {
                    return res.apiOut('card not found');
                }
                if(!card.share) {
                    return res.apiOut('card can not be favorited');
                }
                
                arrayFns.add(req.progress, 'favCards', req.params.cardId, res.apiOut);
            });
        },
        
        
        del: function(req, res) {
            arrayFns.remove(req.progress, 'favCards', req.params.cardId, res.apiOut);
        }
    };
    
    module.exports = self;
    
}());