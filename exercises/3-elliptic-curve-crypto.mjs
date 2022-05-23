import { mod } from '../utils.mjs';
import { FieldElement, Point } from '../ecc.mjs';

/**
 * Exerise 1
 * 
 * Evaluate whether these points are on the curve y^2 = x^3 + 7 over F223:
 */
function pointsOnCurve(x, y, a, b, p) {
  return mod((y**2), p) === mod((a*x**3 + b), p);
}

// (192, 105)
console.log(`(192, 105) on curve: ${pointsOnCurve(192, 105, 1, 7, 223)}`);

// (17, 56)
console.log(`(17, 56) on curve: ${pointsOnCurve(17, 56, 1, 7, 223)}`);

// (200, 119)
console.log(`(200, 119) on curve: ${pointsOnCurve(200, 119, 1, 7, 223)}`);

// (1, 193)
console.log(`(1, 193) on curve: ${pointsOnCurve(1, 193, 1, 7, 223)}`);

// (42, 99)
console.log(`(42, 99) on curve: ${pointsOnCurve(42, 99, 1, 7, 223)}`);


const prime = 223;

const x1 = new FieldElement(192, prime);
const y1 = new FieldElement(105, prime);
const x2 = new FieldElement(17, prime);
const y2 = new FieldElement(56, prime);
const a = new FieldElement(0, prime);
const b = new FieldElement(7, prime);
const p1 = new Point(x1, y1, a, b);
const p2 = new Point(x1, y1, a, b);

console.log(`p1: ${p1}`);
console.log(`p2: ${p2}`);

console.log(`p1 + p2 = ${p1.add(p2)}`);
