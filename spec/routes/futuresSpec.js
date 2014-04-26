var sinon = require('sinon');
var futures = require('../../routes/futures');
var futureDict = require('../../shared/futures');


describe('routes/futures', function() {
    
    'use strict';

    
    describe('put', function() {
        
        
        var myself, req, res;
        
        beforeEach(function() {

            myself = {
                futures: [],
                fractures: 0,
            };
            myself.save = sinon.stub().yields(null, myself);

            req = {
                params: [],
                myself: myself
            };

            res = {
                apiOut: sinon.stub()
            };
        });
        
        
        it('should add future to your account if you have enough fractures', function() {
            myself.fractures = 1;
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( myself.fractures ).toBe( 0 );
            expect( myself.futures ).toEqual( [futureDict.CAPITALISM] );
        });


        it('should subtract fractures from your account in ever increasing ammounts', function() {
            myself.fractures = 99;
    
            // first future costs 1
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( myself.fractures ).toBe( 98 );
            
            // second future costs 2
            req.params = {future: futureDict.RENAISSANCE};
            futures.put(req, res);
            expect( myself.fractures ).toBe( 96 );
            
            // third future costs 3
            req.params = {future: futureDict.EDEN};
            futures.put(req, res);
            expect( myself.fractures ).toBe( 93 );
        });


        it('should save changes to your account', function() {
            myself.fractures = 1;
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( [null, myself] );
        });


        it('should reject request if you do not have enough fractures', function() {
            
            myself.fractures = 0;
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['1 more fracture(s) are needed to unlock this future'] );
            
            myself.fractures = 1;
            myself.futures = [futureDict.EDEN, futureDict.ANARCHY, futureDict.NUCLEAR_WAR];
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[1] ).toEqual( ['3 more fracture(s) are needed to unlock this future'] );
            
            myself.fractures = -5;
            myself.futures = [];
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[2] ).toEqual( ['6 more fracture(s) are needed to unlock this future'] );
        });


        it('should reject request if you already own the selected future', function() {
            myself.fractures = 999;
            myself.futures = [futureDict.CAPITALISM];
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['You already own this future'] );
        });


        it('should reject request if you specify an invalid future', function() {
            myself.fractures = 999;
            req.params = {future: 123};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['Invalid future'] );
        });
        
    });

    
    
    
    
    describe('getList', function() {
        it("should return an array of a user's futures", function() {
            
            var user = {
                futures: [futureDict.EDEN],
            };

            var req = {
                user: user
            };

            var res = {
                apiOut: sinon.stub()
            };
            
            futures.getList(req, res);
            
            expect( res.apiOut.args[0] ).toEqual( [null, [futureDict.EDEN]] );
            
        });
    });

});