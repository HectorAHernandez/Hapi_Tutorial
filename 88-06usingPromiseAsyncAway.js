'use strict';
const Hapi = require("hapi");

const server = Hapi.server ({  //create a Hapi server object
    port: 3000,
    host: 'localhost'
});

server.route({     // router when request for the home page.
  method: 'GET',
  path: '/',
  handler: (request, h) => {
      return 'Hello, world!';
  }
});

const init = async () => {   // start the server and log that is running
    await server.start();
    console.log(`Server running at:  ${server.info.uri}`);
};

// Handle any server error
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


/* What is Async/Await?
The newest way to write asynchronous code in JavaScript.
It is non blocking (just like promises and callbacks).
Async/Await was created to simplify the process of working with and writing 
chained promises.
Async functions return a Promise. If the function throws an error, the Promise 
will be rejected. If the function returns a value, the Promise will be resolved.
Syntax
Writing an async function is quite simple. You just need to add the async keyword prior to function:
// Normal Function
function add(x,y){
  return x + y;
}
// Async Function
async function add(x,y){
  return x + y;
}
Await
Async functions can make use of the await expression. This will pause the async function 
and wait for the Promise to resolve prior to moving on.

Example Time
Enough talk. To understand what all of this means, lets look at an example! First 
we’re going to create some code using promises. Once we’ve got something working, 
we’ll rewrite our function using async/await so you can see just how much simpler 
it is!

Consider the below code:
function doubleAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x * 2);
    }, 2000);
  });
}
In this code we have a function called doubleAfter2Seconds. This function will take
 a number as input and will resolve two seconds later with the number doubled.
We can invoke our function and pass in the number 10 to try it out. To do this, 
we’ll call our function while passing in 10. Then, after the promise has resolved, 
we’ll take our returned value and log it to the console. Here’s what this would look
 like:

doubleAfter2Seconds(10).then((r) => {
  console.log(r);
});

Awesome!
But what if we want to run a few different values through our function and add the 
result? Unfortunately, we cant just add our invocations together and log them:
let sum =   doubleAfter2Seconds(10)
          + doubleAfter2Seconds(20)
          + doubleAfter2Seconds(30);
console.log(sum);
// undefined
The problem with the above code is it doesn’t actually wait for our promises to 
resolve before logging to the console.

One possible solution is to set up a promise chain. To do this we’ll create a new
function called addPromise. Our function will take an input value, and will return 
a Promise. Here’s what the boilerplate code looks like:

function addPromise(x){
  return new Promise(resolve => {
    // Code goes here...   
    // resolve()
  });
}
Awesome. Now we can add in our calls to our doubleAfter2Seconds function. Once we’re 
done, we can resolve with our new sum. In this example we should be 
returning x + 2*a + 2*b + 2*c. Here’s the code:
function addPromise(x){
  return new Promise(resolve => {
    doubleAfter2Seconds(10).then((a) => {
      doubleAfter2Seconds(20).then((b) => {
        doubleAfter2Seconds(30).then((c) => {
          resolve(x + a + b + c);
        })
      })
    })
  });
}
Lets walk through the code again, line by line.

First, we create our function addPromise. This function accepts one parameter.
Next, we create our new Promise that we’ll be returning. Note that for the sake of 
simplicity, we’re not handling rejections/errors.
Next we invoke doubleAfter2Seconds for the first time, passing in a value of 10. 
Two seconds later, the return value of 20 will be returned to the a variable.
We invoke doubleAfter2Seconds again, this time passing in a value of 20. Two seconds 
later, the return value of 40 will be returned to the b variable.
We invoke doubleAfter2Seconds one final time, this time passing in a value of 30. 
Two seconds later, the return value of 60 will be returned to the c variable.
Finally, we resolve our Promise with the value of 10 + 20 + 40 + 60 or 130.
When we put all of the code together, here’s what it looks like:
*/

function doubleAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x * 2);
        }, 2000);
    });
}

function addPromise(x) {
    return new Promise(resolve => {
        doubleAfter2Seconds(10).then((a) => {
            doubleAfter2Seconds(20).then((b) => {
                doubleAfter2Seconds(30).then((c) => {
                    resolve(x + a + b+ c);
                })
            })
        })
    });
}

/* Switching from Promises to Async/Await.
Awesome! Now lets see just how much easier we could write the above code with 
Async/Await! 
Remove the addPromise function, and create a new function named addAsync. This function
 will have the exact same purpose as our addPromise did. When you create your 
 addPromise function, make use of the async keyword. Here’s what that looks like:
async function addAsync(x) {
  // code here...
}
Now that you’ve created an async function, we can make use of the await keyword which 
will pause our code until the Promise has resolved. Here’s how   */
async function addAsyncWay(x) {
  const a = await doubleAfter2Seconds(10);
  const b = await doubleAfter2Seconds(20);
  const c = await doubleAfter2Seconds(30);
  return x + a + b + c;
}

// Init the server:
init();

// call the addPromise function.
addPromise(10).then((sumAll) => {
    console.log("The sum of all value is: " + sumAll);
});


// call the asyncAddWay function.
addAsyncWay(10).then((sumAll) => {
    console.log("Using async/await: The sum of all value is: " + sumAll);
});



