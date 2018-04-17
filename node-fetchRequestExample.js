const fetch = require("node-fetch");
const url =
"http://localhost:3000/Sugar/productdetail";
//"http://localhost:3000/ORD-2541/product";
//"http://localhost:3000/Julio/order";
//"http://localhost:3000/customer";
//"https://api.github.com/users/mitocode21"; 

fetch(url)
  .then((response) => {
    return response.text();   //return only the text part of the respose if response is in text.
    //return response.json(); //return only the json part of the respose if response is in json.
    //console.log(response);  // this alone, log the whole response with header, status, body,etc
  })
  .then((responseConverted) => {
      console.log(responseConverted);
  })
  .catch((error) => {
    console.log(error);
  })

/*
fetch(url)
  .then((res) => res.text()) //return only the text part of the respose if response is in text.
  //.then((res) => res.json()) //return only the json part of the respose if response is in json.
  .then((data) => console.log(data))
  .catch((error) => console.log(error))
*/
