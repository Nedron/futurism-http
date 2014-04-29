/**
 * These are env variables that will need to be set
 * Rename this file env.js
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env.MONGO_URI = 'mongodb://user:pass@host.com:port/futurism-development';
process.env.REDIS_URI = 'redis://user:pass@host.com:port/';

process.env.GLOBE_URI = 'http://localhost:9001';
process.env.GLOBE_KEY = '123';

process.env.S3_BUCKET = 'awesome-bucket';
process.env.S3_KEY = '';
process.env.S3_SECRET_KEY = '';