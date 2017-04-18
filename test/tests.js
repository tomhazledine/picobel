var should = chai.should();

describe('Checksum',function() {
    it('should return true if Picobel runs without errors', function(){
        Picobel().checksum.should.equal(true);
    });
});

describe('Options',function() {

    it('should return an object', function(){
        Picobel().parseOptions().should.be.a('object');
    });

    it('should fallback to "defaultPlayerTheme" if no params are set', function(){
        Picobel().parseOptions().theme.should.equal('defaultPlayerTheme');
    });

    var test_options = { theme: 'testTheme' };

    it('should apply the theme set in params', function(){
        Picobel().parseOptions(test_options).theme.should.equal('testTheme');
    });

});