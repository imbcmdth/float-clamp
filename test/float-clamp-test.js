var FloatClamp = require('../');
var a = require('assert');

describe('float clamp', function(){

	it('clamp values to inclusive ranges', function(){
		var clamper = FloatClamp.makeDoubleClamper('[1..16.2]');

		a.equal(clamper(0), 1);
		a.equal(clamper(12), 12);
		a.equal(clamper(16), 16);
		a.equal(clamper(24), 16.2);
	});

	it('support ranges in where the start value is greater than the end value', function(){
		var clamper = FloatClamp.makeDoubleClamper('[16.2..1]');

		a.equal(clamper(0), 1);
		a.equal(clamper(12), 12);
		a.equal(clamper(16), 16);
		a.equal(clamper(24), 16.2);
	});

	// I really don't know how to test exclusive ranges without resorting to the
	// same maths that I used in the library itself. This is a bit chicken-and-egg...
	it('clamp values to random number range', function(){
		var randomClamper = FloatClamp.makeDoubleClamper('[0..1)');
		var i = 1000000;

		while (i--) {
			var n = Math.random();
			a.equal(randomClamper(n), n);
		}
	});

	it('clamp integer values to exclusive ranges', function(){
		var topRange = Math.pow(2, 53) + 2;
		var bottomRange = -Math.pow(2, 53) - 2;
		var integerClamper = FloatClamp.makeIntegerClamper('('+bottomRange+'..'+topRange+')');

		a.equal(integerClamper(topRange + 5), integerClamper(topRange) + 1);
		a.equal(integerClamper(bottomRange - 5), integerClamper(bottomRange) - 1);
	});
});
