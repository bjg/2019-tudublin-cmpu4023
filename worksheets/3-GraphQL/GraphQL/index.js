const { prisma } = require('./generated/prisma-client')

// A `main` function so that we can use async/await
async function main() {

  // Create a new user called `Alice`
  const newUser = await prisma.createUser({ name: 'Alice' })
  console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`)

  // Create a new user with a new post
  const newUserPost = await prisma
    .createUser({
      name: "Bob",
      email: "brian@prisma.io",
      posts: {
        create: [{
          title: "Join us for GraphQL Conf in 2019",
        }, {
          title: "Subscribe to GraphQL Weekly for GraphQL news",
        }]
      },
    })
  console.log(`Created new user: ${newUserPost.name} (ID: ${newUserPost.id})`)

  // Display all posts
  const allPosts = await prisma.posts()
  console.log(allPosts)

  // Read the previously created user from the database and print their posts to the console
  const postsByUser = await prisma
    .user({ email: "bob@prisma.io" })
    .posts()
  console.log(`All posts by that user: ${JSON.stringify(postsByUser)}`)

  // Read all users from the database and print them to the console
  const allUsers = await prisma.users()
  console.log(allUsers)

  // Fetch a single user
  const user = await prisma
  .user({ id: 'cjt4gk6oq000n0703nlcs3g7k' })

  // Filtered user list
  const usersCalledAlice = await prisma
  .users({
    where: {
      name: 'Alice'
    }
  })

  // Update a users name
  const updatedUser = await prisma
  .updateUser({
    where: { id: 'cjt4gk6oq000n0703nlcs3g7k' },
    data: { name: 'Bob' }
  })

  // Delete a user
//   const deletedUser = await prisma
//   .deleteUser({ id: 'cjt4gja74000h0703jmreyal3' })
}

main().catch(e => console.error(e))