const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
    Query: {
        // Part 1
        // This is a simple query resolver that returns the products within a specified category.
        productsByCategory(root, args, context) {
            return context.prisma.category({ name: args.categoryName }).products()
        },

        // Part 2
        // This query resolver, along with resolvers defined below on each type,
        // can be combined to pose a more complex query to the database.
        // An example for what this can be used is to display the total amount
        // spent on each order in which an item from a specific category was purchased.
        ordersForCategory(root, args, context) {
            return context.prisma.category({name: args.categoryName});
        },
    },

    Mutation: {
        // Part 3
        // Creates a new product and links it with the provided category.
        // If the category doesn't exist it is created, if it does exist,
        // the product is linked with the existing category instead.
        //
        // An application for this mutation would be wanting to add a 
        // new product to the database, but being unsure if its category
        // already exists. The category can be provided, and this will
        // take care or either linking to or creating the category.
        async createProductWithNewCategory(root, args, context) {
            const category = await context.prisma.category({
                name: args.categoryName
            });

            product = {
                title: args.title,
                price: args.price,
            }

            if (category) {
                product.category = {
                    connect: { id: category.id}
                }
            } else {
                product.category = {
                    create: {
                        name: args.categoryName
                    }
                }
            }
            
            return context.prisma.createProduct(product);
        },
    },

    Category: {
        products(root, args, context) {
            return context.prisma.category({
                id: root.id
            }).products()
        }
    },

    Product: {
        orderlines(root, args, context) {
            return context.prisma.product({
                id: root.id
            }).orderlines()
        }
    },

    Orderline: {
        order(root, arrgs, context) {
            return context.prisma.orderline({
                id: root.id
            }).order()
        }
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

