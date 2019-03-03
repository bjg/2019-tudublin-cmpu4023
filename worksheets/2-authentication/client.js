let secretkey = "abcdef";
let accesskey = "12345";

const crypto = require('crypto');
const fetch = require('node-fetch');


// GET PRODUCT BY ID
let url = "http://localhost:3000/api/getproductbyid";
let signature = generateSignature(accesskey, secretkey, ['1']);
let action = {
        method: "GET",
        headers: {"accesskey": accesskey, "signature": signature, "params": 1, "Content-Type": "application/json"}
}


/*
// ADD A NEW PRODUCT
let url = "http://localhost:3000/api/addproduct";
let signature = generateSignature(accesskey, secretkey, ['Bike', '199.00']);
let action = {
        method:"POST", 
        headers: {"accesskey": accesskey, "signature": signature, "Content-Type": "application/json"}, 
        body: JSON.stringify({title: "Bike", price:"199.00"})
}
*/


function generateSignature(akey, skey, objects = [''])
{
        key = akey + skey;
        objects.forEach(item => {
                key += item;
        });

        let hmac = crypto.createHmac('sha256', key);
        return hmac.digest('hex');
}

// fetch the request using the predefined variabales for URL and ACTION
fetch(url, action)
.then(checkStatus)
.then(response => response.json()) // convert to json
.then(response => console.log('Response: ', JSON.stringify(response)))
.catch(error => console.error('Error: ', error));

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
     
