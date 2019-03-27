const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    product(root, args, context) {
      return context.prisma.products({ id: args.productId })
    }
  },
  Mutation: {
    createNewCategory(root, args, context) {
      return context.prisma.createCategories({
        categoryname: args.categorynames
        })
    },
    createNewProduct(root, args, context) {
      return context.prisma.createProducts({
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prod_id: args.common_prod_id,
        category: {
          connect: {
            id: args.categoryId
          }
        },
        inventory: {
          create: {
            quan_in_stock: args.stock_quantity,
            sales: 0
          }
        }
      })
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
