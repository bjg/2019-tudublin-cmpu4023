const { prisma } = require('./generated/prisma-client')

// A `main` function so that we can use async/await
async function main() {

  /* -----PART 1-----

  // Create a new user
  //const newUser = await prisma.createUser({ name: 'Alice' })

  // Fetch a single user
  const user = await prisma.user({ id: 'cjsvwkn8i00280741j5jmdfs5' })
  console.log(user)

  // Filter a user list
  const usersCalledJane = await prisma
    .users({
      where: {
        name: 'Jane'
      }
    })
  console.log(usersCalledJane)

  // Update a user
  const updatedUser = await prisma
    .updateUser({
      where: { id: 'cjsvyhcnp003407414p4p3erp' },
      data: { name: 'Sue' }
    })

  // Delete a user
  //const deletedUser = await prisma.deleteUser({ id: 'cjsvyhcnp003407414p4p3erp' })

  // Read all users from the database and print them to the console
  const allUsers = await prisma.users()
  console.log(allUsers)
  */

	// -----PART 2-----

	// Create a new user with a new post
	/*
	const newUser = await prisma
	.createUser({
	name: "Bob",
	email: "bob@prisma.io",
	posts: {
	  create: [{
	    title: "Join us for GraphQL Conf in 2019",
	  }, {
	    title: "Subscribe to GraphQL Weekly for GraphQL news",
	  }]
	},
	})
	console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`)

	// Read all users from the database and print them to the console
	const allUsers = await prisma.users()
	console.log(allUsers)

	const allPosts = await prisma.posts()
	console.log(allPosts)
	*/

	// Read the previously created user from the database and print their posts to the console
	const postsByUser = await prisma
		.user({ email: "bob@prisma.io" })
		.posts()
	console.log(`All posts by that user: ${JSON.stringify(postsByUser)}`)
}

main().catch(e => console.error(e))
