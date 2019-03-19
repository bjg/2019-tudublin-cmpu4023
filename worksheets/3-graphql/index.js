const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    categorys(root, args, context) {
      return context.prisma.category({ where: { name: "1 items" } })
    },
    category(root, args, context) {
      return context.prisma.category({ id: args.id })
    },
	//What it does: Displays a detailed breakdown of a product in the system, including it's name, price, category, amount currently in stock and amount sold.
	//Resolver for query that deals with two relations
    inventoryInfo(root, args, context) {
      return context.prisma.inventory({ id: args.id })
    },
  },
  Mutation: {
	//What it does: Makes it possible to generate a reorder in the system when quantities become too low and associate it with a product.
	//Order table was not selected so this mutator deals with creating a reorder instead, the reorder details are updated with dates, quantities and the connection to the products table.
    placeReorder(root, args, context) {
      return context.prisma.createReorder(
        {
          product: {
            connect: { id: args.productId }
          },
          date_low: args.date_low,
          quan_low: args.quan_low
        },
      )
    },
    createCategory(root, args, context) {
      return context.prisma.createCategory(
        {
          name: args.name,
        },
      )
    },
    createProduct(root, args, context) {
      return context.prisma.createProduct(
        {
          category: {
            connect: { id: args.categoryId }
          },
          title: args.title,
          price: args.price,
        },
      )
    },
    createInventory(root, args, context) {
      return context.prisma.createInventory(
        {
          product: {
            connect: { id: args.productId }
          },
          quantity_in_stock: args.quantity_in_stock,
          sales: args.sales
        },
      )
    }
  },
  Product: {
    category(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).category()
    }
  },
  Inventory: {
    product(root, args, context) {
      return context.prisma.inventory({
        id: root.id
      }).product()
    }
  },
  Reorder: {
    product(root, args, context) {
      return context.prisma.reorder({
        id: root.id
      }).product()
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
