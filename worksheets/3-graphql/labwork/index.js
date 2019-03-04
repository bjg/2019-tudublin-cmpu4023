const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    getCategoriesEndpoint(root, args, context) {
      console.log('-------- SELECTING CATEGORIES ------------')
      return context.prisma.categories()
    },
    getCustomersEndpoint(root, args, context) {
      console.log('-------- SELECTING CUSTOMERS ------------')
      return context.prisma.customers()
    },

    getProductsEndpoint(root, args, context) {
      console.log('-------- SELECTING Products ------------')
      return context.prisma.productses()
    },

    getOrdersEndpoint(root, args, context) {
      console.log('-------- SELECTING ORDERS ------------')
      return context.prisma.orderses()
    },

    getCust_HistsEndpoint(root, args, context) {
      console.log('-------- SELECTING CUST_HIST ------------')
      return context.prisma.cust_Hists()
    },


  }, //end query
  Mutation: {

    //create category
    createCategoryEndpoint(root, args, context) {
      console.log('-------- INSERTING CATEGORY ------------')
      console.log(args)
      return context.prisma.createCategory(
        {
          categoryname: args.categoryname
        },
      )
    },

    //create category
    createCustomerEndpoint(root, args, context) {
      console.log('-------- INSERTING CUSTOMER ------------')
      console.log(args)
      return context.prisma.createCustomer(
        {
          firstname: args.firstname,
          lastname: args.lastname,
          address1: args.address1,
          address2: args.address2,
          city: args.city,
          state: args.state,
          zip: args.zip,
          county: args.county,
          region: args.region,
          email: args.email,
          phone: args.phone,
          creditcardtype: args.creditcardtype,
          creditcard: args.creditcard,
          creditcardexpiration: args.creditcardexpiration,
          username: args.username,
          password: args.password,
          age: args.age,
          income: args.income,
          gender: args.gender
        },
      )
    },

    createProductsEndpoint(root, args, context) {
      console.log('-------- INSERTING Product ------------')
      console.log(args)
      return context.prisma.createProducts(
        {
          title: args.title,
          actor: args.actor,
          price: args.price,
          special: args.special,
          common_prod_id: args.common_prod_id,
          category: {
            connect: { id: args.categoryId }
          }
        },
      )
    },

    createOrdersEndpoint(root, args, context) {
      console.log('-------- INSERTING ORDERS ------------')
      console.log(args)
      return context.prisma.createOrders(
        {
          orderdate: args.orderdate,
          netamount: args.netamount,
          tax: args.tax,
          totalamount: args.totalamount,
          customer: {
            connect: { id: args.customerId }
          }
        },
      )
    },

    createCust_HistEndpoint(root, args, context) {
      console.log('-------- INSERTING Cust_Hists ------------')
      console.log(args)
      return context.prisma.createCust_Hist(
        {
          customer: {
            connect: { id: args.customerId }
          },
          order: {
            connect: { id: args.orderId }
          },  
          product: {
            connect: { id: args.productId }
          }
          
        })
    },



  },//end mutation


}// end resolvers

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
