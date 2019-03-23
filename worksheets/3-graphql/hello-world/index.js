const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

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
	/*const postsByUser = await prisma
		.user({ email: "bob@prisma.io" })
		.posts()
	console.log(`All posts by that user: ${JSON.stringify(postsByUser)}`)*/
}

// -----PART 3-----
const resolvers = {
  Query: {
    publishedPosts(root, args, context) {
      return context.prisma.posts({ where: { published: true } })
    },
    post(root, args, context) {
      return context.prisma.post({ id: args.postId })
    },
    postsByUser(root, args, context) {
      return context.prisma.user({
        id: args.userId
      }).posts()
    }
  },
  Mutation: {
    createDraft(root, args, context) {
      return context.prisma.createPost(
        {
          title: args.title,
          author: {
            connect: { id: args.userId }
          }
        },

      )
    },
    publish(root, args, context) {
      return context.prisma.updatePost(
        {
          where: { id: args.postId },
          data: { published: true },
        },

      )
    },
    createUser(root, args, context) {
      return context.prisma.createUser(
        { name: args.name },
      )
    }
  },
  User: {
    posts(root, args, context) {
      return context.prisma.user({
        id: root.id
      }).posts()
    }
  },
  Post: {
    author(root, args, context) {
      return context.prisma.post({
        id: root.id
      }).author()
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))

//main().catch(e => console.error(e))
