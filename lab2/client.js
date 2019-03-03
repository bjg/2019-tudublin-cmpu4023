var http = require('http');
const crypto = require('crypto');
const queryString = require('query-string');



// These two keys are hardcoded but if you want to go full try-hard when the user registers you can send the two keys to the client somehow.
// But effort of that as it wasn't asked so I grabbed existing keys from the database
// Taken from the database users table ---> user Baz

// secretkey also known as the private key only the client and server have access to this --> third party don't have access
let secretkey = "07d3a4f771f3b9c13f7493aff8356a95749944b7ab59f3c036c081663c9855d6707a5f931b5c";

// accesskey also know as the public key --> we send this to the server --> so the server knows which user it's dealing with
let accesskey = "099b4169d4986e68b8163a2c91ec1ccbc697d4a5a60d157db00009b1d3f2ff8dce0d53a5b289";

// We will encrypt our message using the secretkey 
let cipher = crypto.createCipher('aes192', secretkey);

// This is the message we will encrypt and send to the server
let message = "Baz thinks this lab was hard.";

// This is our encrypted message
let encryptedMsg = cipher.update( message , 'utf8', 'hex');
encryptedMsg += cipher.final('hex');

// Randomise the request message signature to guard against replay attacks -- by adding timestamp
let query = "request=" + encryptedMsg + Date.now() + "&accesskey=" + accesskey;

// sign the signature with the secret key
let signature = crypto.createHmac("sha256", secretkey).update(query).digest("hex");


// https://nodejs.org/api/http.html  <--- most of the code from below came from here 


// For Buffer reqBody, the content-length header is Buffer.byteLength
const postData = queryString.stringify({
  'msg': encryptedMsg
});


var options = {
    host   : 'localhost',
    port   : 3000,
    method : 'POST',
    path   : "/access/?" + query,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(postData),
		'Public-Key': accesskey,
		'X-Signature': signature
	}
};



var req = http.request(options, function(res) {
	
  // handle the response
  console.log('\nSTATUS: ' + res.statusCode);
 // console.log('HEADERS: ' + JSON.stringify(res.headers));
  
  res.setEncoding('utf8');
  
  res.on('data', function (chunk) {
    console.log('\nServer response: ' + chunk);
  });
  
});


// write data which is our encrypted message to request body
req.write(postData);

// finish
req.end();




/* 
http.get({
    port: 3000,
    path: "/test/?" + query,
    headers: {
        "X-Signature": signature
    }
}, function (res) {
    console.log(res.statusCode);
}); */