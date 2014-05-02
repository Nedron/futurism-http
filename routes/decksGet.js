(function() {
    'use strict';

    var Deck = require('../shared/models/Deck');


    var replyWithDeck = function(req, res) {
        var deckId = req.body.deckId;
        var userId = req.session._id;

        Deck.findOne({_id:deckId, userId:userId})
            .populate('cards')
            .exec(function(err, result) {
                return res.apiOut(err, result);
            });
    };


    var replyWidthList = function(req, res) {
        var userId = req.session._id;
        var canon = req.body.canon || false;
        
        var query = {userId: userId};
        if(canon) {
            query = {$or: [{userId: userId}, {canon: true}]};
        }

        Deck.find(query)
            .exec(function(err, result) {
                return res.apiOut(err, result);
            });
        
        /*var userId = req.params.userId || req.session._id;
        var canon = req.body.canon || false;
        var page = req.body.page || 1;
        var count = 10;

        var query = {userId: userId};
        if(canon) {
            query = {$or: [{userId: userId}, {canon: true}]};
        }

        paginate(Card, query, page, count, function(err, pageCount, results) {
            return res.apiOut(err, {pageCount: pageCount, results: results, page: page});
        }, {sortBy: {updated:-1}});*/
    };


    /**
     * Return a deck or a list of decks
     * @checkAuth
     * @body {string} [deckId]
     */
    module.exports = function(req, res) {
        if(req.body && req.body.deckId) {
            replyWithDeck(req, res);
        }
        else {
            replyWidthList(req, res);
        }
    };


}());