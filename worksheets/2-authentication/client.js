let secretkey = "abcdef";
let accesskey = "12345";

const crypto = require('crypto');
const fetch = require('node-fetch');

/* 
// UNCOMMENT TO GET PRODUCT BY ID
// GET PRODUCT BY ID
let url = "http://localhost:3000/api/getproductbyid";
let signature = generateSignature(accesskey, secretkey, ['1']);
let action = {
        method: "GET",
        headers: {"accesskey": accesskey, "signature": signature, "params": 1, "Content-Type": "application/json"}
}
*/

/*
// UNCOMMENT TO ADD A NEW PRODUCT
// ADD A NEW PRODUCT
let url = "http://localhost:3000/api/addproduct";
let signature = generateSignature(accesskey, secretkey, ['Bike', '199.00']);
let action = {
        method:"POST", 
        headers: {"accesskey": accesskey, "signature": signature, "Content-Type": "application/json"}, 
        body: JSON.stringify({title: "Bike", price:"199.00"})
}
*/

// function to generate the signature with HMAC using (accesskey, secretkey, payload[objects])
function generateSignature(akey, skey, payload = [''])
{
        // concatenate value for hashing
        key = akey + skey;
        payload.forEach(item => {
                key += item;
        });

        // generate hash with HMAC
        let hmac = crypto.createHmac('sha256', key);
        return hmac.digest('hex');
}

// fetch the request using the predefined variabales for URL and ACTION
fetch(url, action)
.then(checkStatus)
.then(response => response.json()) // convert to json
.then(response => console.log('Response: ', JSON.stringify(response)))
.catch(error => console.error('Error: ', error));

// function to check the client is connect to the server
function checkStatus(response) {
        // res.status >= 200 && res.status < 300
        if (response.ok) 
        {
                return response;
        } 
        else 
        {
                console.log("Error: " + response.statusText);
        }
};
     
