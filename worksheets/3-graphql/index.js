const { prisma } = require('./prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    products(root, args, context) {
      return context.prisma.products()
    },
    orders(root, args, context) {
      return context.prisma.orders()
    },
    orderlines(root, args, context) {
      return context.prisma.orderlines()
    },
    categories(root, args, context) {
      return context.prisma.categories()
    }
  },
  Mutation: {
    createProduct(root, args, context) {
      return context.prisma.createProduct(
        {
          title: args.title,
          price: args.price,
          category: {
            connect: {id:args.category}
          }
        },

      )
    },
    createCategory(root, args, context) {
      return context.prisma.createCategory(
        { categoryname: args.categoryname },
      )
    },
    createOrderline(root, args, context) {
      return context.prisma.createOrderline(
        { product: { connect:{id:args.product}},
          quantity: args.quantity }
      )
    },
    createOrder(root, args, context) {
      return context.prisma.createOrderline(
        { orderlines: { connect:{id:args.orderlines}}}
      )
    }
  },
  Order: {
    orderlines(root, args, context) {
      return context.prisma.orderlines({
        id: root.id
      })
    }
  },
  Orderline: {
    product(root, args, context) {
      return context.prisma.product({
        id: root.id
      })
    }
  },
  Product: {
    category(root, args, context) {
      return context.prisma.category({
        id: root.id
      })
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


