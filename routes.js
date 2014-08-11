'use strict';

module.exports = function(expr) {

    var lobbies = require('./routes/lobbies');
    var servers = require('./routes/servers');
    var progress = require('./routes/progress');
    var futures = require('./routes/futures');

    var continueSession = require('./middleware/continueSession');
    var checkLogin = require('./middleware/checkLogin');
    var loadProgress = require('./middleware/loadProgress');
    var loadMyProgress = require('./middleware/loadMyProgress');

    require('./routes/cards').init(expr);
    require('./routes/cardsPost').init(expr);
    require('./routes/decks').init(expr);
    require('./routes/favoriteCards').init(expr);
    require('./routes/favoriteDecks').init(expr);
    require('./routes/records').init(expr);
    
    expr.put('/api/users/:userId/futures/:futureId', continueSession, checkLogin, loadMyProgress('futures fractures'), futures.put);
    expr.get('/api/users/:userId/futures', loadProgress({}, 'futures fractures'), futures.getList);

    expr.get('/api/lobbies', continueSession, lobbies.getList);
    expr.get('/api/lobbies/:lobbyId', continueSession, lobbies.get);
    expr.post('/api/lobbies', continueSession, lobbies.post);

    expr.get('/api/servers', servers.get);

    expr.post('/api/progress', continueSession, checkLogin, progress.post);
    expr.get('/api/progress/:userId', progress.get);

    expr.get('/api/summaries/:gameId', require('./routes/summariesGet'));

    expr.get('/api/ip-test', require('./routes/ipTest').get);

    // alternate: '!\\.html|\\.js|\\.css|\\.swf|\\.json|\\.mp3|\\.ogg|\\.png|\\.jpg$'
    expr.get(/^(?!\/api)((?!\.).)*$/i, require('./routes/indexGet')); //--- this ridiculous regex matches any string that does not start with '/api' and does not contain a period.

};