const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
    Query: {
        productsByCategory(root, args, context) {
            return context.prisma.category({ name: args.categoryName }).products()
        },
        orderlineByCategory(root, args, context) {
            return context.prisma.category({name: args.categoryName});
        },
    },
    Mutation: {
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
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))

