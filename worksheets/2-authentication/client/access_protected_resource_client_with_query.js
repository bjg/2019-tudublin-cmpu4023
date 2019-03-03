// 4c (query)
// node access_protected_resource_client_with_query.js  username: test password: 1234

const axios = require('axios');
const crypto = require('crypto');

const username = process.argv[3];
const password = process.argv[5];

const DOMAIN = "http://localhost:3000";
const QUERY = "category=food";

let login = (username, password, prime, generator, key) => {
    return new Promise ((resolve, reject) => {
        axios.post(DOMAIN + "/login", {
            "username":username,
            "password": password,
        },{
            "headers":{
                "Prime": prime, 
                "Generator": generator,
                "Key": key
            }
        })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
}

let getHmacProductsWithCategoryFood = (jwtToken, accesskey, signature, serversecret) => {
    return new Promise((resolve, reject) => {
        axios.get(DOMAIN + "/products_hmac?" + QUERY,{
            "headers": {
                "Authorization" : "bearer " + jwtToken,
                "AccessKey":  accesskey,
                "ClientSignature": signature,
                "ServerSecret": serversecret
            }
        })
        .then(res => resolve(res.data))
        .then(err => reject(err))
    })
}

const client = crypto.createDiffieHellman(320);
const clientKey = client.generateKeys()

login(username, password, client.getPrime().toString('base64'), client.getGenerator().toString('base64'), clientKey.toString('base64'))
    .then(data => {

        const secret = client.computeSecret(data.server_key, 'base64').toString('base64')
        const accesskey = data.server_key.slice(0, 28)

        const clientSignature = crypto.createHmac("md5", secret)
                    .update(QUERY + accesskey)
                    .digest("base64");


        getHmacProductsWithCategoryFood(data.token, accesskey, clientSignature, data.server_secret)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
