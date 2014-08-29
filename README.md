# FLOAT CLAMP

Clamp numbers to ranges taking into account the epsilon of the numbers at the end of the ranges. A range is string  in [Interval Notation](http://en.wikipedia.org/wiki/Interval_(mathematics)#Notations_for_intervals) such as "[2..4)" which means "between 2 (inclusive) and 4 (exclusive)."

[![browser support](https://ci.testling.com/imbcmdth/float-clamp.png)](https://ci.testling.com/imbcmdth/float-clamp)

## Contents

* [Installation](#install)

* [Basic Usage](#basic-usage)

* [API](#api)

* [Versions](#versions)

* [License](#license---mit)

## Install
````bash
npm install float-clamp
````

..then `require` float-clamp:

````javascript
var floatClamp = require('float-clamp');
````

## Basic Usage

```javascript
var randomClamper = floatClamp.makeDoubleClamper('[0..1)');

//- Now randomClamper is a function that will clamp numbers to between 0 (inclusive)
//- and 1 (exclusive)
//- This is exactly the same range as values returned from Math.random()

randomClamper(-0.01) //=> 0
randomClamper(0)     //=> 0
randomClamper(0.01)  //=> 0.01
randomClamper(1)     //=> 0.9999999999999999
```

See below for clamp generators for other precision floating point numbers (and even an integer)

## API

`floatClamp.makeDoubleClamper(*range*)`

Shown above, generates clampers that calculates epsilons for double-precision floating point numbers. Every `Number` in JavaScript is a double as well as `Float64Array` typed arrays.

`floatClamp.makeSingleClamper(*range*)`

Generates clampers that calculates epsilons for single-precision floating point numbers. In other words, `Float32Array` typed arrays.

`floatClamp.makeHalfClamper(*range*)`

Generates clampers that calculates epsilons for half-precision floating point numbers. I'm not sure half-floats (16 bit storage) are even available in JavaScript but they are heavily used in GPUs so I included it for possible future proofing in case WebGL or WebCL add support (ie. `Float16Array`).

`floatClamp.makeIntegerClamper(*range*)`

Integer clamping is easy, right?

Not so fast! All `Numbers` in JavaScript are doubles. After +-2^53, the episilon for doubles is greater than one. The calculations for determining a number nearest-to-endpoint must take that into account for very large ranges.

Integers greater than 2^53 can not be represented exactly. This library takes that into account when used with very large exclsuive end-points and will clamp to the nearest valid integer to that exclusive end-point.

## Versions

* [v1.0.0](https://github.com/imbcmdth/float-clamp/archive/v1.0.0.zip) Initial functionality

## License - MIT

> Copyright (C) 2013 Jon-Carlos Rivera
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
