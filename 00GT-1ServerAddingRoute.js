/*below an example of the most basic server with two routes */

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
    path: '/{name}',  // {name} define a varialbe to hold the name in the path.
    handler: (request, h) => {
        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
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

init();