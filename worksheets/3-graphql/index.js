const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    getCategories: (root, args, context, info) => {
      return context.prisma.categories()
    },
    getProducts: (root, args, context, info) => {
      return context.prisma.products()
    },
    getInventories: (root, args, context, info) => {
      return context.prisma.inventories()
    },
    getReorders: (root, args, context, info) => {
      return context.prisma.reorders()
    },
    oneCategory: (root, args, context, info) => {
      return context.prisma.categories({
        where : {
          id: args.id
        }
      })
    },
    oneInventory: (root, args, context, info) => {
      return context.prisma.inventories({
        where : {
          id: args.id
        }
      })
    },
  },
  Mutation: {
    addCategories: (root, args, context) => {
      return context.prisma.createCategory({ categoryname: args.name })
    },
    addProducts: (root, args, context) => {
      return context.prisma.createProduct({
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prodIds: {
          connect: {
            id: args.common_prodIds
          }
        },
        categories: {
          connect: {
            id: args.categoryIds
          }
        }
      })
    },
    addInventories: (root, args, context) => {
      return context.prisma.createInventory({
        stock_qty: args.stock_qty,
        sales: args.sales,
        product: {
          connect: {
            id: args.productId
          }
        }
      })
    },
    addReorders: (root, args, context) => {
      return context.prisma.createReorder({
        date: args.date,
        quantity: args.quantity,
        reorder_date: args.reorder_date,
        reorder_quantity: args.reorder_quantity,
        expected_date: args.expected_date,
        product: {
          connect: {
            id: args.productId
          }
        }
      })
    },
  },
  // Product: {
  //   category(root, args, context)  {
  //     return context.prisma.product({
  //       id: root.id
  //     }).category()
  //   },
  // },
  Inventory: {
    product(root, args, context)  {
      return context.prisma.inventory({
        id: root.id
      }).product()
    },
  },
  Reorder: {
    product(root, args, context)  {
      return context.prisma.reorder({
        id: root.id
      }).product()
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: { prisma },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))