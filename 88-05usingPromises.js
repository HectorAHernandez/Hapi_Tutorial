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

/* What is a Promise?
In JavaScript, a Promise represents the eventual result of an asynchronous 
operation. Think of it as a placeholder. This placeholder is essentially 
an object on which we can attach callbacks.
Our Promise can have one of three states:
Pending — Asynchronous operation has not completed yet
Fulfilled — Operation has completed and the Promise has a value
Rejected — Operation has completed with an error or failed.
A promise is settled if it is not pending. Once a Promise has settled, it is 
settled for good. It cannot transition to any other state.

Working With Promises
Most of the time when working with Promises, you will be consuming 
already-created promises that have been returned from functions. However, 
you can also create a promise with it’s constructor.
Here’s what a simple Promise might look like:

runFunction().then(successFunc, failureFunc);
In the above example, we first invoke the runFunction() function. Since
runFunction() returns a promise, only when the Promise is settled can our
successFunc, or failureFunc function run. If the Promise is Fulfilled, our 
sucessFunc is invoked. If the Promise fails, our failureFunc is invoked.*/ 
function delay(t) {
    return new Promise(function(resolve){
        return setTimeout(resolve, t)
    });
}

function logHi (){
    console.log('Hi after two seoncds!');
}

/* Chaining Promises
One of the main benefits of Promises is that they allow us to chain 
asynchronous operations together. This means we can specify subsequent 
operations to start only when the previous operation has succeeded. 
This is called a Promise Chain. Here’s an example:*/
function promiseChain() {
return new Promise(function(resolve, reject) {
    setTimeout(() => resolve(1), 2000);
}).then((result) => {
  //  alert(result);
  console.log("Result(0): " + result);
  result += 2;
  console.log("Result(1): " + result);  
  return result;
  }).then((result) => {
  //  alert(result);
  result += 2;
  console.log("Result(2): " + result);  
  return result;
}).then((result) => {
  //  alert(result);
  result += 2;
  console.log("Result(3): " + result);  
  return result;
});
}

/* Above I’ve created a simple .catch() that will take the returned error 
message and log it to the console. Lets add in error handling to the previous example now.
Below, there are only two changes. After the second .then() I’ve added in
an error and an error message. I’ve also added our .catch() to the end of
the chain. What do you expect to happen when this code is run:*/
function promiseChainThrowError() {
return new Promise(function(resolve, reject) {
    setTimeout(() => resolve(1), 2000);
  
  }).then((result) => {
  //  alert(result);
    return result + 2;
  }).then((result) => {
    throw new Error('FAILED HERE');
 //   alert(result);
    return result + 2;
  }).then((result) => {
 //   alert(result);
    return result + 2;
  }).catch((e) => {
    console.log('error: ', e)
  });
}

/* Here’s what happens:

Our Promise resolves after 2 seconds with a value of 1
This value is passed to the first .then() and alerted to the screen. 2 is added and a new value of 3 is passed to the second .then()
A new Error is thrown. Execution stops immediately and the Promise resolves to a rejected state.
.catch() receives our error value and logs it to the screen. Here’s what it looks like in the console:
*/

// Init the server:
init();

// call the delay() function to execute logHi.
delay(2000).then(logHi);

promiseChain().then((response) => {
    console.log("*** Total for *** first Result: " + response);
});

promiseChainThrowError().then((respose) => {
    console.log("the respose received is: " + response);
})