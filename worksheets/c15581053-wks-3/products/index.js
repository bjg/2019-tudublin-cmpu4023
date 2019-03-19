const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    getCategory(root, args, context) {
      console.log('GET CATEGORIES')
      //From index.d.ts
      return context.prisma.categories()
    },
    getProducts(root, args, context) {
      console.log('GET PRODUCT')
      return context.prisma.productses()
    },

    getReorder(root, args, context) {
      console.log('GET REORDER')
      //From index.d.ts
      return context.prisma.reorders()
    },

    getInventory(root, args, context) {
      console.log('GET INVENTORY')
      //From index.d.ts
      return context.prisma.inventories()
    },
    //Part 3
    getProductsWithCategory(root, args, context) {
      console.log('PRODUCTS WITH CATEGORY')
      console.log(args);
      return context.prisma.categories({
        id: args.category_id
      })
    },

  },

  Mutation: {


    addCategory(root, args, context) {
      console.log('ADD CATEGORY')
      console.log(args)
      return context.prisma.createCategory(
        {
          categoryname: args.categoryname
        },
      )
    },


    addProduct(root, args, context) {
      console.log('ADD PRODUCT')
      console.log(args)
      return context.prisma.createProducts(
        {
          title: args.title,
          actor: args.actor,
          price: args.price,
          special: args.special,
          common_prod_id: args.common_prod_id,
          state: args.state,
          category: { connect: { id: args.category_id,} },
          //reorder: { connect: { id: args.reorder_id,} }
          //inventory: args.inventory,
        },
      )
    },

    addReorder(root, args, context) {
      console.log('ADD REORDER')
      console.log(args)
      return context.prisma.createReorder(
        {
          reorder_id: args.reorder_id,
          date_low: args.date_low,
          quan_low: args.quan_low,
          date_reordered: args.date_reordered,
          quan_reordered: args.quan_reordered,
          date_expected: args.date_expected,
          product: { connect: { id: args.prod_id,} }
        },
      )
    },

    addInventory(root, args, context) {
      console.log('ADD INVENTORY')
      console.log(args)
      return context.prisma.createInventory(
        {
          inventory_id: args.inventory_id,
          quan_in_stock: args.quan_in_stock,
          sales: args.sales,
          product: { connect: { id: args.prod_id,} }
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