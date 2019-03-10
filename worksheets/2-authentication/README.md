## Creating users with encrypted passwords
A form is used to get username and password, and then encrypted with the `crypt()` function in PostgreSQL.
####Form
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/1-register.png "/")

####Result
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/1-result.png "/")

####Table contents
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/1-table.png "/")

---

## Implementing JWT
#### When a user is created, token is also created that lasts 24 hours
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/2-jwtsign.png "/")

#### A mechanism to verify client tokens as bearer tokens in a HTTP Authorization header field
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/2-bearer-function.png "/")

#### Postman was used to put data in the header and test
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/2-login.png "/")

#### Accessing a proteced URL
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/2-protected-token.png "/")

#### Updating table through protected URL 
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/2-update-table.png "/")
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/2-update.png "/")

---

## Extending table to include Access and Secret Keys
####Added columns to store these two new values
![alt text](https://github.com/yitchee98/2019-tudublin-cmpu4023/blob/C15390501-wks-2/worksheets/2-authentication/3-tables.png "/")

