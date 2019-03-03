/*
	Name: Robert Vaughan
	StudentNo: C15341261

	A simple command line based script that
	will take in user input to trigger certain requests
	to the exposed endpoints created as part of this lab.
*/

const readline = require("readline");
const fetch = require("node-fetch");
const assert = require("assert");
const crypto = require("crypto");

const options = "\n1 - JWT Login\n" +
				"2 - Get products (JWT)\n\n" +
				"3 - Create Secret Key\n" +
				"4 - Get Products(HMAC)\n" + 
				"5 - Post Products(HMAC)\n"

let token = "";

let secret_key = "";
let access_key = "";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


/*
	A command line menu to interact with the exposed
	API's created as part of the lab
*/
function readIn() {
	rl.question(options, (answer) => {
		
		answer = parseInt(answer);
		// TODO: Log the answer in a database
		if (answer > 0 && answer < 6) {
			switch(answer) {
			case 1:
				loginJWT();
				break;
			case 2:
				getProducts();
				break;
			case 3:
				createSecret();
				break;
			case 4:
				getProductsHMAC();
				break;
			case 5:
				postProductsHMAC();
				break;
			}
		}
		else {
			console.log("Invalid");
		}
	});

	readline.clearLine();
}

/*
	A login POST request that will return a
	JWT token that will be assigned to the
	Authenication header
*/
function loginJWT(){
	const url = "http://localhost:3000/user_auth_jwt";

	data = {
		"username": "rjwv",
		"password": "123456"
	};

	fetch(url, {
		method: "POST",
		mode: "cors",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json"
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		redirect: "follow",
		referrer: "no-referrer",
		body: JSON.stringify(data),
	}).then(function(response) {
		return response.json();
	}).then(function(data) {
		console.log(data);
		token = data.token;
		readIn();
	});
}

/*
	A login GET request that will return a
	a list of products. The validity of the 
	request is made via the Authorization that uses
	a JWT token to identify if the request made
	is from a valid and active user
*/
function getProducts() {
	const url = "http://localhost:3000/products_jwt";

	fetch(url, {
		method: "GET",
		mode: "cors",
		credentials: "same-origin",
		headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        redirect: "follow",
		referrer: "no-referrer"
	}).then(function(response) {
		if (response.status == 200) {
			return response.json();
		}
		else if (response.status == 401) {
			return {"error": "Not authenicated"};
		}
		else {
			return {"error": "<Vauge Javascript Error>"};
		}
	}).then(function(data) {
		console.log(data);
		readIn();
	});
}

/*
	A login POST request that gerenate a secret
	key via a Diffie Hellman protocol. Once the secret
	key is generated on the client side, the user
	can sign off on transactions using HMAC.
*/
function createSecret() {
	const url = "http://localhost:3000/secret_key";
	
	const client = crypto.createDiffieHellman(320);
	const clientKey = client.generateKeys();

	data = {
		"prime": client.getPrime().toString("base64"),
		"clientKey": clientKey.toString("base64"),
		"username": "rjwv",
		"password": "123456"
	}

	fetch(url, {
		method: "POST",
		mode: "cors",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json"
		},
		redirect: "follow",
		referrer: "no-referrer",
		body: JSON.stringify(data),
	}).then(function(response) {
		if (response.status == 200) {
			return response.json();
		}
		else {
			return {"error": "No such user"};
		}
	}).then(function(data) {
		if (data["error"] != null) {
			console.log("Error");
		}
		else {
			secret_key = client.computeSecret(data["second_key"], "base64").toString("base64").substr(0, 40);
			console.log("SECRET KEY");
			console.log(secret_key);
			access_key = data["access_key"];
		}
		readIn();
	});
}

/*
	A GET request that will return a list of products to an active
	user. To check if a user is active and valid, a HMAC is generated
	with an access key, a request header value and a timestamp of the current
	date. This token will be reconstructed on the server side with the same parameters
	and if both the client token and server token match, the user is active and valid.
*/
function getProductsHMAC() {
	const url = "http://localhost:3000/products_hmac";

	const type = "application/json";

	const time = new Date();

	const timestamp = (time.getDate() + (time.getMonth()+1) + time.getFullYear());

	hash = crypto.createHmac("sha1", secret_key).update(access_key + type.toString("base64") + timestamp).digest("base64");

	fetch(url, {
		method: "GET",
		mode: "cors",
		credentials: "same-origin",
		headers: {
			"Content-Type": type,
			"Authorization": "Bearer " + access_key + ":" + hash
		},
		redirect: "follow",
		referrer: "no-referrer"
	}).then(function(response) {
		if (response.status == 200) {
			return response.json();
		}
		else if (response.status == 401) {
			return {"error": "Not authenicated"};
		}
		else {
			return {"error": "<Vauge Javascript Error>"};
		}
	}).then(function(data) {
		console.log(data);
		readIn();
	}).catch(function(error) {
		console.log(error);
		readIn();
	});
}

/*
	A POST request that will return a list of products to an active
	user. To check if a user is active and valid, a HMAC is generated
	with an access key, a request header value, a timestamp of the current
	date and the body of the post request (JSON that is converted to a string).
	This token will be reconstructed on the server side with the same parameters
	and if both the client token and server token match, the user is active and valid
	and the new product is inserted into the DB.
*/
function postProductsHMAC() {
	const url = "http://localhost:3000/products_hmac_add";

	const type = "application/json";

	const data = {"title": "New Product", "price": "9.99"};

	if (secret_key != "" && access_key != "") {
		console.log(secret_key);
		console.log(access_key);
		const time = new Date();
		const timestamp = (time.getDate() + (time.getMonth()+1) + time.getFullYear());
		hash = crypto.createHmac("sha1", secret_key).update(access_key + type.toString("base64") + timestamp + data).digest("base64");

		fetch(url, {
			method: "POST",
			mode: "cors",
			credentials: "same-origin",
			headers: {
				"Content-Type": type,
				"Authorization": "Bearer " + access_key + ":" + hash
			},
			redirect: "follow",
			referrer: "no-referrer",
			body: JSON.stringify(data),
		}).then(function(response) {
			if (response.status == 200) {
				return response.json();
			}
			else if (response.status == 401) {
				return {"error": "Not authenicated"};
			}
			else {
				return {"error": "<Vauge Javascript Error>"};
			}
		}).then(function(data) {
			console.log(data);
			readIn();
		}).catch(function(error) {
			console.log(error);
			readIn();
		});
	}
	else {
		console.log("Login credentials required first");
		readIn();
	}
}

readIn();