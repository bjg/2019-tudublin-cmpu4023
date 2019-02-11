'use strict';

//in the sequelize -cli    
// sequelize db:migrate


module.exports = {
  up: (queryInterface, Sequelize) => {

    Promise.all( [
      queryInterface.renameColumn('tablename1','oldname','newname'),
      queryInterface.renameColumn('tablename2','oldname','newname'),
      queryInterface.renameColumn('tablename3','oldname','newname'),

    ]);

  },

  down: (queryInterface, Sequelize) => {
    //reverting if something goes wrong
    Promise.all( [
      queryInterface.renameColumn('tablename1','newname','oldname'),
      queryInterface.renameColumn('tablename2','newname','oldname'),
      queryInterface.renameColumn('tablename3','newname','oldname'),
     

    ]);



  }
};
