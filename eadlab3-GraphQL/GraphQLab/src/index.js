const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('../prisma/generated/prisma-client/')

const resolvers = {
    Query: {
        getProducts(root, args, context) {
            return context.prisma.productses()
        },
        getReorder(root, args, context) {
            return context.prisma.reorders()
        },

        getInventory(root, args, context) {
            return context.prisma.inventories()
        },

        getCategories(root, args, context) {
            return context.prisma.categorieses()
        }
    }
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))