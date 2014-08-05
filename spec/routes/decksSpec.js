describe('routes/decks', function() {
    
    'use strict';
    
    var mongoose = require('mongoose');
    require('../../fns/mongoose/findByIdAndSave').attach(mongoose);
    var mockgoose = require('mockgoose');
    mockgoose(mongoose);
    
    var CardGoose = require('../../shared/models/Card'); //need this for deck model
    var DeckGoose = require('../../shared/models/Deck');
    var decks = require('../../routes/decks');
    
    ///////////////////////////////////////////////////////////////////////////
    // post
    /////////////////////////////////////////////////////////////////////////
    
    describe('post', function() {

        it('should save a valid deck', function(done) {
            var request = {
                session: {
                    _id: mongoose.Types.ObjectId()
                },
                body: {
                    name: 'Team Flamingo',
                    cards: ['1111111111', '222222222222'],
                    pride: 5
                }
            };
            decks.post(request, {apiOut: function(err, result) {
                expect(err).toBe(null);
                expect(result.name).toBe('Team Flamingo');
                done();
            }});
        });
    });
    
    
    /////////////////////////////////////////////////////////////////////////
    // delete
    ///////////////////////////////////////////////////////////////////////
    
    describe('delete', function() {

        var userId1 = mongoose.Types.ObjectId();
        beforeEach(function(done) {
            DeckGoose.create({
                _id: '1-deck',
                name: 'Saints',
                cards: ['st.pattrick', 'st.peters', 'thepope'],
                userId: userId1,
                pride: 17
            },
            function(err, deck) {
                if(err) {
                    throw err;
                }
                done();
            });
        });


        afterEach(function() {
            mockgoose.reset();
        });


        it('should delete an existing deck', function(done) {
            var request = {
                session: {
                    userId: userId1
                },
                params: {
                    deckId: '1-deck'
                }
            };
            decks.del(request, {apiOut: function(err, result) {
                done(err);
            }});
        });


    });



    ////////////////////////////////////////////////////////////////////////////////////////////////
    // get 
    //////////////////////////////////////////////////////////////////////////////////////////////

    describe('get', function() {

        var userId1;

        beforeEach(function(done) {
            userId1 = mongoose.Types.ObjectId();

            DeckGoose.create({
                    _id: '1-deck',
                    name: 'Saints',
                    cards: ['st.pattrick', 'st.peters', 'thepope'],
                    userId: userId1,
                    pride: 3
                },
                function(err, deck) {
                    if(err) {
                        throw err;
                    }

                    DeckGoose.create({
                            _id: '1-ldfsj',
                            name: 'Buffalo',
                            cards: ['buffalo', 'buffalo', 'buffalo'],
                            userId: userId1,
                            pride: 3
                        },
                        function(err, deck) {
                            if(err) {
                                throw err;
                            }
                            done();
                        });
                });
        });


        afterEach(function() {
            mockgoose.reset();
        });


        it('should return a deck that is owned by the requester', function(done) {
            var request = {
                session: {
                    _id: userId1
                },
                params: {
                    deckId: '1-deck'
                }
            };
            decks.get(request, {apiOut: function(err, response) {
                expect(response.name).toBe('Saints');
                done(err);
            }});
        });


        it('should return a list of decks owned by the requester', function(done) {
            var request = {
                session: {
                    _id: userId1
                }
            };
            decks.getList(request, {apiOut: function(err, response) {
                expect(response.length).toBe(2);
                done();
            }});
        });

    });

});