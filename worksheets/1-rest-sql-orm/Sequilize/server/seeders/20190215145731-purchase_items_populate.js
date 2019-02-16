'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchase_items',
    [
      //purchase_id:integer,product_id:integer,price:decimal,quantity:integer,state:string
      {purchase_id: "1001",product_id:"18",price:"30.00",quantity:"3",state:"On Route"},
      {purchase_id: "1002",product_id:"19",price:"30.00",quantity:"1",state:"On Route"},
      {purchase_id: "1003",product_id:"20",price:"720.00",quantity:"6",state:"Delivered"},
    ],{});
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('purchase_items',
    {
      purchase_id:[
        "1001",
        "1002",
        "1003"
      ]
    })
  }
};
