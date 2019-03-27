const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
	Query: {
		productsReordered(root, args, context) {
			return context.prisma.reorders({})
		}
	},
	Category: {
		products(root, args, context) {
			return context.prisma.product({
				id: root.id
			}).products()
		}
	},
	Product: {
		category(root, args, context) {
			return context.prisma.category({
				id: root.id
			}).category()
		},
		reorders(root, args, context) {
			return context.prisma.reorder({
				id: root.id
			}).reorders()
		},
		inventories(root, args, context) {
			return context.prisma.inventory({
				id: root.id
			}).inventories()
		},
		orderlines(root, args, context) {
			return context.prisma.orderline({
				id: root.id
			}).orderlines()
		}
	},
	Reorder: {
		product(root, args, context) {
			return context.prisma.product({
				id: root.id
			}).product()
		}
	},
	Inventory: {
		product(root, args, context) {
			return context.prisma.product({
				id: root.id
			}).product()
		}
	},
	Orderline: {
		product(root, args, context) {
			return context.prisma.product({
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