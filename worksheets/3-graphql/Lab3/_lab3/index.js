const {prisma} = require('./generated/prisma-client')
const {GraphQLServer} = require('graphql-yoga')

const resolvers = {

  Query: {
    /*part 1*/

    getCategories(root, args, context) {
      console.log('Getting Categories')
      return context.prisma.categories()
    },

    getCategoryId(root, args, context) {
      console.log('')
      return context.prisma.category({
        where: {
          id: args.id
        }
      })
    },

    getOrderlines(root, args, context) {
      console.log('Getting Categories')
      return context.prisma.categories()
    },

    getOrderlineId(root, args, context) {
      console.log('')
      return context.prisma.category({
        where: {
          id: args.id
        }
      })
    },

    getOrders(root, args, context) {
      console.log('Getting Categories')
      return context.prisma.categories()
    },

    /*geOrderId(root, args, context) {
      console.log('')
      return context.prisma.category({
        where: {
          id: args.id
        }
      })
    },*/

    getProducts(root, args, context) {
      console.log('Getting Categories')
      return context.prisma.categories()
    },

    getProductId(root, args, context) {
      console.log('')
      return context.prisma.category({
        where: {
          id: args.id
        }
      })
    },

    /*geCustomers(root, args, context) {
      console.log('Getting Categories')
      return context.prisma.categories()
    },*/

    getCustomerId(root, args, context) {
      console.log('')
      return context.prisma.category({
        where: {
          id: args.id
        }
      })
    },
  },
  
  Product: {
    category(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).category()
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

    //Q4 populate the database
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

    createProduct(root, args, context) {
      console.log('Creating new products')
      return context.prisma.createProduct({
        category: { 
          connect: { id: args.categoryId }
        },
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prod_id: args.common_prod_id,
        category: {
          connect: {
            id: args.categoryId
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