module.exports = (sequelize, type) => {
    return sequelize.define('user', {
	  id: {
		type: type.INTEGER,
		primaryKey: true,           
		autoIncrement: true
	  },
	  email: type.STRING,
	  password: type.STRING,
	  details: type.HSTORE,
	  created_at: type.DATE,
	  deleted_at: type.DATE
    })
}