# Lab 2: Authentication

## Part 1: Database setup

For the first part, the database simply consists of a users table with username and hashed_password, and a products table with product_id, name and price.

I used a trigger that activates before insert or update on users table to ensure all passwords are securely stored. This calls a function that salts and hashes the password before inserting it into the database. The plaintext password is never stored.

The function also ensures the password is being changed on update, to prevent the stored hash from being rehashed should any other column be updated instead.

## Part 2: JWT

For this part, I implemented two endpoints `/login` and `/products-jwt`. The products endpoint is protected, such that the user must first login and acquire a JWT before being able to access it.

### Login

Sending a post request to this endpont with a valid username and password will result in a JWT being generated with an expiry time of 12 hours. This token is signed with the server's private key, and returned to the client. If a user provides an incorrect username or password, a 400 is returned.

### Adding a product

For a client to add a product, they must provide a valid JWT. For it to be valid, it must have not expired, and be verified by the server by using its public key. If it is invalid, a 401 is returned. If it is valid, the new product is added based on the details provided in the request body and a 200 is returned. Should there be any error when inserting the product, a 400 is returned.

## Part 3 and 4: HMAC

Two new columns were added to the users table: access_key and secret_key. The access_key is used to uniquely identify a user, and the secret_key is used to hash any requests to confirm they are from that user.

### Client

I implemented a simple client for this using Go. To run it (after installing Go), use a command following this format:

`go run client.go <name> <price>`

The client creates a hash of the access key, jsonified product details and current timestamp, using the shared private key. This hash, along with the access key, timestamp and product details are then sent via POST request to the server.

### Server

The server has a single endpoint, `/products-hmac` which accepts POST requests to add a new product. Upon receiving a request, it looks up a corresponding private key for the provided access token, and creates a hash using the same format mentioned in the client section above. If this hash matches the hash sent by the client, then the new product is added and a 200 is returned. If the hash does not match, a 401 is returned. If there is an error during the insert, then a 400 is returned.

