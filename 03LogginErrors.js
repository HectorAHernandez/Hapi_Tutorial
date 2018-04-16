/*below an example of the use of logging.
As with any server software, logging is very important. hapi has some built in 
logging methods, as well as some basic capability for displaying these logs. */

'use strict';
const Hapi = require("hapi");

const server = Hapi.server ({  //create a Hapi server object
    port: 3000,
    host: 'localhost'
});

const request_1 = server.route({     // router when request for the home page.
    method: 'GET',
    path: '/',
    options: {     // this is to be able to include the option for
        log: {    // collecting or logging the "request's" error defined 
            collect: true    //in line # 47.
        }
    },
    handler: (request, h) => {
        return 'Hello, world!';
    }
});

const init = async () => {   // start the server and log that is running
    await server.start();
    console.log(`Server running at:  ${server.info.uri}`);
};

/* Built-in methods
There are two nearly identical logging methods, 
server.log(tags, [data, [timestamp]]), and request.log(tags, [data]), which 
are to be called whenever you want to log an event in your application. 
You'll want to call request.log() whenever in the context of a request, such 
as in a route handler, request lifecycle extension or authentication scheme. 
You'll want to use server.log() everywhere else, where you have no specific 
request in scope, for instance, just after your server has started or inside 
a plugin's register() method.
They both accept the same first two parameters. They are, tags and data.
tags is a string or array of strings used to briefly identify the event. 
Think of them like log levels, but far more expressive. For example, you could 
tag an error retrieving data from your database like the following:
server.log(['error', 'database', 'read']); */

server.log(['error','warning'], '*** Server Error ***');
//request_1.log(['error','warning'], '+++ Request Error +++');

/* Any log events that hapi generates internally will always have the hapi tag 
associated with them.
The second parameter, data, is an optional string or object to log with the 
event. This is where you would pass in things like an error message, or any 
other details that you wish to go along with your tags.
Additionally server.log() accepts a third timestamp parameter. This defaults 
to Date.now(), and should only be passed in if you need to override the 
default for some reason. 
*/

//process.on('unhandledRejection', (err) => {
//    console.log(err);
  //  process.exit(1);
//});

/* Retrieving and displaying logs
The hapi server object emits events for each log event. You can use the 
standard EventEmitter API to listen for such events and display them however 
you wish.*/
server.events.on('log', (event, tags) => {
    if (tags.error) {
        console.log(`--- Server error: ${event.error ? event.error.message : 'unknown'}`);
    }
});
//request_1.events.on('log', (event, tags) => {
//    if (tags.error) {
//        console.log(`--- Request error: ${event.error ? event.error.message : 'unknown'}`);
//    }
//});
/* Events logged with server.log() will emit a log event and events logged 
with request.log() will emit a request event.
You can retrive all logs for a particular request at once via request.logs. 
This will be an array containing all the logged request events. You must first
set the logs.collect option (see lines #16..19) to true on the route, otherwise this array 
will be empty. */

init();