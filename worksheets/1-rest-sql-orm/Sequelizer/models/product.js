module.exports = (sequelize, type) => {
    return sequelize.define('product', {
	  id: {
		type: type.INTEGER,
		primaryKey: true,           
		autoIncrement: true
	  },
	  title: type.STRING,
	  price: type.DECIMAL,
	  tags: type.ARRAY(type.TEXT),
	  created_at: type.DATE,
	  deleted_at: type.DATE
    })
}