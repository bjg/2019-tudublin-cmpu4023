const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const open_port = 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next()
})

module.exports = {
    app,
    open_port,
} 