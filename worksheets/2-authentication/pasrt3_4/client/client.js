const request = require('request');
const crypto = require('crypto');

var access_key = ']$fJ#QYai!3xAK8y>|gb'
var secret_key = 'f9)=}cl$0=h$[InY2;s=k$p%C#0zSj{)7-]BdbKf'
var message = 'test message'
var toBeHashed = access_key + message
var hmac = crypto.createHmac('sha256', secret_key).update(toBeHashed).digest('hex');

request.post('http://localhost:3000/products', {json: {access_key, message, hmac}}, function (error, response, body) {
  console.log('body:', body)
})