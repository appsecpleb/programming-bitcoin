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

    let num;

    // Conditionally utilize BigInt type for large values of `other.num ** (this.prime - 2)`
    if (Number.isSafeInteger(other.num ** this.prime - 2)) {
      num = mod(this.num * (other.num ** (this.prime - 2)), this.prime);
    } else {
      num = mod(BigInt(this.num) * (BigInt(other.num) ** BigInt(this.prime - 2)), BigInt(this.prime));
    }

    return new FieldElement(
      num, 
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
    const n = mod(exponent, this.prime -1);

    return new FieldElement(
      mod(Math.pow(this.num, n), this.prime), 
      this.prime
    );
  }
}

/**
 * Point along an elliptic curve over the reals or a finite field.
 */
export class Point {
  x;
  y;
  a;
  b;
  curveIsOverReals;
  curveIsOverFiniteField;

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
    this.curveIsOverReals = typeof(this.x) === 'number'; // `this.x` is not a finite field element
    this.curveIsOverFiniteField = !this.curveIsOverReals;

    // If point at infinity
    if (this.x === null && this.y === null) return;

    // Flag to indicate whether point exists on the curve
    let pointIsOnTheCurve = false;
    
    if (this.curveIsOverReals) {
      if (y**2 === x**3 + a*x + b) {
        pointIsOnTheCurve = true;
      }
    } else if (this.curveIsOverFiniteField) {
        if (
          // y^2 % p = (x^3 + ax + b) % p
          mod(this.y.num**2, this.y.prime) === 
            mod((this.x.num**3 + this.a.num*this.x.num + this.b.num), this.y.prime)
        ) {
          pointIsOnTheCurve = true;
        }
    }

    // If point does not exist on the curve
    if (!pointIsOnTheCurve) {
      throw new Error(`(${x}, ${y}) is not on the curve.`);
    }
  }

  /**
   * Override default object toString method.
   * 
   * @returns {string}
   */
  toString() {
    if (this.curveIsOverReals) {
      return `Point(${this.x}, ${this.y})_${this.a}_${this.b}`;
    } else if (this.curveIsOverFiniteField) {
      return `Point(${this.x.num}, ${this.y.num})_${this.a.num}_${this.b.num}`;
    }
  }

  /**
   * Check equality of two points along an elliptic curve.
   * 
   * @param {Point} other 
   * @returns {boolean} Whether the points are equal.
   */
  equals(other) {
    if (this.curveIsOverReals) {
      return (
        this.x === other.x && 
        this.y === other.y && 
        this.a === other.a && 
        this.b === other.b
      )
    } else if (this.curveIsOverFiniteField) {
      return (
        this.x.equals(other.x) && 
        this.y.equals(other.y) && 
        this.a.equals(other.a) && 
        this.b.equals(other.b)
      )
    }
  }

  /**
   * Add two points along an elliptic curve.
   * 
   * @param {Point} other Other point to add.
   * @returns {Point} Result of the point addition.
   */
  add(other) {
    if (this.curveIsOverReals) {
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
    } else if (this.curveIsOverFiniteField) {
        // Ensure points exist along the same curve
        if (!this.a.equals(other.a) || !this.b.equals(other.b)) {
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
        if ((this.x.equals(other.x)) && (!this.y.equals(other.y))) {
          // Return the point at infinity
          return new Point(null, null, this.a, this.b);
        }

        // If points have different x coordinates
        if (!this.x.equals(other.x)) {
          // s = (y2 - y1) / (x2 - x1)
          // x3 = s^2 - x1 - x2
          // y3 = s(x1 - x3) - y1
          const s = (other.y.subtract(this.y)).divideBy((other.x.subtract(this.x)));
          const x = (s.powerOf(2)).subtract(this.x).subtract(other.x);
          const y = s.multiplyBy((this.x.subtract(x))).subtract(this.y);
          
          return new Point(x, y, this.a, this.b);
        }

        // If points are the same (line is tangent to the point)
        if (this.equals(other)) {
          // If point is vertical, return the point at infinity
          if (this.y.num === 0) return new Point(null, null, this.a, this.b);
          // s = (3x1^2 + a) / 2y1
          // x3 = s^2 - 2x1
          // y3 = s(x1 - x3) - y1
          const x1 = this.x.num;
          const y1 = this.y.num;
          const prime = this.x.prime;
          const x1Sq = mod(x1 ** 2, prime);
          const threeX1Sq = mod(3*x1Sq, prime);
          const threeX1SqPlusA = mod(threeX1Sq + this.a.num, prime);
          const twoY1 = mod(2*y1, prime);
          const s = mod(BigInt(threeX1SqPlusA) * (BigInt(twoY1) ** BigInt(prime - 2)), BigInt(prime)); console.log('s: ', s);
          const sSq = mod(s ** 2, prime); console.log('sSq: ', sSq);
          const twoX1 = mod(2*x1, prime); console.log('twoX1: ', twoX1);
          const x3 = mod(sSq - twoX1, prime); console.log('x3: ', x3);
          const x1MinusX3 = mod(x1 - x3, prime); console.log('x1MinusX3: ', x1MinusX3)
          const sTimesX1MinusX3 = mod(s * x1MinusX3, prime); console.log('sTimesX1MinusX3: ', sTimesX1MinusX3);
          const y3 = mod(sTimesX1MinusX3 - y1, prime); console.log('y3: ', y3);

          const newPoint = new Point(new FieldElement(x3, prime), new FieldElement(y3, prime), this.a, this.b); console.log('newPoint: ', newPoint);

          return newPoint;
        }
    }
  }
}
