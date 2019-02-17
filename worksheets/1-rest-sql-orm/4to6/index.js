const express = require('express')
const app = express()
const port = 3000
const Sequelize = require('sequelize')

const sequelize = new Sequelize('pgguide', 'postgres', 'pass', {
	host: 'localhost',
	dialect: 'postgres',
	operatorsAliases: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
});

const Purchase = sequelize.define('purchase', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  created_at: Sequelize.DATE,
  name: Sequelize.CHAR,
  address: Sequelize.CHAR,
  state: Sequelize.CHAR,
  zipcode: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER
}, {
  timestamps: false
});

sequelize.get( '/student/:student_id/course/:course_id/subject/:subjectId', function(req, res, next) {
    Subjects.find({
        where: {
            'id': req.params.subjectId,
            'courses.id': req.params.course_id,
            'student_id.id': req.params.student_id
        },
        include: [{
            model: Courses,
            include: [{
                model: Student
            }]
        }]
    }).success(function(results) {
        console.log(results);
    });
});

// force: true will drop the table if it already exists
// User.sync({force: true}).then(() => {
//   // Table created
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
//   });
// });

Purchase.findAll().then(purchases => {
  console.log(purchases)
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))