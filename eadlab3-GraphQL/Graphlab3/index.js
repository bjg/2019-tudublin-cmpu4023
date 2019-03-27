const { prisma } = require('./generated/prisma-client/')
const { GraphQLServer } = require('graphql-yoga')


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
        },
    },
    /* An employee could want to create more inventory and add it to a reorder. */
    Mutation: {
        createProducts(root, args, context) {
            console.log('Got Here')
            return context.prisma.createProducts({
                title: args.title,
                actor: args.actor,
                price: args.price,
                special: args.special,
                category: {
                    connect: {
                        id: args.category
                    }
                }
            })
        },

        createCategories(root, args, context) {
            return context.prisma.createCategories({
                categoryname: args.categoryname
            })
        },

        createInventory(root, args, context) {
            return context.prisma.createInventory({
                prod_id: {
                    connect: { id: args.prod_id }
                },
                quan_in_stock: args.quan_in_stock,
                sales: args.sales
            })
        },

        createReorder(root, args, context) {
            return context.prisma.createReorder({
                    prod_id: {
                        connect: { id: args.prod_id }
                    },
                    date_low: args.date_low,
                    quan_low: args.quan_low,
                    date_reordered: args.date_reordered,
                    quan_reordered: args.quan_reordered,
                    date_expected: args.date_expected
                }

            )
        }

    },

    /* Q.3 This query gets the category and product information from reordered stock. An employee might want to view this information */

    Products: {
        category(root, args, context) {
            return context.prisma.products({
                id: root.id
            }).category()
        }
    },
    Inventory: {
        products(root, args, context) {
            return context.prisma.inventory({
                id: root.id
            }).products()
        }
    },
    Reorder: {
        products(root, args, context) {
            return context.prisma.reorders({
                id: root.id
            }).products()

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