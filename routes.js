'use strict';

module.exports = function(expr) {

    var lobbies = require('./routes/lobbies');
    var servers = require('./routes/servers');
    var stats = require('./routes/stats');
    var futures = require('./routes/futures');

    var continueSession = require('./middleware/continueSession');
    var checkLogin = require('./middleware/checkLogin');
    var loadStats = require('./middleware/loadStats');
    var loadMyStats = require('./middleware/loadMyStats');

    require('./routes/cards').init(expr);
    require('./routes/cardsPost').init(expr);

    expr.delete('/api/decks', continueSession, checkLogin, require('./routes/decksDelete'));
    expr.get('/api/decks', continueSession, checkLogin, require('./routes/decksGet'));
    expr.post('/api/decks', continueSession, checkLogin, require('./routes/decksPost'));
    
    expr.put('/api/users/:userId/futures/:futureId', continueSession, checkLogin, loadMyStats('futures fractures'), futures.put);
    expr.get('/api/users/:userId/futures', loadStats({}, 'futures fractures'), futures.getList);

    expr.get('/api/lobbies', continueSession, lobbies.getList);
    expr.get('/api/lobbies/:lobbyId', continueSession, lobbies.get);
    expr.post('/api/lobbies', continueSession, lobbies.post);

    expr.get('/api/records/:gameId', continueSession, require('./routes/recordsGet'));
    expr.get('/api/servers', servers.get);

    expr.post('/api/stats', continueSession, checkLogin, stats.post);
    expr.get('/api/stats/:userId', stats.get);

    expr.get('/api/summaries/:gameId', require('./routes/summariesGet'));

    expr.get('/api/ip-test', require('./routes/ipTest').get);

    // alternate: '!\\.html|\\.js|\\.css|\\.swf|\\.json|\\.mp3|\\.ogg|\\.png|\\.jpg$'
    expr.get(/^(?!\/api)((?!\.).)*$/i, require('./routes/indexGet')); //--- this ridiculous regex matches any string that does not start with '/api' and does not contain a period.

};