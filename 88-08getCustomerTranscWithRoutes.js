'use strict';
const Hapi = require("hapi");
const fetch = require("node-fetch");

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

server.route({     // router when request for the customer.
    method: 'GET',
    path: '/customer',
    handler: async (request, h) => {
        let cust = await getCustomers(); 
        return `1- The Customer is ${cust}`;
    }
  });

  server.route({     // router when request for the order of a given customer.
    method: 'GET',
    path: '/{customer}/order',
    handler: async (request, h) => {
        let cust = encodeURIComponent(request.params.customer);
        let order = await getOrders(cust); 
        return `2- The order is ${order} for Customer ${cust}`;
    }
  });

  server.route({     // router when request for the product of a given order.
    method: 'GET',
    path: '/{order}/product',
    handler: async (request, h) => {
        let order = encodeURIComponent(request.params.order);
        let product = await getProduct(order); 
        return `3- The product is ${product} for order ${order}`;
    }
  });

  server.route({     // router when request for the product-detail of a given product.
    method: 'GET',
    path: '/{product}/productdetail',
    handler: async (request, h) => {
        let product = encodeURIComponent(request.params.product);
        let productDetail = await getProductDetail(product); 
        return `4- The product Detail is ${productDetail} for product ${product}`; 
    }
  });


const init = async () => {   // start the server and log that is running
    server.start();
    console.log(`Server running at:  ${server.info.uri}`);
};

// Handle any server error
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

/* Each promise represents one asynchronous operation, and we can chain them to
 guarantee a particular order of execution. Let's add a getOrders() 
Function that can find the orders for a specific customer, and chain it with 
getCustomers() promise. */
function getCustomers() {
  let promiseCustomer = new Promise (
    function (resolve_cust, reject_cust) {
      console.log("0- Getting customers");
    // Emulate an async server call here
    setTimeout(function () {
        let success = true;
      if (success) {
          resolve_cust("John Smith");   // got the customer successfully and we can pass all the data available
      } else {
          reject_cust("Can't get customers");
      }
    }, 2000);
  }
);
return promiseCustomer;
}

function getOrders(customer) {
  let promiseOrder = new Promise (
    function (resolve_order, reject_order) {
     // Emulate an async server call
     setTimeout(function () {
         let success = true;
       if (success) {
           resolve_order(`ORD-1233`);  //Got the order
       } else {
           reject_order("Can't get orders..");
       }
     }, 2000);
  }
);
return promiseOrder;
}

function getProduct(order) {
    let promiseProduct = new Promise (
	    function (resolve, reject) {
		   // Emulate an async server call
		   setTimeout(function () {
		       let success = true;
			   if (success) {
			       resolve(`Prod-ABC-Polimeter`);  //Got the product
			   } else {
			       reject("Can't get Product ..");
			   }
		   }, 2000);
		}
	);
	return promiseProduct;
}

function getProductDetail(product) {
    let promiseProductDetail = new Promise (
	    function (resolve, reject) {
		   // Emulate an async server call
		   setTimeout(function () {
		       let success = true;
			   if (success) {
                   resolve(`Pol-1 25 pound
                            Pol-2 10 pound`);  //Got the product detail
			   } else {
			       reject("Can't get Product Detail ..");
			   }
		   }, 2000);
		}
	);
	return promiseProductDetail;
}

async function getCustomerTransction() {
  let cust = await getCustomers();
  console.log("1- The Customer is " + cust); /*process the custmoer data: could have multiple commands
                     and at the end one that set up the "cust" key to be used in
                    the next function getOrders(cust)  */
  let order = await getOrders(cust); //execite getOrder promise function for the customer
  console.log(`2- The order is ${order} for Customer ${cust}`); // process the order data.
  let product = await getProduct(order); // execute the getProduct promise to get the product associated to the order.
  console.log(`3- The product is ${product} for order ${order}`);
  let productDetail = await getProductDetail(product); // execute the getProductDetail promise to get the detail.
  console.log(`4- The product Detail is ${productDetail} for product ${product}`);
}



// Init the server:
init();

// execute the transaction for the customer: 
getCustomerTransction();

/*
const fetch = require("node-fetch");
const url =
  "https://api.github.com/users/mitocode21";
   "http://localhost:3000/customer";
fetch(url)
  .then((response) => {
    return response.json();
  }).then((json) => {
      console.log(json);
    })
   .catch(error => {
    console.log(error);
  });

Second option
const fetch = require("node-fetch");
const url =
  "http://localhost:3000/customer";
fetch(url)
  .then(response => {
    response.json().then(json => {
      console.log(json);
    });
  })
  .catch(error => {
    console.log(error);
  });
*/