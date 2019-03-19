const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {

  Query: {


  	//basic get requests
  	// Customer
    getCustomers(root, args, context) {
      return context.prisma.customers()
    },

    getCustomerById(root, args, context) {
      return context.prisma.customer({
        id: args.id
      })
    },

    // Products
    getProducts(root, args, context) {
      return context.prisma.products()
    },

    getProductById(root, args, context) {
      return context.prisma.product({
        id: args.id
      })
    },



    // Category
    getCategories(root, args, context) {
      return context.prisma.categories()
    },

    getCategoryById(root, args, context) {
      return context.prisma.category({
        id: args.id
      })
    },

    

    // Inventory
    getInventories(root, args, context) {
      return context.prisma.inventories()
    },

    getInventoryById(root, args, context) {
      return context.prisma.inventory({
        id: args.id
      })
    },

    // Orderines
    getOrderlines(root, args, context) {
      return context.prisma.orderlines()
    },

    getOrderlineById(root, args, context) {
      return context.prisma.orderline({
        id: args.id
      })
    },

    // Orders
    getOrders(root, args, context) {
      return context.prisma.orders()
    },

    getOrderById(root, args, context) {
      return context.prisma.order({
        id: args.id
      })
    },

    

  },

  // nested querys
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

  Inventory: {
    product(root, args, context) {
      return context.prisma.inventory({
        id: root.id
      }).product()
    },
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

    //mutations part 4
    createCategory(root, args, context) {
      return context.prisma.createCategory(
        { categoryname: args.categoryname },
        )
    },

    createProduct(root, args, context) {
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
            sales: 100
          }
        }
      })
    },

    createOrderline(root, args, context) {
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

const server = new GraphQLServer({
    typeDefs: './generated/Schema.graphql',
    resolvers,
    context: {
      prisma
    },
  })
  server.start(() => console.log('Server is running on http://localhost:4000'))
