var sinon = require('sinon');
var futures = require('../../routes/futures');
var futureDict = require('../../shared/futures');


describe('routes/futures', function() {
    
    'use strict';

    
    describe('put', function() {
        
        
        var progress, req, res;
        
        beforeEach(function() {

            progress = {
                futures: [],
                fractures: 0,
            };
            progress.save = sinon.stub().yields(null, progress);

            req = {
                params: [],
                progress: progress
            };

            res = {
                apiOut: sinon.stub()
            };
        });
        
        
        it('should add future to your account if you have enough fractures', function() {
            progress.fractures = 1;
            req.params = {futureId: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( progress.fractures ).toBe( 1 );
            expect( progress.futures ).toEqual( [futureDict.CAPITALISM] );
        });


        it('should subtract fractures from your account in ever increasing ammounts', function() {
            progress.fractures = 99;
    
            // first future costs 1
            req.params = {futureId: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( progress.fractures ).toBe( 99 );
            
            // second future costs 2
            req.params = {futureId: futureDict.RENAISSANCE};
            futures.put(req, res);
            expect( progress.fractures ).toBe( 98 );
            
            // third future costs 3
            req.params = {futureId: futureDict.EDEN};
            futures.put(req, res);
            expect( progress.fractures ).toBe( 96 );
        });


        it('should save changes to your account', function() {
            progress.fractures = 1;
            req.params = {futureId: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( [null, progress] );
        });


        it('should reject request if you do not have enough fractures', function() {
            
            progress.fractures = 0;
            progress.futures = [futureDict.EDEN];
            req.params = {futureId: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['1 more fracture(s) are needed to unlock this future'] );
            
            progress.fractures = 1;
            progress.futures = [futureDict.EDEN, futureDict.ANARCHY, futureDict.NUCLEAR_WAR];
            req.params = {futureId: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[1] ).toEqual( ['2 more fracture(s) are needed to unlock this future'] );
            
            progress.fractures = -5;
            progress.futures = [];
            req.params = {futureId: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[2] ).toEqual( ['5 more fracture(s) are needed to unlock this future'] );
        });


        it('should reject request if you already own the selected future', function() {
            progress.fractures = 999;
            progress.futures = [futureDict.CAPITALISM];
            req.params = {futureId: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['You already own this future'] );
        });


        it('should reject request if you specify an invalid future', function() {
            progress.fractures = 999;
            req.params = {futureId: 123};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['Invalid future'] );
        });
        
    });

    
    
    
    
    describe('getList', function() {
        
        it("should return an array of a user's futures", function() {
            
            var progress = {
                futures: [futureDict.EDEN],
            };

            var req = {
                progress: progress
            };

            var res = {
                apiOut: sinon.stub()
            };
            
            futures.getList(req, res);
            
            expect( res.apiOut.args[0] ).toEqual( [null, [futureDict.EDEN]] );
            
        });
    });

});