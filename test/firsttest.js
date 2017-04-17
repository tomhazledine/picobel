var chai = require('chai');
var should = chai.should();
var assert = chai.assert;

var picobel = require('../uncompressed/js/picobel')

describe('Test',function() {
    it('should return true', function(){
        picobel.testfunction().should.equal(true);
    })
});

// describe('Picobel',function() {
//     it('should return true', function(){
//         picobel.Picobel().should.equal(true);
//     })
});