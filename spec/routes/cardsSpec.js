describe('cards', function() {
    
    'use strict';
    
    var sinon = require('sinon');
    var groups = require('../../shared/groups');
    var factions = require('../../shared/factions');
    var Card = require('../../shared/models/Card');
    var cards = require('../../routes/cards');

    
    describe('del', function() {
        
        var request;
        
        
        beforeEach(function() {   
            
            sinon.stub(Card, 'findOneAndRemove');
            
            request = {
                session: {
                    _id: 'uid1',
                    group: groups.USER
                },
                params: {
                    cardId: 'card1'
                }
            };
        });
        
        
        afterEach(function() {
            Card.findOneAndRemove.restore();
        });


        it('should delete a card if you own it', function(done) {
            Card.findOneAndRemove
                .withArgs(sinon.match({_id: 'card1', userId: 'uid1'}))
                .yields(null, true);
            
            cards.del(request, {apiOut: function(err, result) {
                expect(err).toBe(null);
                expect(result).toBe(true);
                done();
            }});
        });


        it('should not delete a card if you do not own it', function(done) {
            Card.findOneAndRemove
                .withArgs(sinon.match({_id: 'card1', userId: 'uid1'}))
                .yields(null, null);
            
            cards.del(request, {apiOut: function(err, result) {
                expect(err).toBe('card not found');
                expect(result).toBeFalsy();
                done();
            }});
        });


        it('mods can delete any card', function(done) {
            Card.findOneAndRemove
                .withArgs(sinon.match({_id: 'card1'}))
                .yields(null, true);
                                       
            request.session.group = groups.MOD;
            
            cards.del(request, {apiOut: function(err, result) {
                expect(err).toBe(null);
                expect(result).toBe(true);
                done();
            }});
        });
    });
    
    
    
    
    
    
    
    describe('get', function() {
        var userId1 = mongoose.Types.ObjectId();
        var userId2 = mongoose.Types.ObjectId();

        beforeEach(function(done) {
            CardGoose.create({
                    _id: '1-blah',
                    userId: userId1,
                    abilities: [],
                    name: 'LoadMe',
                    attack: 1,
                    health: 1,
                    faction: factions.machine.id
                },
                function(err) {
                    if(err) {
                        return done(err);
                    }

                    CardGoose.create({
                            _id: '2-canon',
                            userId: userId2,
                            abilities: [],
                            name: 'CanonIAm',
                            attack: 1,
                            health: 1,
                            faction: factions.machine.id,
                            canon: true
                        },
                        function(err) {
                            if(err) {
                                return done(err);
                            }
                            done();
                        });
                });
        });


        afterEach(function() {
            mockgoose.reset();
        });


        it('should load a card', function(done) {
            var request = {
                session: {
                    _id: userId1
                },
                params: {
                    cardId: '1-blah'
                }
            };
            cards.get(request, {apiOut: function(err, result) {
                if(err) {
                    return done(err);
                }
                expect(err).toBe(null);
                expect(result.name).toBe('LoadMe');
                done();
            }});
        });


        // something with pagination idunno
        /*it('should load a list of cards by owner', function(done) {
            var request = {
                session: {
                    _id: userId1
                },
                params: {},
                body: {}
            };
            cards.getList(request, {apiOut: function(err, result) {
                if(err) {
                    return done(err);
                }
                expect(result.length).toBe(1);
                expect(result[0].name).toBe('LoadMe');
            }});
        });*/



        // mockgoose does not support the $or operator
        /*it('should load a list by owner mixed with a list by canon', function(done) {
            var request = {
                session: {
                    _id: userId1
                },
                body: {
                    canon: true
                }
            };
            cards.get(request, {apiOut: function(err, result) {
                expect(err).toBe(null);
                expect(result.length).toBe(2);
                done();
            }});
        });*/
    });
    
    
    
    
    
    describe('post', function() {

        beforeEach(function() {
            request = {
                session: {
                    _id: mongoose.Types.ObjectId()
                },
                body: {
                    name: 'TestCard',
                    abilities: 'tree,bees',
                    attack: 1,
                    health: 1,
                    story: 'This is the best card ever.',
                    faction: 'no'
                }
            };
        });


        it('should save a valid card', function(done) {
            cards.post(request, {apiOut: function(error, result) {
                expect(error).toBe(null);
                expect(result._id).toBeTruthy();
                done();
            }});
        });


        it('xss attacks should be removed from the story', function(done) {
            request.body.story = '<SCRIPT SRC="http://ha.ckers.org/xss.js"></SCRIPT>';
            cards.post(request, {apiOut: function(error, result) {
                expect(error).toBe(null);
                expect(result.story).toBe('[removed][removed]');
                done();
            }});
        });


        it('should not save invalid name', function(done) {
            request.body.name = 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW';
            cards.post(request, {apiOut: function(error, result) {
                expect(error.message).toBe('Validation failed');
                done();
            }});
        });


        it('should not save invalid abilities', function(done) {
            request.body.abilities = JSON.stringify([{bla:true}]);
            cards.post(request, {apiOut: function(error, result) {
                expect(error.message).toBe('Validation failed');
                done();
            }});
        });


        it('should not save invalid attack', function(done) {
            request.body.attack = 'this is a string';
            cards.post(request, {apiOut: function(error, result) {
                expect(error.message).toContain('NaN');
                done();
            }});
        });


         it('should not save invalid health', function(done) {
            request.body.health = -1;
            cards.post(request, {apiOut: function(error, result) {
                expect(error.message).toBe('Validation failed');
                done();
            }});
        });


        it('should not save invalid story', function(done) {
            request.body.story = 'a really long storyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy';
            cards.post(request, {apiOut: function(error, result) {
                expect(error.message).toBe('Validation failed');
                done();
            }});
        });
    });

});