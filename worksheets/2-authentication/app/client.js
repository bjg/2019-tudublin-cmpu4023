var crypto = require("crypto");
var request = require('request');

const accessKey = 'u8x!A%D*G-KaPdSgVkYp';
const secretKey = 'y$B&E)H@McQfThWmZq4t5v8y/B?E(H+MbQeShVmY';

let message = 'letters';

var hashedKey = crypto.createHmac('sha384', secretKey).update(message).digest('hex');

request({
	url: 'http://127.0.0.1:3000/hmac',
	method: 'POST',
	json: { hashedkey: hashedKey, accesskey: accessKey, message: message }
}, function(error, response, body){
	console.log(response.statusCode);
	console.log(body);
});