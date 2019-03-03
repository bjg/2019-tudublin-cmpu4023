require('isomorphic-fetch');
require('es6-promise').polyfill();
const crypto = require('crypto');

let secret_key = 'bsKHRjDCjcKXwrYuVBpiwq3Dg8K8woA4w7IbwrBe';
let access_key = 'fUjXnZr4u7x!A%D*';

let url = 'http://localhost:3000/products2';
//let url2 = 'http://localhost:3000/products2?title='+title;

//function that takes in a secret key and any parameters, if its undefined/null etc then it will be an empty array
function generateSignature(key, options){
  let value = options.forEach(option => {
    key += option;
  });

  //use sha256 encryption algorithm
  let hmac = crypto.createHmac('sha256', key);

  //return as hex string
  return hmac.digest('hex');
}

//signature with only secret key
let signature = generateSignature(secret_key, [access_key]);

//signature with secret key and query param
let signature2 = generateSignature(secret_key, [access_key, 'Test Product']);

//signature with secret key, query param and message body
let signature3 = generateSignature(secret_key, [access_key, 'Test Product', 'New Title']);

//fetch using just signature and param
fetch(
  url+"?title=Test Product",
  {
    method: "GET",
    headers: {"key": access_key, "signature": signature2},
  }
).then(response => response.json())
.then(response => console.log('Success:', JSON.stringify(response)))
.catch(error => console.error('Error:', error));

/*
//update prodcut by title using message body
fetch(
  url+"?title=Test Product",
  {
    method: "PUT",
    headers: {"key": access_key, "signature": signature3, "Content-Type": "application/json"},
    body: JSON.stringify({title: "New Title"})
  }
).then(response => response.json())
.then(response => console.log('Success:', JSON.stringify(response)))
.catch(error => console.error('Error:', error));
*/
