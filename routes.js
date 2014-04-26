'use strict';

module.exports = function(expr) {

    var lobbies = require('./routes/lobbies');
    var cards = require('./routes/cards');
    var servers = require('./routes/servers');
    var stats = require('./routes/stats');
    var futures = require('./routes/futures');

    var continueSession = require('./middleware/continueSession');
    var checkLogin = require('./middleware/checkLogin');
    var checkMod = require('./middleware/checkMod');
    var loadStats = require('./middleware/loadStats');
    var loadMyStats = require('./middleware/loadMyStats');

    expr.put('/api/cards/:userId/:cardId/cannon', continueSession, checkMod, cards.putCanon);
    expr.del('/api/cards/:userId/:cardId', continueSession, checkLogin, cards.del);
    expr.get('/api/cards/:userId/:cardId', continueSession, checkLogin, cards.get);
    expr.post('/api/cards/:userId/:cardId', continueSession, checkLogin, cards.edit);
    expr.get('/api/cards/:userId', continueSession, checkLogin, cards.getList);
    expr.post('/api/cards/:userId', continueSession, checkLogin, require('./routes/cardsPost'));

    expr.delete('/api/decks', continueSession, checkLogin, require('./routes/decksDelete'));
    expr.get('/api/decks', continueSession, checkLogin, require('./routes/decksGet'));
    expr.post('/api/decks', continueSession, checkLogin, require('./routes/decksPost'));
    
    expr.put('/api/user/:userId/futures/:futureId', continueSession, loadMyStats('futures fractures'), futures.put);
    expr.get('/api/user/:userId/futures', loadStats({}, 'futures fractures'), futures.getList());

    expr.get('/api/lobbies', continueSession, lobbies.getList);
    expr.get('/api/lobbies/:lobbyId', continueSession, lobbies.get);
    expr.post('/api/lobbies', continueSession, lobbies.post);

    expr.get('/api/records/:gameId', continueSession, require('./routes/recordsGet'));
    expr.get('/api/servers', servers.get);

    expr.post('/api/stats', continueSession, checkLogin, stats.post);
    expr.get('/api/stats/:userId', stats.get);

    expr.get('/api/summaries/:gameId', require('./routes/summariesGet'));

    expr.get('/api/tests', continueSession, require('./routes/testsGet'));

    // alternate: '!\\.html|\\.js|\\.css|\\.swf|\\.json|\\.mp3|\\.ogg|\\.png|\\.jpg$'
    expr.get(/^(?!\/api)((?!\.).)*$/i, require('./routes/indexGet')); //--- this ridiculous regex matches any string that does not start with '/api' and does not contain a period.

};