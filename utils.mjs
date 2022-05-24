/**
 * Modulo operation.
 * 
 * @param {number} n Number to take the modulo of.
 * @param {number} m Modulo value.
 * 
 * @returns {number} Result of n % m.
 */
export function mod(n, m) {
  // Note: the % operator in javascript is the remainder, not the modulo and does not 
  // handle negative numbers.
  return Number(((n % m) + m) % m);
}
