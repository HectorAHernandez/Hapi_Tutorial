/*below an example of how to use Servers methods and caching the result, Server methods are a useful 
way of sharing functions by attaching them to your server object rather than 
requiring a common module everywhere it is needed. */

'use strict';
const Hapi = require("hapi");  // require the hapi module.

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

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

/* Assuming we have these two function: */
const addFunction1 = function (x, y) {
    console.log('Executed addFunction-1');
    return x + y;
};

const addFunction2 = function (x, y) {
    console.log('Executed addFunction-2');
    return (x + y) * 2;
};

/* There are two different ways to
call this function. You can call it with the signature 
server.method(name, method, [options])  Example; */

server.method('addServerMethod1', addFunction1, {}); /* where the option is empty.

Or you can call it with the signature server.method(method), where method is 
an object with name, method, and options parameters (note that you may also 
pass an array of these objects): Example: */

server.method({
    name: 'addServerMethod2', 
    method: addFunction2,
    options: {}
});     

/*
Name: 
The name parameter is a string used to retrieve the method from the server later, 
via server.methods[name] or server.methods.addServerMethod1. Note that if you 
specify a name with a "."" character, it is registered as a nested object rather 
than the literal string. As in: */ 
server.method('math.add', addFunction1);
/*
This server method can then be called via server.methods.math.add() line #77.

Function:
The method parameter is the actual function to call when the method is invoked. 
It can take any number of arguments. It can be an async function, for example:
const add = async function (x, y) {
    const result = await someLongRunningFunction(x, y);
    return result;
};
server.method('add', add, {});
Your server method function should return a valid result or throw an error if 
one occurs.
*/

init();

// Using the server.methods
var sum1 = server.methods.addServerMethod1(10, 15);
console.log ("Sum_1 is: "+ sum1);
var sum2 = server.methods.addServerMethod2(5, 45);
console.log ("Sum_2 is: "+ sum2);
var sum3 = server.methods.math.add(2, 6);
console.log ("Sum_3 is: "+ sum3);
