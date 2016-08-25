var expect = require('chai').expect;
var lib = require('../');

describe('Basic Blade test', function () {
    var blocks = lib({
        blade: true,
        extension: 'php',
        directory: 'test/examples/blade'
    });

    it('should be an object', function () {
        expect(blocks).to.be.object;
    });

    it('should has a key and that is an array', function () {
        expect(blocks).to.have.property('index').that.is.an('array');
    });

    it('should has blockA in the array', function () {
        expect(blocks['index']).to.have.deep.property('[0]', 'blockA');
    });

    it('should has blockB in the array', function () {
        expect(blocks['index']).to.have.deep.property('[1]', 'blockB');
    });
});