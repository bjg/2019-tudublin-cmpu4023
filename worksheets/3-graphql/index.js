const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
    Query: {
        getProducts(root, args, context) {
            return context.prisma.products({
            })
        },
        getInventories(root, args, context) {
            return context.prisma.inventories({
            })
        },
        getCategories(root, args, context){
            return context.prisma.categories({
            })
        },
        getOrderlines(root, args, context){
            return context.prisma.orderlines({
            })
        },
        getProductsByCategory(root, { category }, context){
            return context.prisma.products({
                where: { category: { category } },
            })
        },
    },
    Mutation: {
        createCategory(root, {category, categoryname}, context) {
            return context.prisma.createCategory({
                category,
                categoryname
            })
        },
        createProduct(root, {prod_id, title, actor, price, categoryId}, context) {
            return context.prisma.createProduct({
                prod_id,
                title,
                actor,
                price,
                category: {connect: { category: categoryId} }
            })
        },
        createInventory(root, {quan_in_stock, sales, prod_id}, context) {
            return context.prisma.createInventory({
                sales,
                quan_in_stock,
                product: { connect: { prod_id }}
            })
        },

        /*
        Uses can order a given product depending if there is enough available in stock
        Users can order multiple quantities of the same item
        If order is successful the sales and quan_in_stock fields will be udpated for the inventory of that product
        and the order will then be placed in orderline table.
        */
        async createOrderline(root, { orderlineid, quantity, prod_id}, context) {


            //get the current inventory for the product the user wants to buy
            const currentInventory = await context.prisma.inventories({
                where: { product: {prod_id} },
            })

            //If user wants more quantity than what is available then throw error
            // if (quantity > currentInventory[0].quan_in_stock){
            //     throw new Error('Not enough quantity. You requested ' + quantity + ' of product but only ' + currentInventory.quan_in_stock + ' is in stock.');
            // }

            //adjust current quantity and sales in inventory for the product being ordered
            const newQuantity = currentInventory[0].quan_in_stock - quantity
            const newSales = currentInventory[0].sales + quantity

            //update sales and quantity
            await context.prisma.updateManyInventories({
                where: {id: currentInventory.id},
                data: {
                    quan_in_stock: newQuantity,
                    sales: newSales
                },

            })

            //add order to orderline table
            return context.prisma.createOrderline({
                orderlineid,
                quantity,
                product: { connect: {prod_id} },
                orderdate: new Date()
            })

        }
    },
    Inventory: {
        product(root, args, context) {
            return context.prisma.inventory({
                id: root.id
            }).product()
        }
    },
    Product: {
        category(root, args, context) {
            return context.prisma.product({
                prod_id: root.prod_id
            }).category()
        }
    },
    Orderline: {
        product(root, args, context) {
            return context.prisma.orderline({
                orderlineid: root.orderlineid
            }).product()
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