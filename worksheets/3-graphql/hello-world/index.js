const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
  	/***** START Part 2 *****/
    getCategories(root, args, context) {
      console.log('Getting all categories: ')
      return context.prisma.categories()
    },
    getCategoryById(root, args, context) {
      console.log('Getting category by id: ')
      return context.prisma.category({
        id: args.id
      })
    },

    getProducts(root, args, context) {
      console.log('Getting all products: ')
      return context.prisma.products()
    },
    getProductById(root, args, context) {
      console.log('Getting product by id: ')
      return context.prisma.product({
        prod_id: args.id
      })
    },

    getInventory(root, args, context) {
      console.log('Getting inventory: ')
      return context.prisma.inventories()
    },
    getInventoryById(root, args, context) {
      console.log('Getting inventory by id: ')
      return context.prisma.inventory({
        id: args.id
      })
    },

    getReorders(root, args, context) {
      console.log('Getting all reorders: ')
      return context.prisma.inventories()
    },
    getReorderById(root, args, context) {
      console.log('Getting reorders by id: ')
      return context.prisma.inventory({
        id: args.id
      })
    }
    /***** END Part 2 *****/
  },
  /***** START Part 4 *****/
  Mutation: {

  },
  Category: {
    categories(root, args, context) {
      return context.prisma.Category({
        id: root.id
      }).posts()
    }
  },
  Product: {
    products(root, args, context) {
      return context.prisma.Product({
        prod_id: root.prod_id
      }).author()
    }
  },
  Inventory: {
    inventory(root, args, context) {
      return context.prisma.Inventory({
        id: root.id
      }).posts()
    }
  },
  Reorder: {
    reorders(root, args, context) {
      return context.prisma.Reorder({
        id: root.id
      }).posts()
    }
  }
}

const server = new GraphQLServer({
	typeDefs: './schema.graphql',
	resolvers,
	context: {
		prisma
	},
});

server.start(() => console.log('Server running on port 4466'));