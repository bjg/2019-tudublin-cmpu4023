const crypto = require('crypto');
const request = require('request');

const client = crypto.createDiffieHellman(320);
const client_key = client.generateKeys();


request.post("http://localhost:3000/hmac-key", {form:{key:client_key.toString('base64'), prime:client.getPrime().toString('base64'),
 gen: client.getGenerator().toString('base64'), username:"me", password:"mypass"}, json:true}, (err, res, server_shared) => {

	if(err){
		console.log("Error, failed to connect");
		return;
	}
	
	const secret = client.computeSecret(server_shared.key, 'base64');
	console.log("secret: " + secret.toString('base64'));
	console.log("secret length: " + secret.toString('base64').length);
});