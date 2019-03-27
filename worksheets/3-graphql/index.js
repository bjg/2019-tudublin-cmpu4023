const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
    Query: {
        recorders(root, args, context) {
            return context.prisma.recorders()
        },
        inventories(root, args, context) {
            return context.prisma.inventories()
        },
        products(root, args, context) {
            return context.prisma.products()
        },
        categories(root, args, context) {
            return context.prisma.categories()
        },
        getProductById(root, args, context) {
            return context.prisma.product({
                id: args.id
            })
        },

        /*
        Retrieve Inventory with a given product ID of a product
        This may be used to check inventory levels of a product.
        If indicated low, more stock should be purchased
        */
        getInventoryByProductId(root, args, context){
            return context.prisma.inventories({
                where: {
                    product: {
                        id: args.id
                    }
                }
            })
        }
    },

    Mutation: {
        createProduct(roots, args, context){
            return context.prisma.createProduct(
                {
                    category: {connect: { id: args.category }},
                    title: args.title,
                    actor: args.actor,
                    price: args.price,
                    special: args.special,
                    common_prod_id: args.common_prod_id
                })
        },
        createInventory(roots, args, context){
            return context.prisma.createInventory(
                {
                    quan_in_stock: args.quan_in_stock,
                    sales: args.sales,
                    product: {connect: {id: args.product}},
                })
        },
        createCategory(roots, args, context){
            return context.prisma.createCategory(
                {
                    categoryname: args.categoryname,
                })
        },
    },
    /*This is used to query and display nested fields of tables. It can be used to query multiple relations*/
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
    Recorder: {
        product(root, args, context)  {
            return context.prisma.recorder({
                id: root.id
            }).product()
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
