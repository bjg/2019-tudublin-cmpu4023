const axios = require("axios");
const argv = require("minimist")(process.argv.slice(2));
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");

// Usage: node client.js -X METHOD -a KEY -s SECREY -d DATA; URL

axios(argv._[0], {
    method: argv.X.toLowerCase(),
    headers: { "Content-type": "application/json", authorization: token() },
    data: argv.d
})
    .then(res => console.log(res))
    .catch(error => console.log(error.response));

function token() {
    const data = `${argv._}${argv.d}${argv.a}`;
    const signature = CryptoJS.HmacSHA256(data, argv.s);
    return `HMAC-SHA256 Key=${argv.a} Signature=${Base64.stringify(signature)}`;
}