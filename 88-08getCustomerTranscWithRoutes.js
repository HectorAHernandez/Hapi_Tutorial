'use strict';
const Hapi = require("hapi");
const fetch = require("node-fetch");

//(async function { 
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
    path: '/customer/{custId}',
    handler: async (request, h) => {
        //define the customer object, put logic to filter the customer id.
        var customerObject = [
            {id: 1, firstName: "John", lastName: "Gonzalez", age: 25 },
            {id: 2, firstName: "Peter", lastName: "Olson", age: 42 },
            {id: 3, firstName: "Carl",  lastName: "Bowen", age: 21 },
            {id: 4, firstName: "Julio", lastName: "Granderson", age: 33 }
             ];

        var wkId, wkFirstName, wkLastName, wkAge;
        wkId = encodeURIComponent(request.params.custId); 
        for (let i = 0; i < customerObject.length; i++) {
            if (customerObject[i].id == wkId ){
                wkFirstName = customerObject[i].firstName;
                wkLastName = customerObject[i].lastName;
                wkAge = customerObject[i].age;
                break;
            } 
        }
            console.log(`Id is ${wkId} First Name is ${wkFirstName} last name: ${wkLastName}`);
        // return the customer information as a json object:
        return { 
            customerJson: {
                "id": wkId,
                "firstName": wkFirstName,
                "lastName": wkLastName,
                "age": wkAge
          }
        };
    }
});

  server.route({     // router when request for the order of a given customer.
    method: 'GET',
    path: '/{customerParm}/order',
    handler: async (request, h) => {
        //define the order object, put logic to filter by customer id.
        var orderObject = [
            {custId: 1, ordId: 1, ordDate: "2015/02/19", ordStatus: "Delivered"},
            {custId: 2, ordId: 3, ordDate: "2017/02/19", ordStatus: "Delivered"},
            {custId: 3, ordId: 4, ordDate: "2015/02/19", ordStatus: "Delivered"},
            {custId: 4, ordId: 7, ordDate: "2017/02/19", ordStatus: "In Progress"}
            ];
        var wkCustId, wkOrderId, wkOrderDate, wkOrderStatus;
            wkCustId = encodeURIComponent(request.params.customerParm); 
            for (let i = 0; i < orderObject.length; i++) {
                if (orderObject[i].custId == wkCustId) {
                    wkCustId = orderObject[i].custId;
                    wkOrderId = orderObject[i].ordId;
                    wkOrderDate = orderObject[i].ordDate;
                    wkOrderStatus = orderObject[i].ordStatus;
                    break;
                } 
            }
            return { 
                orderJson: {
                    "custId": wkCustId,
                    "orderId": wkOrderId,
                    "orderDate": wkOrderDate,
                    "orderStatus": wkOrderStatus
                }
            };
        }
  });

  server.route({     // router when request for the product of a given order.
    method: 'GET',
    path: '/{orderParm}/product',
    handler: async (request, h) => {
        var productObject = [
            {orderId: 1, prodId: 1},
            {orderId: 2, prodId: 2},
            {ordIerd: 3, prodId: 3},
            {orderId: 4, prodId: 4}
            ];
        var wkOrderId, wkProdId;
            wkOrderId = encodeURIComponent(request.params.orderParm); 
            for (let i = 0; i < productObject.length; i++) {
                if (productObject[i].orderId == wkOrderId) {
                    wkOrderId = productObject[i].orderId;
                    wkProdId = productObject[i].prodId;
                break;
                } 
            }
            return { 
                productJson: {
                    "orderId": wkOrderId,
                    "prodId": wkProdId
                }
            };
    }
  });

  server.route({     // router when request for the product-detail of a given product.
    method: 'GET',
    path: '/{productParm}/detail',
    handler: async (request, h) => {
        var detailObject = [
            {productId: 1, productName: "Sugar", price: 1.25 },
            {productId: 2, productName: "Papayar", price: 4.42 },
            {productId: 3, productName: "lemon", price: 0.25 },
            {productId: 4, productName: "Rice", price: 0.37 }
            ];
        var wkProdId, wkProdName, wkProdPrice;
            wkProdId = encodeURIComponent(request.params.productParm); 
            for (let i = 0; i < detailObject.length; i++) {
                if (detailObject[i].productId == wkProdId) {
                    wkProdId = detailObject[i].productId;
                    wkProdName = detailObject[i].productName;
                    wkProdPrice = detailObject[i].price;
                break;
                } 
            }
            return { 
                detailJson: {
                    "productId": wkProdId,
                    "productName": wkProdName,
                    "price": wkProdPrice
                }
            };
        }
  });


