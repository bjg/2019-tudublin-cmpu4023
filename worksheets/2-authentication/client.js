const fetch = require("isomorphic-fetch");
const crypto = require('crypto');

const accesskey = "user1publickey";
const secretkey = "user1privatekey";


/**
 * 
 * @param {body} a optional parameter that is set to {} if nothing is provided 
 * @param {params} a optional parameter that is set to {} if nothing is provided 
 * 
 * The secretkey, body, params and accesskey is all hashed using Hmc sha256 hashing algorithm
 */
function HmacCrypt(body = "{}", params = "{}") {
    var hmac = crypto.createHmac('sha256', secretkey);
    hmac.update(secretkey + body + params + accesskey);
    var signature = hmac.digest('hex');
    return signature
}
/**
 * API call to get products. Acceskey and the signature is sent in the header
 */
fetch("http://localhost:3002/products", {
        method: "GET",
        headers: {
            "accesskey": accesskey,
            "signature": HmacCrypt()
        }
    }).then(response => response.json()).then(result => console.log(result))
    .catch(err => console.log(err));



/**
 * API call to Post a product. Acceskey and the signature is sent in the header. The body is stringified and then passsed to the HmacCrypt 
 * alogrithm. 
 */
const bodyContent = JSON.stringify({
    "id": 6,
    "name": "This is a test 2",
    "price": 6.32
});

fetch("http://localhost:3002/products", {
    method: "POST",
    headers: {
        "accesskey": accesskey,
        "signature": HmacCrypt(bodyContent),
        "Content-Type": "application/json"
    },
    body: bodyContent,
}).then(response => response.json()).then(result => console.log(result)).catch(err => console.log(err));


/**
 * API call to Post a product. Acceskey and the signature is sent in the header. The body is stringified and then passsed to the HmacCrypt 
 * alogrithm alongside pramValue. 
 * 
 */

const paramValue = {
    "id": 6
};

const bodyContent = JSON.stringify({
    "name": "Updating...",
    "price": 6.333
});

fetch("http://localhost:3002/products/6", {

    method: "PUT",
    headers: {
        "accesskey": accesskey,
        "signature": HmacCrypt(bodyContent, paramValue),
        "Content-Type": "application/json"
    },
    body: bodyContent,
}).then(response => response.json()).then(result => console.log(result)).catch(err => console.log(err));