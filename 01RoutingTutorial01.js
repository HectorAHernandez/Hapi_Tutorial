
'use strict';
const Hapi = require("hapi");

const server = Hapi.server ({  //create a Hapi server object
    port: 3000,
    host: 'localhost'
});

/* Routing
This tutorial is compatible with hapi v17
When defining a route in hapi, as in other frameworks, you need three 
basic elements: the path, the method, and a handler. These are passed to
 your server as an object, and can be as simple as the following:
*/
server.route({     // router when request for the home page.
  method: 'GET',
  path: '/',
  handler: (request, h) => {
      return 'Hello, world!';
  }
});
/*Method: The route above responds to a GET request to / with the string
 Hello!. The method option can be any valid HTTP method, or an array of
 methods. Let's say you want the same response when your user sends either 
 a PUT or a POST request, you could do that with the following:  */
server.route ({
    method: ['PUT','POST'],
    path: '/',
    handler: function (req, res) {
        return 'This is the response from PUT or POST method';
    }
});

/* Path: the path option must be a string, though it can contain named 
parameters. To name a parameter in a path, simply wrap it with {}. example: */
server.route({
    method: 'GET',
    path: '/hello/{user}',
    handler: function (req, res) {
        return `hello ${encodeURIComponent(req.params.user)}!!`;
    }
});
/*As you can see above, we have the string {user} in our path, which
 means we're asking for that segment of the path to be assigned to a 
 named parameter. These parameters are stored in the object req.params 
 within the handler. Since we named our parameter user we are able to 
 access the value with the property request.params.user, after URI 
 encoding it so as to prevent content injection attacks. 
 
 Optional parameters:
 in the above example, the uer parameter is required: thi means, a request
 to /hello/bob or /hello/susan will work, but a request to /hello will not.
 In order to make a parameter optional, put a question mark at the end of
 the parameter's name. See below: */
 server.route({
     method: 'GET',
     path: '/car/{make?}',
     handler: function (req, res) {
         const carMake = req.params.make ?
               encodeURIComponent(req.params.make) : 'Not Indicated';
         return `Car make is: ${carMake}!!!`;
     }
 });
 /* Now a request to /car/Lexus will reply with "Car make is: Lexus!!!" and a request to 
 just /car will reply with "Car make is: Not Indicatted!!!". It is important to be aware that
  only the last named parameter in a path can be optional. That means that 
  /{one?}/{two}/ is an invalid path, since in this case there is another parameter 
  after the optional one. You may also have a named parameter covering only part 
  of a segment of the path for instance /{filename}.jpg is valid. You may also 
  have multiple parameters per segment provided there is non-parameter separtor 
  between them, meaning /{filename}.{ext} is valid (because the . is a
  non-parameter separator); whereas /{filename}{ext} is not..  */

  /* Multi-segment parameters
Along with optional path parameters, you can also allow parameters that match 
multiple segments. In order to do this, we use an asterisk and a number. For example: */
server.route({
    method: 'GET',
    path: '/hello/{user*3}',
    handler: function (req, res) {
        const userParts = req.params.user.split('/');
        return `Hello ${encodeURIComponent(userParts[0])} ${encodeURIComponent(userParts[1])}
                ${encodeURIComponent(userParts[2])}!!!`;
    }
});
/* With this configuration, a request to /hello/john/doe/amparo/ will reply with the string 
Hello john doe amparo!. The important thing to note here is that the user parameter is 
actually the string "john/doe/amparo". That's why we did a split on that character 
to get the two separate parts. The number after the asterisk represents how many 
path segments should be assigned to the parameter. You can also omit the number
entirely, and the parameter will match any number of segments available. Like the 
optional parameters, a wildcard parameter (for example /{files*}) may only appear 
as the last parameter in your path.

When determining what handler to use for a particular request, hapi searches paths 
in order from most specific to least specific. That means if you have two routes, 
one with the path /filename.jpg and a second route /filename.{ext} a request to 
/filename.jpg will match the first route, and not the second. This also means that 
a route with the path /{files*} will be the last route tested, and will only 
match if all other routes fail. 

Handler method
The handler option is a function that accepts two parameters, request, and h.
The request parameter is an object with details about the end user's request, 
such as path parameters, an associated payload, authentication information, 
headers, etc. Full documentation on what the request object contains can be found 
in the API reference.

The second parameter, h, is the response toolkit, an object with several methods 
used to respond to the request. As you've seen in the previous examples, if you 
wish to respond to a request with some value, you simply return it from the 
handler. The payload may be a string, a buffer, a JSON serializable object, a 
stream or a promise.
Alternatively you may pass the same value to h.response(value) and return that 
from the handler. The result of this call is a response object, that can be 
chained with additional methods to alter the response before it is sent. For 
example h.response('created').code(201) will send a payload of created with an 
HTTP status code of 201. You may also set headers, content type, content length, 
send a redirection response, and many other things that are documented in the API
 reference.

 Config
Aside from these three basic elements, you may also specify an options parameter 
for each route. This is where you configure things like validation, authentication, 
prerequisites, payload processing, and caching options. More details can be found 
in the linked tutorials, as well as the API reference.
Here we will look at a couple of options designed to help generate documentation.
*/
server.route({
    method: 'GET',
    path: '/pet/{petName?}',
    handler: function (request, h) {
        const wkPetName = request.params.petName ?
              encodeURIComponent(request.params.petName) : 'no pet';
        return `Hello ${wkPetName}!`;
    },
    options: {
        description: 'Say hello',
        notes: 'The pet name parameter defaults to \'no pet\' if unspecified',
        tags: ['api', 'greeting']
    }
});
/* Functionally speaking these options have no effect, however they can be very 
valuable when using a plugin like lout to generate documentation for your API. 
The metadata is associated with the route, and becomes available for inspection 
or display later. */

const init = async () => {   // start the server and log that is running
    server.start();
    console.log(`Server running at:  ${server.info.uri}`);
};

// Handle any server error
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

// Initiate server running:
init();