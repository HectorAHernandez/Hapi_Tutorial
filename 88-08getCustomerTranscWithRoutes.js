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
            else {
                wkFirstName = "* Not defined *";  // MUST THROW EXCEPTION FOR NOT FOUND ON CUSTOMER.
                wkLastName = "* Not defined *";   // MUST THROW EXCEPTION FOR NOT FOUND ON CUSTOMER.
                wkAge = 99999;                   // MUST THROW EXCEPTION FOR NOT FOUND ON CUSTOMER.
            }

        }
         //   console.log(`Id is ${wkId} First Name is ${wkFirstName} last name: ${wkLastName}`);
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
        //create the order literal object.
        var orderObject = [
            {custId: 1, ordId: 1, ordDate: "2015/02/01", ordStatus: "Delivered"},
            {custId: 1, ordId: 2, ordDate: "2015/02/02", ordStatus: "Cancelled"},
            {custId: 2, ordId: 3, ordDate: "2017/02/03", ordStatus: "In Progress"},
            {custId: 3, ordId: 4, ordDate: "2015/02/04", ordStatus: "Delivered"},
            {custId: 1, ordId: 5, ordDate: "2015/02/05", ordStatus: "Delivered"},
            {custId: 2, ordId: 10, ordDate: "2015/02/10", ordStatus: "Delivered"},
            {custId: 4, ordId: 7, ordDate: "2017/02/07", ordStatus: "In Progress"},
            {custId: 1, ordId: 6, ordDate: "2015/02/06", ordStatus: "In Progress"},
            {custId: 2, ordId: 8, ordDate: "2015/02/08", ordStatus: "In Progress"}
            ];
        
        var receivedParm = encodeURIComponent(request.params.customerParm); 
        // clean up the accumulator arrays:
        numOrderFound = 0;
        wkOrderId.length = 0;
        wkCustId.length = 0;
        wkOrderDate.length = 0;
        wkOrderStatus.length = 0;

        // select the orders for the customer received as parameter.
        for (let i in orderObject) {
            if (orderObject[i].custId == receivedParm) {
                wkCustId.push(orderObject[i].custId);                
                wkOrderId.push(orderObject[i].ordId);
                wkOrderDate.push(orderObject[i].ordDate);
                wkOrderStatus.push(orderObject[i].ordStatus);
                numOrderFound = numOrderFound + 1;
            } 
        }
 
        //console.log("numOrderFound: "+ numOrderFound +" Date length: " +  wkOrderDate.length + " wkOrderid lenght: " + wkOrderId.length)       
        
        //below is for double checking the content of one of the array created in lines 44 ...51.
        //for ( var i in wkCustId) {
        //     console.log("Array wkCustId(i): " + wkCustId[i]);
        // }; 

        var orderInText = [];          
        for (var i in wkCustId ) { /*create the order detail in format: { "atribute": value, 
        "attribute": value, "attribute": value } ({ orderId: wkOrdId(index), ... } this is
         what is called "Literal Object Notation" with this the string is not needed to be 
        built; because JSON format is native in JavaScript. ) */

            orderInText[i] = { customerId : wkCustId[i], orderId : wkOrderId[i], orderDate : wkOrderDate[i],
            orderStatus : wkOrderStatus[i] };
            
            //below log the content of each one of the fields in orderInText[i]
            //console.log("orderInText[i] is: " + "CustId: " + orderInText[i].customerId
            //                       + "  orderId: " + orderInText[i].orderId
            //                       + "  orderDate: " + orderInText[i].orderDate
            //                       + "  orderStatus: " + orderInText[i].orderStatus );
        }
      
        return {orderJson:     // this formats the function return with the JSON format as an STRING, 
               orderInText};   // orderJson: define the name of the JSON object and              
        }                      // orderText contains all the object created in line #69.
    });

  server.route({     // router when request for the product of a given order.
    method: 'GET',
    path: '/{orderParm}/product',
    handler: async (request, h) => {
        //create the order literal object.
        var productObject = [
            {orderId: 1, prodId: 1},
            {orderId: 1, prodId: 5},
            {orderId: 2, prodId: 1},
            {orderId: 2, prodId: 2},
            {orderId: 1, prodId: 2},
            {orderId: 3, prodId: 5},
            {orderId: 1, prodId: 4},
            {orderId: 2, prodId: 4},
            {orderId: 4, prodId: 4},
            {orderId: 5, prodId: 2},
            {orderId: 6, prodId: 4},
            {orderId: 5, prodId: 1},
            {orderId: 7, prodId: 4},
            {orderId: 10, prodId: 3},
            {orderId: 8, prodId: 3},
            {orderId: 3, prodId: 1}
            ];
        var detailObject = [
            {productId: 1, productName: "Sugar", price: 1.25 },
            {productId: 2, productName: "Papaya", price: 4.42 },
            {productId: 3, productName: "lemon", price: 0.25 },
            {productId: 4, productName: "Rice", price: 0.37 },
            {productId: 5, productName: "Bread", price: 0.15 }
            ];
                
        var receivedParm = encodeURIComponent(request.params.orderParm); 
        // clean up the accumulator arrays:
        numProductFound = 0;
        wkOrderIdProd.length = 0;
        wkProdId.length = 0;
        wkProdName.length = 0;
        wkProdPrice.length = 0;
        //console.log("--------- received parm: " + receivedParm );
        // select the product and the product detail for the order received as parameter.
        for (let i in productObject) {
            if (productObject[i].orderId == receivedParm) {
                wkOrderIdProd.push(productObject[i].orderId);                
                wkProdId.push(productObject[i].prodId);
                var detailFound = false;
                for (let j in detailObject) {
                    if (detailObject[j].productId == productObject[i].prodId){
                        wkProdName.push(detailObject[j].productName);
                        wkProdPrice.push(detailObject[j].price);
                        detailFound = true;
                        break;
                    }
                }
                if (!detailFound) {
                    wkProdName.push("** No Defined **");
                    wkProdPrice.push("** No Defined **");   
                }
                numProductFound = numProductFound + 1;
            } 
        }
 
        //console.log("numProductFound: "+ numProductFound +" wkProdId length: " +  wkProdId.length + " wkOrderIdProd lenght: " + wkOrderIdProd.length)       
        
        //below is for double checking the content of one of the array created in lines 44 ...51.
       // for ( var i in wkProdId) {
       //      console.log("Array wkProdId(i): " + wkProdId[i]);
       // }; 

        var productInText = [];          
        for (var i in wkOrderIdProd ) { /*create the order detail in format: { "atribute": value, 
        "attribute": value, "attribute": value } ({ orderId: wkOrdId(index), ... } this is
         what is called "Literal Object Notation" with this the string is not needed to be 
        built; because JSON format is native in JavaScript. ) */

            productInText[i] = { orderId : wkOrderIdProd[i], productId : wkProdId[i], productName : wkProdName[i],
            productPrice : wkProdPrice[i] };
            
            //below log the content of each one of the fields in productInText[i]
           // console.log("productInText[i] is: " + "OrderId: " + productInText[i].orderId
           //                        + "  prodId: " + productInText[i].productId
           //                        + "  prodName: " + productInText[i].productName
           //                        + "  prodPrice: " + productInText[i].productPrice );
        }
      
        return {productJson:     // this formats the function return with the JSON format as an STRING, 
                productInText};   // orderJson: define the name of the JSON object and              
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
            {productId: 4, productName: "Rice", price: 0.37 },
            {productId: 5, productName: "Bread", price: 0.15 }
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
      //console.log("0- Getting customers");
      const randomCustomer = Math.floor(Math.random() * 4) + 1;  //generate Random number between 1 and 4
      const url = serverUri+"/customer/"+randomCustomer;
      //const url = serverUri+"/customer/8";
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
          console.log("******** Customer Not found ***  " +reject_cust);
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
              resolve_order(response.text());  //resolve the promise with a response in text (but JSON format)
              //resolve_order(response.json());  
              //return response.text();   //return only the text part of the respose if response is in text.
              //return response.json(); //return only the json part of the respose if response is in json.
              //return respose;  // this alone, log the whole response with header, status, body,etc
            })
           // .then((responseConverted) => { //received what was returned in previous .then.
           //     console.log("promise order returned: " + responseConverted);
           //     resolve_order(responseConverted);              
           // })
            .catch((reject_order) => {     //catch any error with the promise processing.
                 console.log(reject_order);
            })
      }
     );
    return promiseOrder;
}

