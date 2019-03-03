# Lab02 - Authenication

## node_server

A node directory that runs the backend source of this lab on port 3000. This contains the following endpoints:

* POST - /user_auth_jwt
	* Logs in a user and generates a JWT token that is signed via a private key which is then fed back to the user.
* GET - /products_jwt
	* Returns a list of products if the users Auth Token can be decoded by the public key of the secret that signed the token and that all encoded data is valid (i.e. the token has not expired and the user ID exists)
* POST - /secret_key
	* Performs a Diffie Hellman exchange with a client if the clients credentials are valid. Therefore, both the client and server will have a generated 320 bit secret key and a 160 bit accesss key.
* GET - /products_hmac
	* The client contructs an auth token with a timestamp, access key and a HTTP header. This is then encoded via the previously generated secret key. When the server recieves the request, it too will generate a token using the same parameters and secret key as the client. If both tokens match, the user is valid and the products are returned.
* POST - /products_hmac_add
	* The client contructs an auth token with a timestamp, access key, a HTTP header and the request body. This is then encoded via the previously generated secret key. When the server recieves the request, it too will generate a token using the same parameters and secret key as the client. If both tokens match, the user is valid and new products is added to the database.

## node_client

A node directory that runs the client source that creates a command line interface. This contains the following functions that can be called via the readline menu:

* loginJWT()
	* Sends user credientials to a server and expects back a token that can be used for future authenications
* getProducts()
	* Requests to recieve products via the server with the aid of an auth token.
* createSecret()
	* Performs a Diffie Hellman exchange with a server. Therefore, both the client and server will have a generated 320 bit secret key and a 160 bit accesss key with a secret key that is never transmitted.
* getProductsHMAC()
	* The client contructs an auth token with a timestamp, access key and a HTTP header. This is then encoded via the previously generated secret key. When the server recieves the request, it too will generate a token using the same parameters and secret key as the client. If both tokens match, the user is valid and a list of products are recieved.
* postProductsHMAC
	* The client contructs an auth token with a timestamp, access key, a HTTP header and the request body. This is then encoded via the previously generated secret key. When the server recieves the request, it too will generate a token using the same parameters and secret key as the client. If both tokens match, the user is valid and new product (sent within the POST body) is added to the database.

## db.sql

An SQL script that creates the necessary DB tables for Part 1 and Part 3.