let secretkey = "abcdef";
let accesskey = "12345";

const crypto = require('crypto');
const fetch = require('node-fetch');


// GET PRODUCT BY ID
let url = "http://localhost:3000/api/getproductbyid";
let signature = generateSignature(accesskey, secretkey, ['1']);
let display = {
                method: "GET",
                headers: {"accesskey": accesskey, "signature": signature, "params": 1, "Content-Type": "application/json"}
                //,
                //params: {"id": "1"}
        }


/*
// ADD A NEW PRODUCT
let url = "http://localhost:3000/api/addproduct";
let signature = generateSignature(accesskey, secretkey, ['Bike', '199.00']);
let add = {
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


fetch(
        url, 
        //add
        display
        /*
        {
                method: "POST",
                headers: {"accesskey": accesskey, "signature": signature, "Content-Type": "application/json"},
                //body: JSON.stringify({title: "Bike", price:"199.00"})
                body: JSON.stringify({id: "1"})
        }
        */
)
.then(checkStatus)
.then(response => response.json()) // convert to json
.then(response => console.log('Response: ', JSON.stringify(response)))
.catch(error => console.error('Error: ', error));

function checkStatus(response) {
        if (response.ok) { // res.status >= 200 && res.status < 300
            return response;
        } else {
            console.log("myError: " + response.statusText);
        }
};
     
