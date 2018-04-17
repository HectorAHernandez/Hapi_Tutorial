/* This Example need that the server be up and running in another instance of Visual 
Studio Code, the server is found at:
C:\Okkralabs\HapiTutorial\MyFirstProject\88-08getCustomerTranscWithRoutes.js */

const fetch = require("node-fetch");
const url =
"http://localhost:3000/Sugar/productdetail";
//"http://localhost:3000/ORD-2541/product";
//"http://localhost:3000/Julio/order";
//"http://localhost:3000/customer";
//"https://api.github.com/users/mitocode21"; 

fetch(url)   // fetch returns a promise, that must be processed with the .then.
  .then((response) => {
    return response.text();   //return only the text part of the respose if response is in text.
    //return response.json(); //return only the json part of the respose if response is in json.
    //console.log(response);  // this alone, log the whole response with header, status, body,etc
  })
  .then((responseConverted) => { //received what was returned in previous .then.
      console.log(responseConverted);
  })
  .catch((error) => {     //catch any error with the promise processing.
    console.log(error);
  })

/*
fetch(url)
  .then((res) => res.text()) //return only the text part of the respose if response is in text.
  //.then((res) => res.json()) //return only the json part of the respose if response is in json.
  .then((data) => console.log(data))
  .catch((error) => console.log(error))
*/
// Another example:
const url2 =
  "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";
fetch(url2)      // fetch returns a promise, that must be processed with the .then.
  .then((response) => {
      response.json()  //returns only the json part of the response to be use later in jsonResp 
    .then((jsonResp) => {
      console.log(
        `City: ${jsonResp.results[0].formatted_address} -`,
        `Latitude: ${jsonResp.results[0].geometry.location.lat} -`,
        `Longitude: ${jsonResp.results[0].geometry.location.lng}`
      );
    });
  })
  .catch(error => {
    console.log(error);
  });
