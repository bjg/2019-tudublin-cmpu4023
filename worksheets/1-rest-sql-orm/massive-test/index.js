var Massive=require("massive");
var connectionString = "postgres://postgres:Waldo1997@localhost/massive-test";
var db = Massive.connectSync({connectionString : connectionString});

var newUser = {
  email : "test@test.com",
  first : "Joe",
  last : "Test"
};

db.users.save(newUser, function(err,result){
  console.log(result);  
});