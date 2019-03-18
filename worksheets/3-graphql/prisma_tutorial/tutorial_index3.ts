import { prisma } from './generated/prisma-client'

/*
This is part two of the tutorial
https://www.prisma.io/docs/get-started/02-change-data-model-JAVASCRIPT-c001/

*/

// A `main` function so that we can use async/await
async function main() {
  //createUser("John","john@email.com");
  //findAllUsers();
  console.log("---------\n");
  //findAllPosts();
  queryPostsByUser("john@email.com");
}

async function queryPostsByUser(email){
  const postsByUser = await prisma
    .user({email: email})
    .posts()
    console.log(`All posts by that user: ${JSON.stringify(postsByUser)}`)

}

async function createUser(name,email){
  const newUser = await prisma
  .createUser({
      name: name,
      email: email,
      posts:{
        create: [
          {title:"Join us for GraphQL in 2019"},
          {title:"Subscribe!"}
        ]
      },
  })

  console.log(`Created new user: ${newUser.name} (ID:${newUser.id})`);
}


async function findAllUsers(){
    // Read all users from the database and print them to the console
    const allUsers = await prisma.users()
    console.log(allUsers)
}

async function findAllPosts(){
  // Read all users from the database and print them to the console
  const allPosts = await prisma.posts()
  console.log(allPosts)
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