const init = async () => {   // start the server and log that is running
    server.start();
    const serverUri = server.info.uri;
    console.log(`Server running at:  ${serverUri}`);
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
      const url = serverUri+"/customer/3";
      fetch(url)   // fetch returns a promise, that must be processed with the .then.
      .then((response) => {
        resolve_cust(response.json());
     /*  Below is another approach that I was using for learning. 
        return response.json(); //return only the json part of the respose object if response is in json.
         //return response.text(); // return only the text part of the response object.
         console.log("*** whole json: " + response);  /* response alone, display this in the 
                                  log [object Response] because it it the whole object with header, 
         status, body,etc, this when the response is a json object. if  */ 
      })
     /*.then((response_cust) => { //received what was returned in previous .then.
           console.log("the response_cust is: " + response_cust.customerJson.id);
           resolve_cust(response_cust); 
           // resolve_cust("1- Customer is John Smith");
     //    // return resolve_cust;
      }) 
      */
      .catch((reject_cust) => {     //catch any error with the promise processing.
          console.log(reject_cust);
         // return reject_cust;
      })
  }
);
return promiseCustomer;
}

function getOrders(customer) {
  let promiseOrder = new Promise (
    function (resolve_order, reject_order) {
          const url = serverUri+"/"+customer+"/order";
          fetch(url)   // fetch returns a promise, that must be processed with the .then.
          .then((response) => {
               resolve_order(response.json());
          })
          .catch((reject_order) => {     //catch any error with the promise processing.
               console.log(reject_order);
          })
    }
   );
  return promiseOrder;
}

function getProduct(order) {
    let promiseProduct = new Promise (
	    function (resolve, reject) {
            const url = serverUri+"/"+order+"/product";
            fetch(url)   // fetch returns a promise, that must be processed with the .then.
            .then((response) => {
                 resolve(response.json());
            })
            .catch((reject) => {     //catch any error with the promise processing.
                 console.log(reject);
            })
		}
	);
	return promiseProduct;
}

function getProductDetail(product) {
    let promiseProductDetail = new Promise (
	    function (resolve, reject) {
            const url = serverUri+"/"+product+"/detail";
            fetch(url)   // fetch returns a promise, that must be processed with the .then.
            .then((response) => {
                 resolve(response.json());
            })
            .catch((reject) => {     //catch any error with the promise processing.
                 console.log(reject);
            })
		}
	);
	return promiseProductDetail;
}

async function getCustomerTransction() {
  const cust = await getCustomers();
  console.log(`1- The Customer id is: ${cust.customerJson.id} 
            Name: ${cust.customerJson.firstName}
            Last Name: ${cust.customerJson.lastName}
            Age: ${cust.customerJson.age}`); /*process the custmoer data: could have multiple commands
                     and at the end one that set up the "cust" key to be used in
                    the next function getOrders(cust)  */
  
                    let order = await getOrders(cust.customerJson.id); //execite getOrder promise function for the customer
  console.log(`2- ** Order: for Customer ${cust.customerJson.id} order is ${order.orderJson.orderId}
            Date: ${order.orderJson.orderDate}`); // process the order data.
  
            let product = await getProduct(order.orderJson.orderId); // execute the getProduct promise to get the product associated to the order.
  console.log(`3- ** Product: for Order ${product.productJson.orderId} the product is ${product.productJson.prodId} `);
 
  let detail = await getProductDetail(product.productJson.prodId); // execute the getProductDetail promise to get the detail.
  console.log(`4- ** Product Detail: Name: ${detail.detailJson.productName} Price: ${detail.detailJson.price}`);
  
}

// Init the server:
init();
const serverUri = server.info.uri;  

// execute the transaction for the cu88-08stomer: 
getCustomerTransction();


//})(); //this is the closing for the "(async function {" in line 5