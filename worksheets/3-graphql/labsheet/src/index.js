const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    /* 
       Part 2:
       - the below query resolver returns all customers from the customer table
    */
    allProducts(root, args, context) {
      return context.prisma.products()
    },

    /* 
       Part 3:
       - The below query can be used to retrieve all order lines - including order, customer and
         product info - of a specific user based on their username
    */
    orderLinesByCustomer(root, args, context) {
      return context.prisma.orderLines({
        where: {
          order_every: {
            customer_every: {
              username: args.customerUsername
            }
          }
        }
      })
    }

  },

  // Creates connection between related tables to allow nested queries
  Order: {
    customer(root, args, context) {
      return context.prisma.order({
        id: root.id
      }).customer()
    }
  },
  OrderLine: {
    order(root, args, context) {
      return context.prisma.orderLine({
        id: root.id
      }).order()
    },
    product(root, args, context) {
      return context.prisma.orderLine({
        id: root.id
      }).product()
    }
  }

}


// Part 5:
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
