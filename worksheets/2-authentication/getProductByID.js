// dependencies
const crypto = require('crypto');
const fetch = require('node-fetch');

// user's hardcoded key values
const secretkey = "abcdef";
const accesskey = "12345";
const msgBody = "encoded message using HMAC";

const url = "http://localhost:3000/api/getproductbyid?id=2";
const signature = generateSignature(accesskey, secretkey, msgBody);

const payload = {
        method:"GET", 
        headers: {"accesskey": accesskey, "signature": signature, "msg": msgBody, "Content-Type": "application/json"}
}

// fetch the request using the predefined variables for URL and PAYLOAD
fetch(url, payload)
.then(checkStatus)
.then(response => response.json()) // convert to json
.then(response => console.log('Response: ', JSON.stringify(response)))
.catch(error => console.error('Error: ', error));

// #####################################################################################################
// FUNCTIONS - generateSignature, checkStatus
// #####################################################################################################

// function to generate the signature with HMAC using (accesskey, secretkey, body.msg)
function generateSignature(akey, skey, msgBody)
{
        // concatenate values for hashing
        key = akey + skey + msgBody;
        
        // generate hash_signature with HMAC
        let hmac = crypto.createHmac('sha256', key);
        return hmac.digest('hex');
}

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
     
