# Lab 2 - Enterprise app dev
## Question 1:
Users table with a username & hashed password field. Includes also a protected resource table (in the form of a products table).
![Image](worksheets/2-authentication/screenshots/1.0_users&protected_resources_table.PNG)

## Question 2: 
I created a login screen to demonstrate my (asynchronous) JWT implementation:
![Image](worksheets/2-authentication/screenshots/2.0_login_screen.PNG)  
This would take the username & password and pass them to the '/home' api end point. There they would be validated by hashing the passed in password and checking to see if there was any matching rows.<br/><br/>
If there was no match it would return a 401 status.  
![Image](worksheets/2-authentication/screenshots/2.0_login_failure.PNG)  
If there was a match a JWT would be generated for the user, the user directed to a home page and the status set to 200.</br>
The token would have the claims set to the user id and expiration timestamp (expiry time was set to 1 hour after creation).
### Token claims
![Image](worksheets/2-authentication/screenshots/2.0_jwt_claims.PNG)
### Token generation
![Image](worksheets/2-authentication/screenshots/2.1_token_generation.PNG)
### Home Screen
![Image](worksheets/2-authentication/screenshots/2.1_home_screen.PNG)
### Login success status
![Image](worksheets/2-authentication/screenshots/2.0_login_success.PNG)
</br></br>
In order to access the protected resource table however, the token had to be validated by verifying  client tokens as bearer tokens in a HTTP Authorization header field.  
Failure to do this would return a 401 response.
![Image](worksheets/2-authentication/screenshots/2.2_access_failure.PNG)
</br></br>
When the client token was validated the user was allowed access to the protected resource table (which in this case was a GET api end point that printed the contents of the 'products' table).
![Image](worksheets/2-authentication/screenshots/2.2_access_success.PNG)

## Question 3:
I created a seperate apikeys table which was linked to the users table by their id. This table had a 160-bit access key and 320-bit secret key inserted.
![Image](worksheets/2-authentication/screenshots/3.0_apikeys_table.PNG)

## Question 4:
### Code
![Image](worksheets/2-authentication/screenshots/4.0_code.PNG)
For the HMAC implementation, the user could only access the protected resource table if they provided the access key, secret key , username and password, (a message was optional).  
Failure to provide the correct values for any of these would return a 401 status.
### Wrong access key
#### Input
![Image](worksheets/2-authentication/screenshots/4.1_input.PNG)
#### Error
![Image](worksheets/2-authentication/screenshots/4.1_error.PNG)
### Wrong secret key (would result in different hashes derived from message and secret key)
#### Input
![Image](worksheets/2-authentication/screenshots/4.2_input.PNG)
#### Error
![Image](worksheets/2-authentication/screenshots/4.2_error.PNG)  
If correct values where passed in the user would be validated, status set to 200 and access to the protected resource table granted.
#### Input
![Image](worksheets/2-authentication/screenshots/4.3_input.PNG)
#### Output
![Image](worksheets/2-authentication/screenshots/4.3_output.PNG)
