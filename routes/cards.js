(function() {

    'use strict';

    var _ = require('lodash');
    var async = require('async');
    var Card = require('../shared/models/Card');
    var createHashId = require('../fns/createHashId');
    var groups = require('../shared/groups');
    var globe = require('../shared/globe');
    var paginate = require('../fns/paginate');
    var continueSession = require('../middleware/continueSession');
    var checkLogin = require('../middleware/checkLogin');
    
    
    
    /**
     * Save an image to s3
     * @param {buffer} image
     * @param {string} imageId
     * @param {function} callback
     */
    var saveImage = function(image, imageId, callback) {
        var Imager = require('imager'),
            imagerConfig = require('../config/card-image-config.js'),
            imager = new Imager(imagerConfig, 'S3');

        image.name = imageId + '.jpg';
        image.type = 'image/jpg';
        imager.upload([image], callback, 'cardImage');
    };
    
    

    var self = {
        
        
        init: function(app) {
            app.get('/api/cards', self.getPublicList);
            app.post('/api/users/:userId/cards', continueSession, checkLogin, self.post);
            app.del('/api/users/:userId/cards/:cardId', continueSession, checkLogin, self.del);
            app.get('/api/users/:userId/cards/:cardId', continueSession, checkLogin, self.get);
            app.post('/api/users/:userId/cards/:cardId', continueSession, checkLogin, self.edit);
            app.get('/api/users/:userId/cards', continueSession, checkLogin, self.getList);
        },
        
        
         /**
         * Get a list of shared cards
         */
        getPublicList: function(req, res) {
            var sort = req.body.sort || {hot: -1};
            
            var options = {
                model: Card,
                find: {share: true},
                sort: sort,
                allowFindBy: ['share'],
                allowSortBy: ['hot']
            };
            
            paginate(options, res.apiOut);
        },
        
        
        
        /**
         * Save a card
         * image is stored on s3, if there is one
         * @body {string} name
         * @body {string} story
         * @body {string} faction
         * @body {string[]} abilities
         * @body {number} attack
         * @body {number} health
         */
        post: function(req, res) {

            var data = _.pick(req.body, 'name', 'story', 'faction', 'abilities', 'attack', 'health', 'share');

            data.userId = req.session._id;
            data._id = createHashId(req.session._id + '-' + data.name, 16);

            if(data.abilities) {
                data.abilities = data.abilities.split(',');
            }
            else {
                data.abilities = [];
            }

            //--- save card and image
            async.series([

                //--- save the image if there is one
                function(callback) {
                    if(req.files && req.files.image) {
                        data.hasImage = true;
                        return saveImage(req.files.image, data._id, callback);
                    }
                    else {
                        return callback();
                    }
                },

                //--- save the card
                function(callback) {
                    Card.findByIdAndSave(data, callback);
                }
            ],

            //--- all done
            function(err, results) {
                res.apiOut(err, results[1]);
            });
        },



        /**
         * return a single card
         */
        get: function(req, res) {
            var cardId = req.params.cardId;

            Card.findOne({_id: cardId})
                .populate('User')
                .exec(function(err, result) {
                    return res.apiOut(err, result);
                });
        },


        /**
         * report a card
         */
        edit: function(req, res) {

            var action = req.param('action');
            var cardId = req.param('cardId');

            if(action === 'report') {
                Card.findById(cardId)
                    .populate('User')
                    .exec(function(err, card) {
                        if(err) {
                            return res.apiOut(err);
                        }

                        card = card.toObject();

                        var report = {
                            note: null,
                            type: 'card',
                            publicData: card
                        };

                        globe.saveReport(req.session._id, report, function(err) {
                            card.reported = true;
                            return res.apiOut(err, card);
                        });
                    });
            }
            else {
                return res.apiOut('Action "' + action + '" not found');
            }
        },


        /**
         * output a list of cards owned by userId
         */
        getList: function(req, res) {

            var userId = req.params.userId || req.session._id;
            var query = {userId: userId};

            var options = {
                model: Card,
                page: req.body.page,
                count: 10,
                find: query,
                sort: {updated: -1},
                allowFindBy: ['userId'],
                allowSortBy: ['updated']
            };

            paginate(options, res.apiOut);
        },



        /**
         * Delete a card by id. User must be owner of the card or a moderator to do so
         * @body {string} [cardId] the card to be deleted
         */
        del: function(req, res) {
            var cardId = req.params.cardId;
            var userId = req.session._id;

            // users can only delete their own cards
            var query = {_id: cardId, userId: userId};

            // mods and admins can delete any cards
            if(req.session.group === groups.MOD || req.session.group === groups.ADMIN) {
                query = {_id: cardId};
            }

            Card.findOneAndRemove(query, function(err, result) {
                if(err) {
                    return res.apiOut(err);
                }
                if(!result) {
                    return res.apiOut('card not found');
                }
                return res.apiOut(err, result);
            });
        }
    };
    
    module.exports = self;
    
}());