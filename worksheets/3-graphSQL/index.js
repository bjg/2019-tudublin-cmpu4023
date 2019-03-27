const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    product(root, args, context) {
      return context.prisma.product({ id: args.productId })
    }
  },
  Mutation: {
    createCategory(root, args, context) {
      return context.prisma.createCategory(
        { categoryname: args.categoryname },
        )
    },
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
