## Part 1
API endpoint /register created which will register a user and store credentials into the account table.
Along with storing the credentials a public and secret key is also stored (as part of part 3).
The protected resource for this labs demonstration will be the products table from pgguide table used in previous lab.

### Register user

curl -X POST \
  http://localhost:3000/register \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 3506b0d9-e151-4c32-bb3e-26e78856f2fa' \
  -H 'cache-control: no-cache' \
  -d '{
	"username": "abdul-ismail",
	"password": "123456"
}'

response:
registered

### Signing in to obtain token

The user can then login with those credentials and if login is successful then a token will be returned to the user.
The token will last for 24hrs and includes the users username.
For other steps I also return the public_key and secret_key, these should not be sent like this but doing it this way as its more convenient for later steps

curl -X POST \
  http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: daa326d5-6c4d-43ec-a669-30e13eb2342c' \
  -H '_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZHVsIiwiaWF0IjoxNTUwNTAyNjA5LCJleHAiOjE1NTA1ODkwMDl9.IRxer9-kdTSHFf0t_AB0Zxl6p7TFFJdeDuxYyw_Gs90' \
  -H 'cache-control: no-cache' \
  -d '{
	"username": "abdul-ismail",
	"password": "123456"
}'

resppose:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZHVsLWlzbWFpbCIsImlhdCI6MTU1MTU0MjA4MCwiZXhwIjoxNTUxNjI4NDgwfQ.GQtCDbMQhWb8JGnCDiQmm-t0lAmjd9df3nryQofhHjc",
    "message": "Logged in succesfully",
    "public_key": "1111",
    "secret_key": "2222"
}




## part 2
For this part I demonstrate how the token obtained after successfully signing can be used to authenticate the user.
The API endpoint /products/jwt demonstrates authentication using token which is sent as a field in the header.
The API takes in a product title and will search the product db to returning matching products.

### Requesting protected resource with valid token

curl -X GET \
  http://localhost:3000/products/jwt \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 8e073b6c-a629-4872-bb42-09fe8a277289' \
  -H '_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZHVsLWlzbWFpbCIsImlhdCI6MTU1MTU0MjA4MCwiZXhwIjoxNTUxNjI4NDgwfQ.GQtCDbMQhWb8JGnCDiQmm-t0lAmjd9df3nryQofhHjc' \
  -H 'cache-control: no-cache' \
  -d '{
"title": "Python Book"
}'

response:
[
    {
        "id": 2,
        "title": "Python Book",
        "price": "29.99",
        "created_at": "2011-01-01T20:00:00.000Z",
        "deleted_at": null,
        "tags": [
            "Book",
            "Programming",
            "Python"
        ]
    }
]

### Requesting protected resource with invalid token

curl -X GET \
  http://localhost:3000/products/jwt \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: c71915c9-e52a-48eb-8472-364f8c622bd9' \
  -H '_token: eyJhbGciOiJIUsI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZHVsLWlzbWFpbCIsImlhdCI6MTU1MTU0MjA4MCwiZXhwIjoxNTUxNjI4NDgwfQ.GQtCDbMQhWb8JGnCDiQmm-t0lAmjd9df3nryQofhHjc' \
  -H 'cache-control: no-cache' \
  -d '{
"title": "Python Book"
}'

respose:
{
    "name": "JsonWebTokenError",
    "message": "invalid algorithm"
}




## Part 3
This part was done along with part 1, The table has a field for public_key and secrey_key. Upon user registration the fields are stored with the corresponding values.

### Part 4
The APi endpoint /products/hmac demonstrates hmac authentication.
The protected resource in this step is the same as used for part 2.
Client.js generates a hash based on the secret_key and title of product the user wants to search for.
The public_key and signature is sent is header fields. The title is of the product the user is requesting is alo send as part of the body.
Once API is called, the secret_key is retrieved based on the public_key that was sent in the header, if not public_key exists then 401 error will be sent.
If secret_key is found, a new hash is generated using the secret_key and the body content. If the generated hash matches the signature that was sent then
we know the data was not corrupted and user can be authenticated.


### Valid signature example and public_key example

curl -X GET \
  http://localhost:3000/products/hmac \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: db8ba803-be1a-4395-8415-43c0c29818e6' \
  -H 'cache-control: no-cache' \
  -H 'public_key: KStP-Jo2VNMktnPbvTZeUGbiey4=' \
  -H 'signature: da88d66e0b404c863c8324b24042f9bacd7ab932d4ac242aa5ce5a5b256ce774' \
  -d '{
"title": "Python Book"
}'

response:
[
    {
        "id": 2,
        "title": "Python Book",
        "price": "29.99",
        "created_at": "2011-01-01T20:00:00.000Z",
        "deleted_at": null,
        "tags": [
            "Book",
            "Programming",
            "Python"
        ]
    }
]

### Invalid public key example

curl -X GET \
  http://localhost:3000/products/hmac \
  -H 'Content-Type: app lication/json' \
  -H 'Postman-Token: 1475bf8c-d250-4915-aad9-5f23218aa161' \
  -H 'cache-control: no-cache' \
  -H 'public_key: 111111' \
  -H 'signature: 3094ef2979d83ea1731d8586a340c720c4b247290b88e01d80864b3bdd7525e6' \
  -d '{
"title": "Python Book"
}'

response:
Unauthenticated

### Invalid signature example

curl -X GET \
  http://localhost:3000/products/hmac \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 1a587535-cf0c-4c4d-ba1d-30a5677ad3e4' \
  -H 'cache-control: no-cache' \
  -H 'public_key: 1111' \
  -H 'signature: 3094ef29783ea1731d8586a340c720c4b247290b88e01d80864b3bdd7525e6' \
  -d '{
"title": "Python Book"
}'

response:
Unauthenticated
