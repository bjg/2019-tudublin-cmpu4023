module.exports = (sequelize, type) => {
    return sequelize.define('purchase_item', {
	  id: {
		type: type.INTEGER,
		primaryKey: true,           
		autoIncrement: true
	  },
	  price: type.DECIMAL,
	  quantity: type.INTEGER,
	  state: type.STRING
    })
}