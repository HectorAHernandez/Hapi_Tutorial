/* Using the "inert" plugging to serve an static page  */

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
    await server.register(require('inert'));  /*add the inert plugging
                        to the hapi application */
    server.route({   /* router to display the static page hello.html. it
                tells the server to accept GET requests to /hello and reply
                with the static content on page hello.html file. 
                This route is defined after registering the inert plugin, because
                it is wise to run code that depends on a plugin after the plugin is 
                registered, just to make sure that the plugin exist when the code runs */
        method: 'GET',    
        path: '/hello',
        handler: (request, h) => {
            return h.file('./public/hello.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

/*inert will serve whatever content is saved to the hard drive when the 
request is made, which is what leads to this live reloading. This 
technique is commonly used to serve images, Stylesheet, and static pages
in a web application */