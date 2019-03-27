const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
  getOrderlines(root, args, context) {
      return context.prisma.Orderlines()
    },
	getInventory(root, args, context) {
      return context.prisma.inventories()
    },
    getOrders(root, args, context) {
      return context.prisma.orders()
    },
    getCategories(root, args, context) {
      return context.prisma.categories()
    },
  },
  //Part 2
  getProductsByID(root, args, context) {
      return context.prisma.products({
        where: {
          id: args.prod_Id
        }
      })
    },
  //Part 3
  Inventory: {
    prod_id(root, args, context) {
      return context.prisma.inventory({
        id: root.id
      }).prod_id()
    }
  },
  Orderlines: {
    Products(root, args, context) {
      return context.prisma.Orderlines({
        id: root.id
      }).Products()
    },
	Order: {
    orderline(root, args, context) {
      return context.prisma.order({
        id: root.id
      }).orderline()
    }
  },
    order(root, args, context) {
      return context.prisma.Orderlines({
        id: root.id
      }).order()
    },
  },
  Products: {
    category(root, args, context) {
      return context.prisma.Products({
        id: root.id
      }).category()
    },
    inventory(root, args, context) {
      return context.prisma.Products({
        id: root.id
      }).inventory()
    },
  },
  Mutation: {
    createCategory(root, args, context) {
      return context.prisma.createCategory({
        categoryname: args.categorynames
        })
    },
    //Part 4
    createproduct(root, args, context) {
      return context.prisma.createProduct({
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
            stock_quan: args.stock_quantity,
            sales: 0
          }
        }
      })
    }, 
    createOrder(root, args, context) {
      console.log(args)
      return context.prisma.createOrder({
        orderdate: args.orderdate,
        customer: args.customer_name,
        price_net: args.price_net,
        tax: args.tax,
        price_tot: args.price_tot,
        orderline:{
          create:{
            Products: {
              connect:{
                id: args.product_id
              }
            },
            quantity: args.quantity,
            orderdate: args.orderdate
          }
        }
      }, )
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