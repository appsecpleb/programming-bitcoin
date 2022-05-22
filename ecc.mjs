import { mod } from './utils.mjs';


/**
 * Element of a finite field.
 */
export class FieldElement {
  num;
  prime;

  /**
   * FieldElement constructor.
   * 
   * @param {number} num Value of the field element.
   * @param {number} prime Order of the field.
   */
  constructor(num, prime) {
    if ((num >= prime) || (num < 0)) {
      throw new Error(`Num ${num} not in field range 0 to ${prime - 1}.`);
    }

    this.num = num;
    this.prime = prime;
  }

  /**
   * Override default object toString method.
   * 
   * @returns {string}
   */
  toString() {
    return `FieldElement_${this.num}(${this.prime})`;
  }

  /**
   * Check equality against another field element.
   * 
   * @param {FieldElement} other Field element to compare.
   * @returns {boolean} Whether the field elements are equal.
   */
  equals(other) {
    if (!other) return false;

    return (this.num === other.num) && (this.prime === other.prime);
  }

  /**
   * Add two field elements.
   * 
   * @param {FieldElement} other Field element to add.
   * @returns {FieldElement} Result of the addition.
   */
  add(other) {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot add two elements from different fields.`);
    }

    return new FieldElement(
      mod((this.num + other.num), this.prime), 
      this.prime
    );
  }

  /**
   * Subtract two field elements.
   * 
   * @param {FieldElement} other Field element to subtract.
   * @returns {FieldElement} Result of the subtraction.
   */
  subtract(other) {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot subtract two elements from different fields.`);
    }

    return new FieldElement(
      mod((this.num - other.num), this.prime), 
      this.prime
    );
  }

  /**
   * Multiply two field elements.
   * 
   * @param {FieldElement} other Field element to multiply by.
   * @returns {FieldElement} Result of the multiplication.
   */
  multiplyBy(other) {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot multiply two elements from different fields.`);
    }

    return new FieldElement(
      mod((this.num * other.num), this.prime), 
      this.prime
    );
  }

  /**
   * Divide two field elements.
   * 
   * @param {FieldElement} other Field element to divide by.
   * @returns {FieldElement} Result of the division.
   */
  divideBy(other) {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot divide two elements from different fields.`);
    }

    return new FieldElement(
      mod(this.num * (other.num ** (this.prime - 2)), this.prime), 
      this.prime
    );
  }

  /**
   * Raise a field element to a certain power.
   * 
   * @param {number} exponent Power to raise element to.
   * @returns {FieldElement} Result of the exponentiation.
   */
  powerOf(exponent) {
    // By Fermat's Little Theorem: a^(p - 1) = 1
    // a^-n = a^-n * a^(p - 1) = a^(p - 1 + n)
    const n = mod(exponent, this.prime -1)

    return new FieldElement(
      mod(Math.pow(this.num, n), this.prime), 
      this.prime
    );
  }
}


/**
 * Point along an elliptic curve.
 */
export class Point {
  x;
  y;
  a;
  b;

  /**
   * Point constructor.
   * 
   * @param {number} y 
   * @param {number} x 
   * @param {number} a 
   * @param {number} b 
   */
  constructor(x, y, a, b) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;

    // Point at infinity
    if (this.x === null && this.y === null) return;
    
    if (y**2 != x**3 + a*x + b) {
      throw new Error(`(${x}, ${y}) is not on the curve.`);
    }
  }

  /**
   * Check equality of two points along an elliptic curve.
   * 
   * @param {Point} other 
   * @returns {boolean} Whether the points are equal.
   */
  equals(other) {
    return (
      this.x === other.x && 
      this.y === other.y && 
      this.a === other.a && 
      this.b === other.b
    )
  }

  /**
   * Add two points along an elliptic curve.
   * 
   * @param {Point} other Other point to add.
   * @returns {Point} Result of the point addition.
   */
  add(other) {
    // Ensure points exist along the same curve
    if (this.a !== other.a || this.b !== other.b) {
      throw `Points ${this}, ${other} are not on the same curve.`;
    }

    // If `this` is the point at infinity, or additive identity
    if (this.x === null) {
      return other;
    } 
    // If `other` is the point at infinity, or additive identity
    else if (other.x === null) {
      return this;
    }

    // If points are additive inverses
    if ((this.x === other.x) && (this.y !== other.y)) {
      // Return the point at infinity
      return new Point(null, null, this.a, this.b);
    }

    // If points have different x coordinates
    if (this.x !== other.x) {
      const s = (other.y - this.y) / (other.x - this.x);
      const x = s**2 - this.x - other.x;
      const y = s * (this.x - x) - this.y;

      return new Point(x, y, this.a, this.b);
    }

    // If points are the same (line is tangent to the point)
    if (this.equals(other)) {
      // If point is vertical, return the point at infinity
      if (this.y === 0) return new Point(null, null, this.a, this.b);

      const s = (3 * (this.x**2) + a) / (2*other.y);
      const x = s**2 - (2*this.x);
      const y = s * (this.x - x) - this.y;

      return new Point(x, y, this.a, this.b);
    }
  }
}
