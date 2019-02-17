//  Max MacDonald
//  C15740661

module.exports = (sequelize, type) => {
    return sequelize.define('purchase', {
	  id: {
		type: type.INTEGER,
		primaryKey: true,           
		autoIncrement: true
	  },
	  name: type.STRING,
	  address: type.STRING,
	  state: type.STRING,
	  created_at: type.DATE,
	  zipcode: type.STRING,
    })
}