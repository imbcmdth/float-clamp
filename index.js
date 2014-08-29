// float-clamp allows you to create  "clampers" using simple range-notation that are aware
// of how floating point episilon changes based on the exponent

// Range-notation example:
//   '[0..1)' will clamp values from 0 (inclusive) to 1 (exclusive)

// For exclusive ranges, this library automatically calculates the number closest to the
// end of the range as possible based on the precision of the storage (16, 32, or 64 bit
// floats.)

var rangeRegex = /(\(|\[)([-+]?[0-9]*\.?[0-9]+)\s*\.\.\s*([-+]?[0-9]*\.?[0-9]+)(\)|\])/;

function makeClamper (incrementingEpsilonCalculator, decrementingEpsilonCalculator, rangeString) {
	var matches = rangeString.match(rangeRegex);

	if (matches.length !== 5) {
		return null;
	}

	var minRange = parseFloat(matches[2]);
	var maxRange = parseFloat(matches[3]);

	var minRangeType = matches[1];
	var maxRangeType = matches[4];

	if (isNaN(minRange) || isNaN(maxRange)) {
		return null;
	}

	if (minRange > maxRange) {
		var temp = minRange;
		minRange = maxRange;
		maxRange = temp;

		temp = minRangeType;
		minRangeType = maxRangeType;
		maxRangeType = temp;
	}

	// For exclusive ranges, we have to "bump" the min or max value by the value's
	// epsilon to get the true min and/or max for the range.
	if (minRangeType  === '(') {
		minRange = minRange + incrementingEpsilonCalculator(minRange);
	}

	if (maxRangeType === ')') {
		maxRange = maxRange - decrementingEpsilonCalculator(maxRange);
	}

	// Since everything is precomputed this should be very fast assuming that the engine
	// is able to inline this function.
	return function (number) {
		return number < minRange
		         ? minRange
		         : number > maxRange
		             ? maxRange
		             : number;
	};
}

// Calculate the smallest possible increment and decrement for a floating point number.
function epsilon (isDecrementing, floatPrecision, number) {
	if (number === 0) {
		return Math.pow(2, -floatPrecision);
	}

	var exponentTemp = Math.log(Math.abs(number)) / Math.LN2;
	var exponent = Math.floor(exponentTemp);

	// Decrement is calculated slightly differently since it'll be smaller than increment at
	// power-of-two boundaries. For example at 2^53 the smallest increment is 2 but the smallest
	// decrement is still 1. Whereas at 2^53+1, the smallest increments and decrements are the
	// same value: 2
	if (isDecrementing && Math.pow(2, exponent) === number) {
		exponent -= 1;
	}

	return Math.pow(2, exponent - floatPrecision);
}

// Since integers are stored in floats in javascript we use the same type of code
// but round the epsilon values to integers. The reason for this is that after (+-)2^53, 
// not all integer values are able to be represented and this code is able compensate.
function integerEpsilon (isDecrementing, number) {
	// Not sure if floor is correct or should I use ceil or round
	return Math.floor(epsilon(isDecrementing, 52, number));
}

var decEpsilon = epsilon.bind(null, true);
var incEpsilon = epsilon.bind(null, false);

module.exports = {
	// A half-float is a 16-bits. Not sure if it can be used by JavaScript but most gpus support it
	// so for future-proofing with WebGl and WebCL, I included it.
	makeHalfClamper: makeClamper.bind(null, incEpsilon.bind(null, 10), decEpsilon.bind(null, 10)),
	makeSingleClamper: makeClamper.bind(null, incEpsilon.bind(null, 23), decEpsilon.bind(null, 23)),
	makeDoubleClamper: makeClamper.bind(null, incEpsilon.bind(null, 52), decEpsilon.bind(null, 52)),
	makeIntegerClamper: makeClamper.bind(null, integerEpsilon.bind(null, false), integerEpsilon.bind(null, true))
};
