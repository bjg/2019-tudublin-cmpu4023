const crypto = require('crypto');
const request = require('request');

// VALID KEYS
const access_key = '4313396EE85C7E8466883FE4A39BEDC0F0EE1C44BA123';
const secret_key = '1847AB149BB3BDE88F33865DDF5BAEE6C2A0B9261DD2D39D53B1931F03486EEA785783239913FADD';

// INVALID KEYS
// const access_key = '6413396EE85C7E8466883FE4A39BEDC0F0EE1C44BA15A';
// const secret_key = '2347AB149BB3BDE88F33865DDF5BAEE6C2A0B9261DD2D39D53B1931F03486EEA785783239913FAEE';

const hmac = crypto.createHmac('sha256', secret_key);
const message = "I am a new product";

console.log("secret key: " + secret_key);
hmac.update(access_key + message);
const signature  = hmac.digest('hex');
console.log("access key: " + access_key);
console.log("message: " + message);
console.log("Signature: " + signature);
console.log("Response\n");
request.post("http://localhost:3000/hmac/", {form:{access_key:access_key, message:message, signature:signature}}, (err, res, body)=> {
    console.log("Status: " + res.statusCode);
    console.log("Message: " + body);
});