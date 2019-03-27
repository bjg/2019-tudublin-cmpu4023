const crypto = require('crypto');
require('isomorphic-fetch');
require('es6-promise').polyfill();
//Keys
let secret_key = 'GLnpCFAQg/CUTKuz4ALnhN5mBA5hpJfxRbPmTMSg';
let access_key = 'AKIAJPXS2RV2PRKG2YHA';
let url = 'http://localhost:3000/products2';

//Generate Signature
function generateSignature(k, opt){
  let value = opt.forEach(option => {
    k += option;
  });
  //sha256 algorithm
  let hmac = crypto.createHmac('sha256', k);
  return hmac.digest('hex');
}
//Signaturess
let signature = generateSignature(secret_key, [access_key]);
//Secret key and query
let signature2 = generateSignature(secret_key, [access_key, 'Product']);
//Secret key, query and message
let signature3 = generateSignature(secret_key, [access_key, 'Product', 'Title']);

//Fetch 
fetch(
  url+"?title=Product",
  {
    method: "GET",
    headers: {"key": access_key, "signature": signature2},
  }
).then(response => response.json())
.then(response => console.log('Success:', JSON.stringify(response)))
.catch(error => console.error('Error:', error));