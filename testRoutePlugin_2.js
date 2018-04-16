/* Plugin: hapi has an extensive and powerful plugin system that allows you to very 
easily break your application up into isolated pieces of business logic,
and reusable utilities.

Creating a plugin: (This is inside the base directory ./testRoutePlugin.js).
Plugins are very simple to write. At their core they are an object with a 
register property, that is a function with the signature
 "async function (server, options)". Additionally the plugin object has a 
 required name property and several optional properties including version.
A very simple plugin looks like:*/
'use strict';
const testRoutePlugin_2 = {
    name: 'testRoutePlugin_2',
    version: '1.0.0', 
    register: async function (server, options) {
        // for example the code for creating a router
        server.route({
            method: 'GET',
            path: '/test2',
            handler: function (request, h) {
                return 'hello world, using Simple Plugin_2!!';
            }
        });
        // etc ...
        //  await someAsyncMethods();
    }
};

module.exports = testRoutePlugin_2; // export the module to be used by other program