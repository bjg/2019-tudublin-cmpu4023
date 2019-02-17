const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.app.get('db').users.find(
        {},
        {
            fields: ['email', "details"],
            order: [{
                field: 'created_at',
                direction: 'asc',
                nulls: 'last'
            }]
        }
    )
        .catch(err => { console.log('Failed to load users from DB'); })
        .then(items => {

            let users = items.map((ele) => {
                let email = ele.email;
                let details = ele.details;
                let sex = 'U'; // set to unknown sex as default
                if (details !== null){
                    let allDeets = details.split(',');
                    sex = allDeets[0].replace(/"/g, '').split('=>')[1];
                }

                return {email : email, sex: sex, created_at: ele.created_at};
            });
            res.send( JSON.stringify(users, null, 2) );
        });
});

router.get('/:id', (req, res) => {
    req.app.get('db').users.find(
        {
            id: req.params.id
        },
        {
            fields: ['email', "details"]
        }
    )
        .catch(err => { console.log('Failed to load users from DB'); })
        .then(items => {
            let users = items.map((ele) => {
                let email = ele.email;
                let details = ele.details;
                let sex = 'U'; // set to unknown sex as default
                if (details !== null){
                    let allDeets = details.split(',');
                    sex = allDeets[0].replace(/"/g, '').split('=>')[1];
                }

                return {email : email, sex: sex, created_at: ele.created_at};
            });
            res.send( JSON.stringify(users, null, 2) );
        });
});

module.exports = router;