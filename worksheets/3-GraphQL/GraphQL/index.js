const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {

  Query: {
    /*
     * Single Database Relation Queries (Part 2)
    */
    // Category
    getCategories(root, args, context) {
      console.log('Returning all category....')
      return context.prisma.categories()
    },

    getCategoryById(root, args, context) {
      console.log('Returning category....')
      return context.prisma.category({
        id: args.id
      })
    },

    // Products
    getProducts(root, args, context) {
      console.log('Returning all products....')
      return context.prisma.products()
    },

    getProductById(root, args, context) {
      console.log('Returning product....')
      return context.prisma.product({
        id: args.id
      })
    },

    // Inventory
    getInventories(root, args, context) {
      console.log('Returning all inventories....')
      return context.prisma.inventories()
    },

    getInventoryById(root, args, context) {
      console.log('Returning product inventory....')
      return context.prisma.inventory({
        id: args.id
      })
    },

    // Orderines
    getOrderlines(root, args, context) {
      console.log('Returning all orderlines....')
      return context.prisma.orderlines()
    },

    getOrderlineById(root, args, context) {
      console.log('Returning orderline....')
      return context.prisma.orderline({
        id: args.id
      })
    },

    // Orders
    getOrders(root, args, context) {
      console.log('Returning all order....')
      return context.prisma.orders()
    },

    getOrderById(root, args, context) {
      console.log('Returning order....')
      return context.prisma.order({
        id: args.id
      })
    },

    // Customer
    getCustomers(root, args, context) {
      console.log('Returning all customer....')
      return context.prisma.customers()
    },

    getCustomerById(root, args, context) {
      console.log('Returning customer....')
      return context.prisma.customer({
        id: args.id
      })
    },

  },

  /*
   *  ( Part 3 )
   *  These methods allow for nested queries to be performed on all tables
   *  These methods are required for the relationships between the tables to be accessible 
   *  For example getOrderById endpoint can now be used to to return all information about an order including
   *  The customer the ordeline the product and the category. The type of nested querying can be accomplished 
   *  For all tables that have relations
   */
  Product: {
    category(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).category()
    },
    inventory(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).inventory()
    },
  },

  Inventory: {
    product(root, args, context) {
      return context.prisma.inventory({
        id: root.id
      }).product()
    },
  },

  Orderline: {
    order(root, args, context) {
      return context.prisma.orderline({
        id: root.id
      }).order()
    },
    product(root, args, context) {
      return context.prisma.orderline({
        id: root.id
      }).product()
    }
  },

  Order: {
    customer(root, args, context) {
      return context.prisma.order({
        id: root.id
      }).customer()
    },
    orderline(root, args, context) {
      return context.prisma.order({
        id: root.id
      }).orderline()
    }
  },

  Mutation: {

    /*
     * Mutations to populate database 
    */
    createCategory(root, args, context) {
      console.log('Creating category entry....')
      return context.prisma.createCategory(
        { categoryname: args.categoryname },
        )
    },


    /**
     * Part (4)
     * Method to pupulate the inventory of a product when it is created
     * This is how any back end stock managment system works, new products are added
     * to the system and at the same time the quantity of the product is added. A seperate
     * transaction can used to update the quantity from then on. 
     */
    createProduct(root, args, context) {
      console.log('Creating products entry....')
      return context.prisma.createProduct({
        category: { 
          connect: { id: args.categoryId }
        },
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prod_id: args.common_prod_id,
        inventory: {
          create: {
            stock_quantity: args.stock_quantity,
            sales: 0
          }
        }
      })
    },

    createOrderline(root, args, context) {
      console.log('Creating orderlines entry....')
      return context.prisma.createOrderline({
        order: { 
          connect: { id: args.orderId }
        },
        product: { 
          connect: { id: args.productId }
        },
        quantity: args.quantity,
        orderdate: args.orderdate
      }, )
    },

    createOrder(root, args, context) {
      console.log('Creating orders entry....')
      return context.prisma.createOrder({
        orderdate: args.orderdate,
        customer: { 
          connect: { id: args.customerId }
        },
        netamount: args.netamount,
        tax: args.tax,
        totalamount: args.totalamount
      })
    },

    createCustomer(root, args, context) {
      console.log('Creating customer entry....')
      return context.prisma.createCustomer({
        firstname: args.firstname,
        lastname: args.lastname,
        address1: args.address1,
        address2: args.address2,
        city: args.city,
        state: args.state,
        zip: args.zip,
        country: args.country,
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
        gender: args.gender,
      })
    },
  },
}

// Pat (5) Set up and run a graphql server
const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: {
      prisma
    },
  })
  server.start(() => console.log('Server is running on http://localhost:4000'))