import { FieldElement } from '../ecc.mjs';
import { mod } from '../utils.mjs';


/**
 * Exercise 1
 * 
 * Write a method that checks if two FieldElements are not equal to each other.
 */
const elementOne = new FieldElement(1, 3);
const elementOneCopy = new FieldElement(1, 3);
const elementTwo = new FieldElement(2, 3);

console.log(`${elementOne} and ${elementTwo} are not equal:`, !elementOne.equals(elementTwo));
console.log(`${elementOne} and ${elementTwo} are not equal:`, !elementOne.equals(elementOneCopy));


/**
 * Exercise 2
 * 
 * Solve the following problems in F57:
 */
let prime = 57;

// 44 + 33
console.log('44 +f 33 =', mod((44 + 33), prime));

// 9 - 29
console.log('9 -f 29 =', mod((9 - 29), prime));

// 17 + 42 + 49
console.log('17 +f 42 +f 49 =', mod((17 + 42 + 49), prime));

// 52 - 30 - 38
console.log('52 -f 30 -f 38 =', mod((52 - 30 - 38), prime));


/**
 * Exercise 3
 * 
 * Write a method to subtract two field elements.
 */
console.log(`${elementOne} -f ${elementTwo} = ${elementOne.subtract(elementTwo)}`);


/**
 * Exercise 4
 * 
 * Solve the following problems in F97:
 */
prime = 97;

// 95 * 45 * 31
console.log(`95 *f 45 *f 31 = ${mod((95 * 45 * 31), prime)}`);

// 17 * 13 * 19 * 44
console.log(`17 *f 13 *f 19 *f 44 = ${mod((17 * 13 * 19 * 44), prime)}`);

// 12^7 * 77^49
console.log(`12**7 *f 77**49 = ${mod(((12**7) * (77**49)), prime)}`);


/**
 * Exercise 5
 * 
 * For k = 1, 3, 7, 13, 18 what is the set in F19?
 * 
 * {k *f 0, k *f 1, k *f 2, k *f 3, ... , k *f 18}
 * 
 * Do you notice anything about these sets?
 */
prime = 19;
let k1 = [], k3 = [], k7 = [], k13 = [], k18 = [];

// Construct sets
for (let i = 0; i < 19; i++) {
  k1.push(mod((1 * i), prime));
  k3.push(mod((3 * i), prime));
  k7.push(mod((7 * i), prime));
  k13.push(mod((13 * i), prime));
  k18.push(mod((18 * i), prime));
}

console.log('k1:', k1);
console.log('k3:', k3);
console.log('k7:', k7);
console.log('k13:', k13);
console.log('k18:', k18);

// When sorted, the results are always the same set
console.log(k1.sort());
console.log(k3.sort());
console.log(k7.sort());
console.log(k13.sort());
console.log(k18.sort());


/**
 * Exercise 6
 * 
 * Write a method to multiply two field elements.
 */
console.log(`${elementOne} *f ${elementTwo} = ${elementOne.multiplyBy(elementTwo)}`);


/**
 * Exercise 7
 * 
 * For p = 7, 11, 17, 31, what is this set in Fp?
 * 
 * {1 ** (p - 1), 2 ** (p - 1), ..., (p - 1) ** (p - 1)}
 */
let primes = [7, 11, 17, 31];

primes.forEach(prime => {
  // Create array of field elements beginning at 1
  const elements = [...Array(prime).keys()];
  elements.shift();

  const result = elements.map(element => (
    // (element ** (prime - 1)) % prime
    mod(BigInt(element) ** BigInt(prime - 1), BigInt(prime))
  ));

  console.log(result);
});


/**
 * Exercise 8
 * 
 * Solve the following in F31:
 */
prime = 31;

// 3/24
// 3 * 1/24
// 3 * 24**(31 - 2)
console.log(`3/f24 = ${(3 * (24 ** (prime - 2))) % prime}`);

// 17 ** -3
// 17 ** (-1) -2
// 17 ** (31 - 2) -2
// 17 ** (27)
console.log(`17**-3 = ${(17 ** (prime - 4)) % prime}`);

// 4 ** -4 * 11
// 4 ** (-1) -3 * 11
// 4 ** (31 - 2) -3 * 11
// 4 ** (26) * 11
console.log(`4**-4 * 11 = ${((4 ** 26) * 11) % prime}`);

const foo = new FieldElement(7, 13);
console.log(`${foo.powerOf(-3)}`)
