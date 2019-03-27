const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    Inventorys(root, args, context) {
      return context.prisma.Inventorys()
    },
    Reorders(root, args, context) {
      return context.prisma.Reorders()
    },
    Products(root, args, context) {
      return context.prisma.Productses()
    },
    Categorys(root, args, context) {
      return context.prisma.Categorys()
    }
  },

  Mutation: {
    createInventory(root, args, context) {
      return context.prisma.createInventory(
        {
          sales: args.sales,
	  quan_in_stock: args.quan_in_stock,
          product: {
            connect: { id: args.prod_id }
          }
        },
      )
    },
    createReorder(root, args, context) {
      return context.prisma.createReorder(
        { 
	  quan_reordered: args.quan_reordered,
          product: {
             connect: { id: args.prod_id }
	  } 
	},
      )
    },
    createProduct(root, args, context) {
      return context.prisma.createProduct(
        { 
	  title: args.title,
	  actor: args.actor,
	  price: args.price,
          category: {
             connect: { id: args.category }
	  } 
	},
      )
    },
    createCategory(root, args, context) {
      return context.prisma.createCategory(
	 {
	   categoryname: args.categoryname
	 },
      )
    },
	//this resolve will create a new inventory for a new category, including its sales and stock 
	createInventoryCategory(root, args, context) {
      return context.prisma.createInventoryCategory(
        {
            quan_in_stock: args.quan_in_stock,
            sales: args.sales,
            product: {
                connect: { 
                    id: args.prod_id
                }
            },
            Category: {
                create: {
                    categoryname: args.Category.categoryname
                }
            }
        },
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
