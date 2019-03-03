## Worksheet 2 - AUTHENTICATION

> **NOTE:** Before running any of the node.js programs run the create.sql script to populate your db

### PART 1 - Hashed password authnetication 
For this part of the lab I initialised and configured and express app which connected to 
an external psql database using massive-js.
The application has the following routes


1. `GET /` - A simple login page promting a user to log in
2. `GET /login` - A intermediate route the users login credentials get passed through and authorizedd
3. `GET /products` - A protected page that can be accesses only if there is a user session


### PART 2 - JWT Token authentication

> **NOTE:** Really went into a lot of depth with this part, but at the end I have a piece of commented out code which is the simplified version of the whole app. Just a proof of concept

For this part of the worksheet I made a express.js  app which connects to massive.js and authenticates a user, generating a json web toke(JWT) and then storing it in local storage (session)

This part kind of follows on from Part 1:

1. First the user is prompted with a login page
2. After the user logs in he gets redirected to an intermediate route where he gets authenticated
3. If the user entered the correct log in credentials a JWT token is generated and stored in local storage (session) along with the userID  and the user is redirected to  /products

> **NOTE:** /products is protected by a middle ware function that looks for the jwt token in local storage. 
> **NOTE:** The middleware function will look for a token in the header fields if its not in session


### PART 3 - HMAC Authentication

> **NOTE:** This application is more proof of concept than a real life app

For this application I have a front end client which can send a message along with a HMAC(Hashed Message Authentication Code) and an access_key to the back end using the fetch API.
The back end then uses the access_key to extract the corresponding secret_key from the database and generates another HMAC from the message and the access_key.
If the new HMAC matches the old one then a status code of 200 is sent
IF the HMAC's dont match then 401 is sent back


