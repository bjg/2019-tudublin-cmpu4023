CREATE TABLE Users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL,
  password text NOT NULL,
  access_key text NOT NULL,
  secret_key text NOT NULL
);

CREATE TABLE Products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  Pname text NOT NULL
);

insert into Users(username, password, access_key, secret_key) values ('Thomas2898', crypt('password1234', gen_salt('bf', 8)), 'y$B&E)H@McQfTjWnZr4t', '2666981AA193C2259B3D833F18DE1');

insert into Products(Pname) values ('Book1');
insert into Products(Pname) values ('Book2');
																						   
select * from users;	

--y$B&E)H@McQfTjWnZr4t

--2d8bcc1e2c8e441912a3e014fa0d97a29aaff53e322e2e518e886239b97904c9