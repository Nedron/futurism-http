(function() {
    
    'use strict';
    
    var loadStats = require('../middleware/loadStats');
    
    
    var self = {
        
        init: function(app) {
            app.get('/api/user/:userId/favorite-decks', loadStats(), self.getList);
        },
        
        
        getList: function(req, res) {
            var favCards = req.stats.favCards || [];
            var page = req.body.page || 1;
            var count = req.body.count || 10;
            var index = (page - 1) * count;
            var reply = {
                page: page,
                pageCount: Math.ceil(favCards.length / count),
                results: favCards.splice(index, count)
            };
            res.apiOut(null, reply);
        }
    };
    
    module.exports = self;
    
}());