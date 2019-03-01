# Lab 2: Authentication

## Part 1: Database setup

Used a trigger that activates before insert or update on users table. This calls a function that salts and hashes the password before inserting it into the database.

The function ensures the password is being changed on update, to prevent the stored hash from being rehashed should any other column be updated instead.

