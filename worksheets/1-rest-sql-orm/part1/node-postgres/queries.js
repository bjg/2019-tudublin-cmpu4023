const massive = require('massive');

massive({
    user: 'me',
    host: 'localhost',
    database: 'pgguide',
    password: 'password',
    port: 5432,
  })

  const getUsers = (req, res) => {
    db.users.find({}).then(user => { res.json(console.log(user)) })
    }
