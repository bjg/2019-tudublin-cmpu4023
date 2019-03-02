var http = require('http');
const express = require('express');

var Ofuda = require('ofuda');
var hmac = new Ofuda({
    headerPrefix: 'hmac',
    hash: 'sha1',
    serviceLabel: 'HMAC',
    debug: true
}); // can change the serviceLabel to HMAC

// Known credentials by the user - these can be stored in an environment variable also  
var credentials = {
    accessKeyId: 'AK7AEGX2CB5ZL5VQ3UZ7',
    accessKeySecret: 'h8IFhXWnRO3ySWRSlMIzzQW008Wue9PsQCCVSFJW'
}; // these are known to the client


//request header info
http_options = {
    host: 'localhost',
    port: 3000,
    path: '/hmac/products',
    method: 'GET',
    params: {
        id: 1
    },
    headers: {
        'Content-Type': 'application/json',
        'Content-MD5': 'ee930827ccb58cd846ca31af5faa3634', //not sure bout this
        'accessid': credentials.accessKeyId,
        'id': 1


    }
};

console.log('------------- hmac creating client method ----------')
signedOptions = hmac.signHttpRequest(credentials, http_options); // appends a hmac authorisation header to the request

//request is sent from the client with the credentials signed by HMAC
var req = http.request(signedOptions, function (res) {
    //this will print out the response
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
})

req.end();
