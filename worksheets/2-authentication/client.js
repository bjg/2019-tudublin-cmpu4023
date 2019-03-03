let secretkey = "abcdef";
let accesskey = "12345";

//let url = "http://localhost:3000/api/addproduct";
let url = "http://localhost:3000/api/getproductbyid";
const crypto = require('crypto');
const fetch = require('node-fetch');

//let signature = generateSignature(accesskey, secretkey, ['Bike', '199.00']);
let signature = generateSignature(accesskey, secretkey, ['1']);

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
        {
                method: "POST",
                headers: {"accesskey": accesskey, "signature": signature, "Content-Type": "application/json"},
                //body: JSON.stringify({title: "Bike", price:"199.00"})
                body: JSON.stringify({id: "1"})
        }
)
.then(checkStatus)
.then(response => response.json()) // convert to json
.then(response => console.log('Success: ', JSON.stringify(response)))
.catch(error => console.error('Error: ', error));

function checkStatus(response) {
        if (response.ok) { // res.status >= 200 && res.status < 300
            return response;
        } else {
            console.log("myError: " + response.statusText);
        }
};
     
/*
fetch(url, {method: "POST"})
.then(checkStatus)
.then(function(res){ return res.json(); })
//.then(res => console.log(res))
.then(res => console.log(res[0]))
.then(res => console.log('will not get here...'));
*/