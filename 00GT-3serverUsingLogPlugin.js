/*A common desire when creating any web application, is an access log.
 To add some basic logging to our application, let's load the 
 hapi pino plugin. Let's install the module from npm to get started:
npm install hapi-pino */

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

server.route({   // router for when GET request for a name as a variable.
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {
        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
    }
});

const init = async () => {   // start the server and log that is running
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: false,
            logEvents: ['response']
        }
    });
    
    await server.start();
    console.log(`Server running at:  ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();   //send execution of the init function. 