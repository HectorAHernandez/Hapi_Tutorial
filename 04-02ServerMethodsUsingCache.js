/*below an example of how to use Servers methods and caching the result.
Caching: 
A major advantage of server methods is that they may leverage hapi's native 
caching. The default is to not cache, however if a valid configuration is 
passed when registering the method, the return value will be cached and served 
from the cache instead of re-running your method every time it is called. */

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

/* Assuming we have this function: */
const addFunction1 = function (x, y) {
    const result =  x + y;
    console.log('Executed addFunction-1');
    return result;
};

function doubleAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Executed function doubleAfter2Seconds');
            resolve(x * 2);
        }, 2000);
    });
}

function doubleAfterFiveSeconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Executed function doubleAfterFiveSeconds');
            resolve(x * 2);
        }, 5000);
    });
}

//Now that you’ve created an async function, we can make use of the await keyword which 
//will pause our code until the Promise has resolved. Here’s how   */
async function addAsyncWay(x) {
  const a = await server.methods.MethodAfter2Sec(10);
  const b = await server.methods.MethodAfter2Sec(30);
  const c = await server.methods.MethodAfter2Sec(10);
  return x + a + b + c;
}

/* There are two different ways to
call this function. You can call it with the signature 
server.method(name, method, [options])  Example; */

server.method('addServerMethod1', addFunction1, {
    cache: {
        expiresIn: 1,
        generateTimeout: 100
    }
}); /* where the option is contains the cache definition. */

server.method('MethodAfter2Sec', doubleAfter2Seconds, {
    cache: {
        expiresIn: 6000,
        generateTimeout: 100000
    }
}); /* where the option is contains the cache definition. */

/* Parameter definition and last example:
The configuration looks like the following:

server.method('add', add, {
    cache: {
        expiresIn: 60000,
        expiresAt: '20:30',
        staleIn: 30000,
        staleTimeout: 10000,
        generateTimeout: 100
    }
});
The parameters mean:
expiresIn: relative expiration expressed in the number of milliseconds since 
           the item was saved in the cache. Cannot be used together with expiresAt.
expiresAt: time of day expressed in 24h notation using the 'HH:MM' format, at 
           which point all cache records for the route expire. Uses local time. 
           Cannot be used together with expiresIn.
staleIn: number of milliseconds to mark an item stored in cache as stale and 
         attempt to regenerate it. Must be less than expiresIn.
staleTimeout: number of milliseconds to wait before returning a stale value 
            while generateFunc is generating a fresh value.
generateTimeout: number of milliseconds to wait before returning a timeout 
            error when it takes too long to return a value. When the value is 
            eventually returned, it is stored in the cache for future requests.
segment: an optional segment name used to isolate cache items.
cache: an optional string with the name of the cache connection configured on 
        your server to use.

More information on the caching options can be found in the API Reference 
as well as the documentation for catbox.

You can override the ttl (time-to-live) of a server method result 
per-invocation by setting the ttl flag. Let's see how this works with the 
earlier example:
*/
const add = async function (x,  flags) {
    const result = await doubleAfterFiveSeconds(x);
    flags.ttl = 5 * 60 * 1000; // 5 mins
    console.log("Result from add: " + result);
    return result;
};

server.method('add', add, {
    cache: {
        expiresIn: 3000,
        generateTimeout: 100000
    }
});


init();

// Using the server.methods
var sum1 = server.methods.addServerMethod1(10, 15);
console.log ("Sum_1 is: "+ sum1);
var sum2 = server.methods.addServerMethod1(10, 15);
console.log ("Sum_2 is: "+ sum2);

// call the asyncAddWay function.
addAsyncWay(10).then((sumAll) => {
    console.log("Using async/await: The sum of all value is: " + sumAll);
});

server.methods.add(5);
server.methods.add(5);
server.methods.add(15);