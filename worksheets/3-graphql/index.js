const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers ={

  Query:{
    getProducts(root, args, context){
      return context.prisma.products()
    },
    
    getProductById(root, args, context){
      return context.prisma.products({
        id: args.id
      })
    },
     
    getCategories(root, args, context){
      return context.prisma.category()
    },
  
    getCategoryById(root, args, context){
      return context.prisma.category({
        category: args.category
      })
    },

   /* 2) Build a GraphQL query resolver which returns some set of the the attributes 
        from a single database relation. */
    getReorders(root, args, context){
      return context.prisma.reorders({
      where:{quan_reordered_gte: args.num}
      })
    },


    /* 3) Build a GraphQL query resolver which returns the attributes from 3 joined database 
         relations having 2 levels of nesting in the resultant output */
    Reorder: {
      reorder(root, args, context) {
        return context.prisma.order({
          id: root.id
        }).reorder()
      }
    },
    Inventory: {
      prod_id(root, args, context) {
        return context.prisma.inventory({
          id: root.id
        }).prod_id()
      }
    },
    Product: {
      category(root, args, context) {
        return context.prisma.category({
          id: root.id
        }).category()
      },
      inventory(root, args, context) {
        return context.prisma.product({
          id: root.id
        }).inventory()
      },
    },
  },  // end of query


  Mutation: {
    createInventory(root, args, context){
      return context.prisma.createInventory(
        {
          quan_in_stock: args.stock,
          sales: 0,
          prod_id: {
            create:{
              title:args.title,
              price: args.price,
              category: {
                  where:{ id: args.id},
                  category_name: args.category_name
              }
            }
          }
        })
    },

    /* 4) Create a mutation resolver to add data the database. Your mutation should
      update at least two relations (of your choice) */
      createReorder(root, args, context){
        return context.prisma.reorder({
          id: args.id,
          prod_id: args.prod_id,
          date_low: args.date_low,
          quan_low: args.quan_low,
          date_reordered: args.date_reordered,
          quan_reordered: args.quan_reordered,
          date_expected: args.date_expected
        }).prod_id()
      },

      createProduct(root, args, context) {
        return context.prisma.createProduct({
          title: args.title,
          actor: args.actor,
          price: args.price,
          special: args.special,
          common_prod_id: args.common_prod_id
        })
      },

  },  // end of mutation
}



const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma 
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))