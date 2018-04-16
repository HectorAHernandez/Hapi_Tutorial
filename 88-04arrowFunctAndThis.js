/* Arrows are a function shorthand using the => syntax. They are syntactcally 
similar to the related feature in C#, Java 9 an coffeeScript. Arrows function 
support both expression and stement bodies. Unlike functions, arrows functions
share the same lexical "this" as their surroding code. so, if an arrow is 
inside anothre function, it shares the "arguments" variables of its 
parent function*/

/*/ arrows function as Expression bodies
var odds = evens.map(v => v + 1);
console.log("evens.map(v => v + 1) is equal to: " + odds(5));
var nums = evens.map((v, i) => v + i);
console.log("evens.map((v, i) => v + i) is equal to: " + nums(5,5));

// arrows function as Statement bodies:
var nums = [10, 13, 15, 18, 40];
nums.forEach(v => {
    if (v % 5 === 0)
       fives.push(v);
});

// use of lexical "this" with arrow function
function square() {
    let example = () => {
        let numbers = [];
        for (let number of arguments) {
            numbers.push(number * number);
        }
        return number;
    };
    return example();
}
square(2, 4, 7.5, 8, 11.5, 21); // returns: [4, 16, 56.25, 64, 132.25, 441]
*/
var fibonacci = {
    [Symbol.iterator]: function*() {
      var pre = 0, cur = 1;
      for (;;) {
        var temp = pre;
        pre = cur;
        cur += temp;
        yield cur;
      }
    }
  }
  
  for (var n of fibonacci) {
    // truncate the sequence at 1000
    if (n > 1000)
      break;
    console.log(n);
  }