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
        
        beforeEach(function() {
            var mockCursor = {
                populate: sinon.stub(),
                exec: sinon.stub()
            };
            mockCursor.populate.returns(mockCursor);
            mockCursor.exec.returns(mockCursor).yields('anError', 'aValue');
            
            sinon.stub(Card, 'findById').returns(mockCursor);
        });
        
        
        afterEach(function() {
            Card.findById.restore(); 
        });


        it('should output whatever mongoose yields', function(done) {
            var request = {
                params: {
                    cardId: 1
                }
            };
            cards.get(request, {apiOut: function(err, result) {
                expect(err).toBe('anError');
                expect(result).toBe('aValue');
                expect(Card.findById.withArgs(1).calledOnce).toBe(true);
                done();
            }});
        });
    });
    
    
    
    
    
    describe('post', function() {

       
    });

});