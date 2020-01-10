process.env.NODE_ENV = 'development';
process.env.PORT = '9001';

process.env.MONGO_URI = 'mongodb://admin:pass@60.242.65.101:27018/database';
process.env.REDIS_URI = 'redis://admin:pass@60.242.65.101:6380/';

process.env.GLOBE_URI = 'http://60.242.65.101:9002/';
process.env.GLOBE_KEY = 'secret';

process.env.S3_BUCKET = 'awesome-bucket';
process.env.S3_KEY = '';
process.env.S3_SECRET_KEY = '';

process.env.GAME_SERVERS = 'http://60.242.65.101:9100/';