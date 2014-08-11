/* global describe, it, expect */

'use strict';

var sinon = require('sinon');
var findOneAndSave = require('../../../fns/mongoose/findOneAndSave');


describe('findOneAndSave', function() {


    it('should perform an insert if a document with the same _id does not already exist', function() {
        
        var model = sinon.stub().returns({
            save: sinon.stub()
                .yields(null, {saved: true})
        });
        
        model.findOne = sinon.stub()
            .withArgs(8)
            .yields(null, null);
        
        findOneAndSave(model, {_id: 8}, function(err, doc) {
            expect(model.findOne.withArgs(8).calledOnce).toBe(true);
            expect(model.calledOnce).toBe(true);
            expect(err).toBeFalsy();
            expect(doc).toEqual({saved: true});
        });
    });


    it('should perform an update if a document with the same _id does exist', function() {
        
        var model = {};
        
        var existingDoc = {
            save: sinon.stub()
                .yields(null, {saved: true})
        };
        
        model.findOne = sinon.stub()
            .withArgs(3)
            .yields(null, existingDoc);
        
        findOneAndSave(model, {_id: 3}, function(err, doc) {
            expect(model.findOne.withArgs(3).calledOnce).toBe(true);
            expect(existingDoc.save.calledOnce).toBe(true);
            expect(err).toBeFalsy();
            expect(doc).toEqual({saved: true});
        });
    });


    it('should yield an error if the document fails to save', function() {
        
        var model = {};
        
        var existingDoc = {
            save: sinon.stub()
                .yields('such an error', null)
        };
        
        model.findOne = sinon.stub()
            .withArgs(3)
            .yields(null, existingDoc);
        
        findOneAndSave(model, {_id: 3}, function(err, doc) {
            expect(model.findOne.withArgs(3).calledOnce).toBe(true);
            expect(existingDoc.save.calledOnce).toBe(true);
            expect(err).toBe('such an error');
            expect(doc).toBeFalsy();
        });
    });
    

});