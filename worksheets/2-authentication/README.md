## Structure 

- Migrations - contains migrations for users and products tables, also installs pgcrypto before creating the user table
- Seeders - contains seeders for products tables
- Models - ORM folder
- Client - contains 3 clients, one for registering  a new user <b>(registerclient)</b>, one for searching for products with the category of 
            "food" <b>(access_protected_resource_client_with_query.js)</b> and one for adding a new product                                                   <b>(access_protected_resource_client_with_body.js)</b>
            

## How to run clients
The clients take in command line arguments to populate their data. Below shows sample commands on how to run each of them.
Note: Correct whitespacing in the commands is necessary

- registerclient(a client for registering a new user) - ```node register_client.js  username: test password: 1234```
- access_protected_resource_client_with_query.js (a client for search all products with the food category) - 
    
    ```node access_protected_resource_client_with_query.js  username: test password: 1234```

- access_protected_resource_client_with_body.js (a client for adding a new product) - 
    
    ```node access_protected_resource_client_with_body.js  username: test password: 1234```
  
  
 ## Question 1
 
 User is created in postman ....
 
<img width="233" alt="created" src="https://user-images.githubusercontent.com/23337553/53695653-32f88200-3db6-11e9-8452-fc467e7adf7e.png">

It is seen in postgres that the users password is salted ....

<img width="667" alt="salty" src="https://user-images.githubusercontent.com/23337553/53695667-59b6b880-3db6-11e9-80c8-063fd1cdb4bc.png">

... the user can still "login" however with the same password entered (not the salted one) ...

<img width="785" alt="login" src="https://user-images.githubusercontent.com/23337553/53695701-c03bd680-3db6-11e9-8b46-21d57764c149.png">


## Question 2

User can login with after registering, the login API will return a bearer token ...

<img width="792" alt="token" src="https://user-images.githubusercontent.com/23337553/53695813-2b39dd00-3db8-11e9-96f2-9bf9886db0f8.png">

This bearer token is to be set as in the authorization header of protected API so to access them e.g.

<img width="536" alt="products" src="https://user-images.githubusercontent.com/23337553/53695850-a1d6da80-3db8-11e9-9277-09fd12b68b5a.png">


## Question 3

New rows added to user table ...

<img width="514" alt="user columns" src="https://user-images.githubusercontent.com/23337553/53695890-f7ab8280-3db8-11e9-9aee-62866c30fde6.png">

## Question 4

Below shows a screenshot of the commands used to access the hmac route ...

<img width="960" alt="3" src="https://user-images.githubusercontent.com/23337553/53695992-558c9a00-3dba-11e9-9814-67bb2ab5b41d.png">

The process taking place in the "access_protected_resource_client_with_X" file is that the user firstly logins in.
When they login a the client key information is sent to the server and using DiffieHellmans the access and 
secret keys are made and stored/updated in the users table. 

<img width="949" alt="access" src="https://user-images.githubusercontent.com/23337553/53701442-48d96780-3df5-11e9-832b-a45f9896ccb3.png">

The shared_key is then sent back to the client 
where the clients access and seecret key are calculated. The clientSignature is then calculated which is the sent to
the ```/products_hmac``` route. This is where the server Signature is calculated and matched with the client. If it
is a match a 200 code is returned, else a 401 is returned.



