import { Point } from '../ecc.mjs';

/**
 * Exercise 1
 * 
 * Determine which points are not on the curve y^2 = x^3 + 5x + 7
 */

function onCurve(x, y) {
  return y**2 === x**3 + 5*x + 7
}

// (2, 4)
console.log('(2, 4) on curve y^2 = x^3 + 5x + 7:', onCurve(2, 4));

// (-1, -1)
console.log('(-1, -1) on curve y^2 = x^3 + 5x + 7:', onCurve(-1, -1));

// (18, 77)
console.log('(18, 77) on curve y^2 = x^3 + 5x + 7:', onCurve(18, 77));

// (5, 7)
console.log('(5, 7) on curve y^2 = x^3 + 5x + 7:', onCurve(5, 7));


/**
 * Exercise 2
 * 
 * Write a not equals method for Point.
 */
let pointOne = new Point(-1, -1, 5, 7);
let pointTwo = new Point(-1, -1, 5, 7);

console.log(`Point one not equal to point two:`, !pointOne.equals(pointTwo));


/**
 * Exercise 3
 * 
 * Handle the case where two points are additive inverses (same x, different y).
 */
// Done.


/**
 * Exercise 4
 * 
 * For the curve y^2 = x^3 + 5x + 7, what is (2, 5) + (-1, -1)?
 */
let x1 = 2, y1 = 5;
let x2 = -1, y2 = -1;

let s = (y2 - y1) / (x2 - x1);
let x3 = s**2 - x1 - x2;
let y3 = s * (x1 - x3) - y1;

console.log(`(${x1}, ${y1}) + (${x2}, ${y2}) = (${x3}, ${y3})`);


/**
 * Exercise 5
 * 
 * Update the add method to handle x1 =/= x2.
 */
// Done.


/**
 * Exercise 6
 * 
 * For the curve y^2 = x^3 + 5x + 7, what is (-1, -1) + (-1, -1)?
 */
x1 = y1 = x2 = y2 = -1;

s = (3 * (x1**2) + 5) / (2*y1);
x3 = s**2 - 2*x1;
y3 = s * (x1 - x3) - y1;

console.log(`(${x1}, ${y1}) + (${x2}, ${y2}) = (${x3}, ${y3})`);


/**
 * Exercise 7
 * 
 * Update the add method to handle adding two equal points.
 */
// Done.
