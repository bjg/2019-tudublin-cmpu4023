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

	
	hmac = crypto.createHmac('sha1', secret);
	
	access_key = server_shared.key.slice(0,28);
	title = "New Game";
	price = "55";
	rating = "5.5";

	console.log("secret: " + secret.toString('base64'));
	console.log("access key: " + access_key);
	console.log("title: " + title);
	console.log("price: " + price);
	console.log("rating: " + rating);
	
	hmac.update(Buffer.from(access_key, 'base64') + title + price + rating);
	
	let signature  = hmac.digest('base64');
	
	console.log("Signature: " + signature);
	
	
	request.post("http://localhost:3000/hmac-video-games", {form:{access_key:access_key.toString('base64'), title:title, price:price, rating:rating, signature:signature.toString('base64')}}, (err, res, body)=>{
		console.log(body);
	})
});

