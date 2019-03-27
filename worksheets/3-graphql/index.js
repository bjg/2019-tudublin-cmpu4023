const {prisma} = require('./generated/prisma-client')
const {GraphQLServer} = require('graphql-yoga')

const resolvers = {

  Query: {
    //Q2

    getCategories(root, args, context) {
      console.log('Getting Categories')
      return context.prisma.categories()
    },

    getInventories(root, args, context) {
      console.log('Getting Inventories')
      return context.prisma.inventories()
    },

    getOrderlines(root, args, context) {
      console.log('Getting Orderlines')
      return context.prisma.orderlines()
    },

    getOrders(root, args, context) {
      console.log('Getting Orders')
      return context.prisma.orders()
    },

    getProducts(root, args, context) {
      console.log('Getting Product')
      return context.prisma.products()
    },

    getCustomers(root, args, context) {
      console.log('Getting Customer')
      return context.prisma.customers()
    },
  },
  
  //Q3 this allows nested queries, by querying orderline i can get product, order, customer and category
  Product: {
    category(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).category()
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
  Orderline: {
    product(root, args, context) {
      return context.prisma.orderline({
        id: root.id
      }).product()
    },
    order(root, args, context) {
      return context.prisma.orderline({
        id: root.id
      }).order()
    },
  },

   Mutation: {

    //Q4 mutation to populate the database
    createCategory(root, args, context) {
      console.log('creating new Category')
      return context.prisma.createCategory(
      {
        categoryname: args.categoryname
      })
    },

    createOrderline(root, args, context) {
      console.log('Creating new orderlines')
      return context.prisma.createOrderline({
        order: { 
          connect: { 
            id: args.orderId 
          }
        },
        product: { 
          connect: { 
            id: args.productId 
          }
        },
        quantity: args.quantity,
        orderdate: args.orderdate
      })
    },

    createOrder(root, args, context) {
      console.log('Creating new orders')
      return context.prisma.createOrder({
        orderdate: args.orderdate,
        customer: { 
          connect: { 
            id: args.customerId 
          }
        },
        netamount: args.netamount,
        tax: args.tax,
        totalamount: args.totalamount
      })
    },

    //Creating a product also updates the inventory
    createProduct(root, args, context) {
      console.log('Creating new products')
      return context.prisma.createProduct({
        category: { 
          connect: { 
            id: args.categoryId 
          }
        },
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prod_id: args.common_prod_id,
        inventory: {
          create: {
            quan_in_stock: args.quan_in_stock,
            sales: 0
          }
        }
      })
    },

    createCustomer(root, args, context) {
      console.log('Creating new customers')
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

//Q5 set up and run
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))