(function() {
    'use strict';

    var _ = require('lodash');
    var Deck = require('../shared/models/Deck');
    var createHashId = require('../fns/createHashId');
    var paginate = require('../fns/paginate');
    var continueSession = require('../middleware/continueSession');
    var checkLogin = require('../middleware/checkLogin');
    
    
    var self = {
        
        init: function(app) {
            app.get('/api/decks', self.getPublicList);
            app.get('/api/user/:userId/decks/:deckId', continueSession, checkLogin, self.get);
            app.get('/api/user/:userId/decks', continueSession, checkLogin, self.getList);
            app.post('/api/user/:userId/decks', continueSession, checkLogin, self.post);
            app.delete('/api/user/:userId/decks/:deckId', continueSession, checkLogin, self.del);
        },
        
        
        /**
         * Get a list of shared decks
         */
        getPublicList: function(req, res) {
            var sort = req.body.sort || {hot: -1};
            var maxCards = req.body.maxCards || 20;
            var minCards = maxCards - 5;
            
            var options = {
                model: Deck,
                find: {$and: [
                    {'cards.length': {$gte: minCards}},
                    {'cards.length': {$lte: maxCards}}
                ]},
                sort: sort,
                allowFindBy: false,
                allowSortBy: ['hot']
            };
            
            options.find = {share: true};
            
            paginate(options, res.apiOut);
        },
        
        
        /**
         * Get a list of your decks
         */
        getList: function(req, res) {
            var options = {
                model: Deck,
                find: {userId: req.session._id},
                allowFindBy: ['userId']
            };
            
            paginate(options, res.apiOut);
        },
        
        
        /**
         * Get a deck if you own it or it is shared
         */
        get: function(req, res) {
            var deckId = req.params.deckId;

            Deck.findById(deckId)
                .populate('cards')
                .exec(function(err, deck) {
                    if(err) {
                        return res.apiOut(err);
                    }
                    if(!deck) {
                        return res.send(404, 'Deck not found');
                    }
                    if(!deck.share && String(deck.userId) !== String(req.session._id)) {
                        return res.apiOut('You are not the owner of this deck, and this deck is not shared');
                    }
                    return res.apiOut(err, deck);
                });
        },
        
        
        /**
         * Save a deck
         * @body {string} name
         * @body {string[]} cards
         * @body {number} pride
         */
        post: function(req, res) {

            // bring in user input
            var deck = _.pick(req.body, 'name', 'cards', 'pride', 'share');

            // server defined properties
            deck._id = createHashId(req.session._id + '-' + deck.name, 16);
            deck.userId = req.session._id;

            // save deck to db
            Deck.findByIdAndSave(deck, res.apiOut);
        },
        
        
        /**
         * Delete a deck owned by the user
         * @checkAuth
         * @body {string} deckId
         */
        del: function(req, res) {
            var deckId = req.params.deckId;
            var userId = req.session._id;
            Deck.findOneAndRemove({_id: deckId, userId: userId}, function(err, result) {
                return res.apiOut(err, result);
            });
        }
    };
    
    module.exports = self;

}());