const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    allCategories: (root, args, context, info) => {
      return context.prisma.categories()
    },
    allProducts: (root, args, context, info) => {
      return context.prisma.products()
    },
    allInventories: (root, args, context, info) => {
      return context.prisma.inventories()
    },
    allReorders: (root, args, context, info) => {
      return context.prisma.reorders()
    },
    oneCategory: (root, args, context, info) => {
      return context.prisma.categories({where : {id: args.id}})
    },
    oneInventory: (root, args, context, info) => {
      return context.prisma.inventories({id: args.id})
    },
  },
  Mutation: {
    postCategories: (root, args, context) => {
      return context.prisma.createCategory({
	categoryname: args.categoryname,
      })
    },
    postProducts: (root, args, context) => {
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
        }
      })
    },
    postInventories: (root, args, context) => {
      return context.prisma.createInventory({
	quan_in_stock: args.quan_in_stock,
	sales: args.sales,
	product: {
	  connect: {
	    id: args.productId
	  }
	}
      })
    },
    postReorders: (root, args, context) => {
      return context.prisma.createReorder({
	date_low: args.date_low,
	quan_low: args.quan_low,
	date_reordered: args.date_reordered,
	quan_reordered: args.quan_reordered,
	date_expected: args.date_expected,
	product: {
	  connect: {
	    id: args.productId
	  }
	}
      })
    },
  },
  Product: {
    category(root, args, context)  {
      return context.prisma.product({
	id: root.id
      }).category()
    },
  },
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
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
