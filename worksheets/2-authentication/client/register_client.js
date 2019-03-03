// node register_client.js  username: test password: 1234

const axios = require('axios');

let register = (username, password) => {
    return new Promise ((resolve, reject) => {
        axios.post("http://localhost:3000/register", {
            "username":username,
            "password": password
        })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
}

register(process.argv[3], process.argv[5])
    .then(user => console.log(user))
