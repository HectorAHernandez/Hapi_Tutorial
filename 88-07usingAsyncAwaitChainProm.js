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
          resolve_cust("1- Customer is John Smith");   // got the customer successfully and we can pass all the data available
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
           resolve_order(`2- Found the order 1233 for ${customer}`);  //Got the order
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
			       resolve(`3- Product ABC for the order `);  //Got the product
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
			       resolve(`4- Found Product detail for the product `);  //Got the product detail
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
  console.log(cust); /*process the custmoer data: could have multiple commands
                     and at the end one that set up the "cust" key to be used in
                    the next function getOrders(cust)  */
  let order = await getOrders(cust); //execite getOrder promise function for the customer
  console.log(order); // process the order data.
  let product = await getProduct(order); // execute the getProduct promise to get the product associated to the order.
  console.log(product);
  let productDetail = await getProductDetail(product); // execute the getProductDetail promise to get the detail.
  console.log(productDetail);
}

// Init the server:
init();

// execute the transaction for the customer: 
getCustomerTransction();


