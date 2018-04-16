/*below an example of the most basic server */

'use strict';
const Hapi = require("hapi");

const server = Hapi.server ({  //create a Hapi server object
    port: 3000,
    host: 'localhost'
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