function orderProcessing(returnedOrder){
    // console.log("returnedOrder: " + returnedOrder); // displays the string format received.
     // below is if we want to processed the fields one by one: first convert to JavaScript object
     var order = JSON.parse(returnedOrder); /*conversion the string data into a JSON JavaScript object so that we
                              to be able to access the data using the attribute's name. example:
                               order.orderJson[0].orderId and order.orderJson[1].orderDate */
    
     let wkOrderId, wkCustomerId, wkOrderDate, wkOrderStatus  = " ";     
    
     //Loop the multiople objects javaScrip object to pull the properties of each object:
     order.orderJson.forEach(function(orderJson, index) {   
         //console.log('orderJson index '+ index );  //list the index of the object to be procssed
         Object.keys(orderJson).forEach(function(prop) { 
           /*  console.log(prop + " = " + orderJson[prop]); /* list each property in the object and it's value.
                                      this can be used to determinde the name of all the attributes in the object so that
                                      we can use them later, by saving name and values in temporary fields wkfieldname */
                  
             if (prop == "orderId") {   /* THIS save each property/attribute in temporary fields so that can be used later on. */
                 wkOrderId = orderJson[prop];
                // console.log("*** the orderId value is: " + wkOrderId);
             }
             else if (prop == "customerId") {
                     wkCustomerId = orderJson[prop];
                 }
                 else if (prop == "orderDate") {
                         wkOrderDate = orderJson[prop];
                     }
                     else if (prop == "orderStatus") {
                             wkOrderStatus = orderJson[prop];
                         }
                         else {
                             console.log("** other property/attribute: " + prop + " = " + orderJson[prop]);
                         }
         });
         // after getting all the propeties/attribute for a row or object, displays or use the values gathered:
         if (index == 0) {
            console.log('Following orders have been proccessed for customer '+ wkCustomerId );  
         }
         console.log(`** OrderId: ${wkOrderId}    Date: ${wkOrderDate}    Status ${wkOrderStatus}`); // process the order data.
  
    });
}  

