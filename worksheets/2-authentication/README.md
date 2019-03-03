### Introduction

I broke this assignment into two parts, the first part with the JWT token authentication and then with the HMAC authentication. A brief description of each is below and then I will describe the endpoints created. The secret key and access key in this lab were assumed to be shared some way prior to these interactions.



#### JWT Authentication

A api_key table was created that has id, user_id, access_key and secret key columns. There is a login route that requires the username and password of the user to be posted. If this is not present an error is returned and a HTTP 401 error. If it is provided, the details are checked and if they are correct then the user's ID and an expiration are then passed as claims for JWT to generate a token. This is then sent back to the user.

There is a protected route that implements the requireAuth method that I created as Express middleware. This middleware is executed when every request is made and it will check to validity of the token and to make sure it is present. If it is then it will allow the user to continue. This token is sent in the Bearer HTTP header.



#### HMAC Authentication

This does not have a login step but instead a client that will take any body and query parameters, a timestamp and the access key and will use them in the HMAC algorithm to generate the signature. This is then sent to the server where it will do the same hash and compare the two. If they match then the user is allowed to enter.

Like with JWT, I wanted HMAC to be dynamically added to any route. For this it is implemented as Express middleware and it will dynamically check for body or query params when it is contructing the string to be hashed.



###Routes

**/login/jwt** - POST request that takes the username and password, checks it in the database and then returns a JWT for the user to use on other requests.

**/products/jwt** - GET request that implements my custom requireAuth middleware that will check for a JWT and will return the products if it is verified to be okay.

**/products/hmac** - GET request that will implement my custom hmacAuth middleware which dynamically checks the body and query params of the request and compares the signatures by using the access key sent to get the secret stored in the database.

**/login/hmac** - POST request that imitates a login that will take the username and password and check it against the database. This was done just to demonstrate how my middleware can be used to hash requests with bodies.



### Client

The client was written in Python and can be executed from the command line which will give the user the option to send a request to either of the above two hmac routes. **Note that the client was written in Python 3 and needs to be run with it in order to use the requests library.**



### Middleware

**requireAuth()** - This will get the Bearer token from the request headers by splitting it and getting the value after the "Bearer " word. It will then use the jwt library to verify this. If it is satisfactory then it will continue to the next middleware.

**hmacAuth()** - This is the middleware that will check for a signature and access token, respond appropriately if one or neither exist. It will then get todays date, and will concatenate any body params or query params with it. It will then hash that using the same sha256 algorithm with the secret key and will compare it with the value sent in the Signature header. If they match then the middleware continues to the next one if not it will return an error.





