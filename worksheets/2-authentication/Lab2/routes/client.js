const http = require('http');


let Ofuda = require('ofuda');
let hmac = new Ofuda({
    headerPrefix: 'hmac',
    hash: 'sha1',
    serviceLabel: 'HMAC',
    debug: true
});

// Hardcoded user credentials  
let credentials = {
    accessKeyId: 'PeShVmYq3t6w9z-CqF)H',
    accessKeySecret: '_F-JaNdRgUkXp2s5v8x_r4u7xyA5DXG-KaPdSgUk'
}; // These credentials are known to the client and the server

// Set the HTTP options including the header
http_options = {
    host: 'localhost',
    port: 3001,
    path: '/hmac/products',
    method: 'GET',
    params: {
        id: 1
    },
    headers: {
        'Content-Type': 'application/json',
        // 'Content-MD5': 'ee930827ccb58cd846ca31af5faa3634',
        'accessid': credentials.accessKeyId,
        'id': 1
    }
};

// Appends request with HMAC header
signedOptions = hmac.signHttpRequest(credentials, http_options); 

// The request is sent from the client with the header appended
var req = http.request(signedOptions, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (body) {
        console.log('BODY: ' + body);
    });
})

req.end();