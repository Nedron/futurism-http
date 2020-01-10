'use strict';

//--- initialize
require('./config/env.js');
var express = require('express');
var expr = express();
var httpServer = require('http').createServer(expr);


//--- settings
expr.enable('trust proxy');


//--- mongoose connect
var mongoose = require('mongoose');
require('./fns/mongoose/findByIdAndSave').attach(mongoose);
require('./fns/mongoose/findOneAndSave').attach(mongoose);
require('./fns/mongoose/validatedUpdate').attach(mongoose);
mongoose.connect(process.env.MONGO_URI);


//--- redis connect
var redisSession = require('./shared/redisSession');
redisSession.connect(process.env.REDIS_URI);


//--- create default lobbies
require('./config/defaultLobbies')();


//--- middleware
expr.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
}));

expr.use('/globe', require('./middleware/nocache'));
expr.use('/globe', require('./middleware/proxy')(process.env.GLOBE_URI));

expr.use('/storage', require('./middleware/cache')(1000 * 60 * 60 * 24));
expr.use('/storage', require('./middleware/proxy')('https://s3.amazonaws.com/'+process.env.S3_BUCKET, process.env.S3_BUCKET));

expr.use('/api', require('./middleware/nocache'));
expr.use('/api', require('./middleware/output'));
expr.use('/api', express.bodyParser());
expr.use('/api', require('./middleware/consolidateQuery'));

// todo: work more to replace bodyParser with these
/*expr.use('/api', express.urlencoded());
expr.use('/api', express.json());*/


//--- serve static files (more middleware, technically)
expr.use('/', express.static('client'));


//--- load routes
require('./routes')(expr);


//--- last ditch error handler
process.on('uncaughtException', function (err) {
    console.log('unhandled error', err, err.stack);
});


//--- listen for requests
var port = process.env.PORT || 9001;
console.log('NODE_ENV: ', process.env.NODE_ENV);
console.log('Listening on port ' + port);
httpServer.listen(port);

module.exports = expr;
