const axios = require("axios");
const argv = require("minimist")(process.argv.slice(2));
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");

/*
Example command:
    node client.js 
    -X POST 
    -a accessKeyIsForBatman 
    -s theSecretKeyForBatmanWithinTheUsersTable 
    -d '{"id":6,"model":"Golf","make":"Volkswagen","year":2015,"price":14000}' 
    http://localhost:3000/cars
*/
axios({
    url: argv._[0],
    method: argv.X.toLowerCase(),
    headers: { "Content-type": "application/json", "Authorization": token() },
    data: argv.d
})
.then(res =>  {
    console.log(res.status);
})
.catch(error => {
    console.log(error);
});

function token() {
    const data = `${argv._}${argv.d}${argv.a}`;
    const signature = CryptoJS.HmacSHA256(data, argv.s);
    return `HMAC-SHA256 Key=${argv.a} Signature=${Base64.stringify(signature)}`;
}