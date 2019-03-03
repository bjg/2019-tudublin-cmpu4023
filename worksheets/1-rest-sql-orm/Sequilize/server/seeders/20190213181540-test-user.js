'use strict';

module.exports = {
   up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users',
    [
      {email:"benwhite@email.com", password:"3abe3e825f6e749dca1b8193d5f15215", details:'"sex" => "M"', created_at: new Date()},
      {email:"OMalley.Conor@hotmail.com", password:"029761dd44fec0b14825843ad0dfface", created_at: new Date()},
      {email:"goatsareus@gmail.com", password:"ff9e460aaca39a2c3bbd68043047826a",details:'"sex" => "F"',created_at: new Date()}
    ],{});
  },  

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users',
    {
      email: [
        "test@email.com", 
        "another@email.com",
        "happyemail@email.com"
      ]
    });
  } 
};