function getProduct(order) {
    let promiseProduct = new Promise (
	    function (resolve, reject) {
            const url = serverUri+"/"+order+"/product";
            
            fetch(url)   // fetch returns a promise, that must be processed with the .then.
            .then((response) => {
              //console.log("promise product returned: " + response.text());  
              resolve(response.text());  //resolve the promise with a response in text (but JSON format)
            })
            .catch((reject) => {     //catch any error with the promise processing.
                 console.log(reject);
            })          
		}
	);
	return promiseProduct;
}

function productProcessing(returnedProduct){
     //console.log("returnedProduct: " + returnedProduct); // displays the string format received.
     // below is if we want to processed the fields one by one: first convert to JavaScript object
     var product = JSON.parse(returnedProduct); /*conversion the string data into a JSON JavaScript object so that we
                              to be able to access the data using the attribute's name. example:
                               product.productJson[0].productId and product.productJson[1].productDate */
    
     let wkproductId, wkorderId, wkproductName, wkproductPrice  = " ";    

     //Loop the multiople objects javaScrip object to pull the properties of each object:
     product.productJson.forEach(function(productJson, index) {   
         //console.log('productJson index '+ index );  //list the index of the object to be procssed
         Object.keys(productJson).forEach(function(prop) { 
           /*  console.log(prop + " = " + productJson[prop]); /* list each property in the object and it's value.
                                      this can be used to determinde the name of all the attributes in the object so that
                                      we can use them later, by saving name and values in temporary fields wkfieldname */
                  
             if (prop == "productId") {   /* THIS save each property/attribute in temporary fields so that can be used later on. */
                 wkproductId = productJson[prop];
                // console.log("*** the productId value is: " + wkproductId);
             }
             else if (prop == "orderId") {
                     wkorderId = productJson[prop];
                 }
                 else if (prop == "productName") {
                         wkproductName = productJson[prop];
                     }
                     else if (prop == "productPrice") {
                             wkproductPrice = productJson[prop];
                         }
                         else {
                             console.log("** other property/attribute: " + prop + " = " + productJson[prop]);
                         }
         });
         // after getting all the propeties/attribute for a row or object, displays or use the values gathered ( process the product data.):
         if (index == 0) {
              console.log('Following products included in order: '+ wkorderId );  
         }
         console.log(`** productId: ${wkproductId}   Name: ${wkproductName}    Price ${wkproductPrice}`);   
    });
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
  console.log("- The Customer Id: " + cust.customerJson.id +" Name: "+ cust.customerJson.firstName
            + " Last Name: " + cust.customerJson.lastName + " Age: "+ cust.customerJson.age); /*process the custmoer data: could 
            have multiple commands and at the end one that set up the "cust" key to be used in
                    the next function getOrders(cust)  */
  let returnedOrder = await getOrders(cust.customerJson.id); //execute getOrder promise function for the order in string.
  orderProcessing(returnedOrder);         
  
  //console.log("numOrderFound: "+numOrderFound);
  const randomOrder = Math.floor(Math.random() * numOrderFound) + 1;  //generate Random number between 1 and 4
  //console.log("randomOrder: "+randomOrder);
  //const parmOrderId = wkOrderId[2];   // manually select the order to search product for.
  const parmOrderId = wkOrderId[randomOrder - 1];   // randomly  select the order to search product for.  
  //console.log("parmOrderId: " +parmOrderId) ;
  let returnedProduct = await getProduct(parmOrderId); /* execute the getProduct promise to get the product associated to
                                       the order using the customer saved in wkCustId[0] array.*/
  productProcessing(returnedProduct);
  //console.log(`3- ** Product: for Order ${product.productJson.orderId} the product is ${product.productJson.prodId} `);

  /*
  let detail = await getProductDetail(product.productJson.prodId); // execute the getProductDetail promise to get the detail.
  console.log(`4- ** Product Detail: Name: ${detail.detailJson.productName} Price: ${detail.detailJson.price}`);
*/

}

// Init the server:
init();

//Initiate Global variables.
const serverUri = server.info.uri;  
var wkCustId = [];
var wkOrderId = [];
var wkOrderDate = [];
var wkOrderStatus = [];
var wkOrderIdProd = [];
var wkProdId = [];
var wkProdName = [];
var wkProdPrice = [];
var numOrderFound = 0;
var numProductFound = 0;


// execute the transaction for the cu88-08stomer: 
getCustomerTransction();


//})(); //this is the closing for the "(async function {" in line 5