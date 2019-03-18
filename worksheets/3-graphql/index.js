const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')


const resolvers = {
  Query: {
    customers: (root, args, context) => {
      return context.prisma.customers()
    },
    product(root,args,context){
      return context.prisma.product({ id: args.productId})
    },
    // getOrderedLineProducts(root,args,context){
    //   return context.prisma.orderline({
    //     id:args.orderLineId
    //   }).products()
    // }
    getOrderedLineProducts(root,args,context){
      return context.prisma.orderline()
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
    },

    createCustomer(roots, args, context){
      return context.prisma.createCustomer(
        {
          firstname: args.firstname,
          lastname: args.lastname,
          address: args.address,
          city: args.city,
          zip: args.zip,
          country: args.country,
          region: args.region,
          email: args.email,
        })
    },

    createOrder(roots, args, context){
      return context.prisma.createOrder(
        {
          order_date: args.order_date,
          customer: args.customer,
          net_amount: args.net_amount,
          tax: args.tax,
          total_amount: args.total_amount,
        })
    },
    createOrderline(roots, args, context){
      return context.prisma.createOrderline(
        {
          order_id: args.order_id,
          product_id: args.product_id,
          quantity: args.quantity,
          order_date: args.order_date,
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
  Orderline: {
    products(root, args, context) {
      return context.prisma.product({
        id: root.id
      })
    }
  },
  Customer: {
    firstname(root, args, context) {
      return context.prisma.customer()
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})


server.start(() => console.log('Server is running on http://localhost:4000'))