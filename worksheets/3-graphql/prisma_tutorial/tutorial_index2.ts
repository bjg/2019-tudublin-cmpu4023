import { prisma } from './generated/prisma-client'
/*

This is the first part of the tutorial. 
https://www.prisma.io/docs/get-started/01-setting-up-prisma-new-database-TYPESCRIPT-t002/#configure-your-prisma-api
I wanted to keep it as reference/
See index.ts for updated

*/

// A `main` function so that we can use async/await
async function main() {

  //createUser('Steve');
  findAllUsers();
  userListWhere();

}


async function createUser(name){
 // Create a new user called `name`
 const newUser = await prisma.createUser({ name: name })
 console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`)
}


async function findAllUsers(){
    // Read all users from the database and print them to the console
    const allUsers = await prisma.users()
    console.log(allUsers)
}

async function findUser(_id){
    const user = await prisma
    .user({ id: _id })
    console.log(user);
}

async function userListWhere(){
const usersCalledAlice = await prisma
  .users({
    where: {
      name: 'Alice'
    }
  })
  console.log(usersCalledAlice);
}

async function deletUserByID(id){
    const deletedUser = await prisma
    .deleteUser({ id: id });
    console.log(deletedUser + " has been deleted");
}

main().catch(e => console.error(e))
