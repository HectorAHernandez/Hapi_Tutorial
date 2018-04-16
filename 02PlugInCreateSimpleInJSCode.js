/* Plugin: hapi has an extensive and powerful plugin system that allows you to very 
easily break your application up into isolated pieces of business logic,
and reusable utilities.

Creating a plugin: (This is inside the base directory ./testRoutePlugin.js).
Plugins are very simple to write. At their core they are an object with a 
register property, that is a function with the signature
 "async function (server, options)". Additionally the plugin object has a 
 required name property and several optional properties including version.
*/
'use strict';
const Hapi = require("hapi");

const server = Hapi.server ({  //create a Hapi server object
    port: 3000,
    host: 'localhost'
});


//Loading a plugin when initiating the server:
const init = async function() {
    //loading one plugin: testRoutePlugin, locate in the base directory.
    await server.register(require('./testRoutePlugin'));
/* we can load multiple plugins with below format:
await server.register([require('testRoutePlugin'), require('testRoutePlugin_2')]);
}; */

/* Normally, when the plugin is loaded it will create a GET route at /test. 
This can be changed by using the "prefix" setting in the options, which will 
prepend a string to ALL routes created in the plugin: Now when the plugin is 
loaded, because of the prefix option the GET route will be
 created at /plugins/test2: */
    await server.register(require('./testRoutePlugin_2'), {
        routes: {
            prefix: '/plugins'
        }
    });


    await server.start();
    console.log(`Server running at:  ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();   //start execution of the init function. 