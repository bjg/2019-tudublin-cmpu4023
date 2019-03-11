const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')


const resolvers = {
  Query: {
    product(root,args,context){
      return context.prisma.product({ id: args.productId})
    }
  },
  Mutation: {
    createProduct(roots, args, context){
      return context.prisma.createProduct(
        {
          category: args.category,
          title: args.title,
          actor: args.actor,
          price: args.price,
          special: args.special,
          common_prod_id: args.common_prod_id
        })
    }
  },
  Product: {
    title(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).title()
    }
  },
}

// category: Int!,title:String!,actor:String!,price: Float!,special: Int!,common_prod_id: !Int
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})


server.start(() => console.log('Server is running on http://localhost:4000'))