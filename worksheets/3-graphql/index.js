const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers ={

  Query:{
   
    getCategories(root,args, context){
    return context.prisma.categoreys()
    },

    getCategoryById(root,args,context){
      return context.prisma.categorey({
        categorey: args.categorey
      })
    },

    getProducts(root,args,context){
      return context.prisma.productses()
    },
    
    getProductById(root,args,context){
      return context.prisma.products({
        id: args.id
      })
    },
    
    //Part 2: Build a GraphQL query resolver which returns some set of the the attributes from a single database relation.
    // getReorders takes in a number from the client and uses that to query the number of reorders. 
    //In the real world this would be used to prep a stock room to allocate space for incmoing deliveres
     getReorders(root,args,context){
      return context.prisma.reorders({
        where:{quan_reordered_gte: args.num}
      })
    },

    // query{
    //   getReorders(num: 10){
    //     date_low
    //     quan_low
    //     quan_reordered
    //     prod_id{
    //       title
    //     }
    //     }
    //   }   


    //Part 3. When calling getInventories, I can get the quanity in stock and sales of all products and also by connecting the products table find the title, price of the products
    //Then by connecting products to category we can find out what categorey each product belongs to. 
    //In a real world scenrio this would be used to see how each deptarment is performing while also keepings an eye on best seeling products
    getInventories(roo,arg,context){
      return context.prisma.inventories()
    }

        // query{
    //   getInventories{
    //     quan_in_stock
    //     sales
    //     prod_id{
    //       title
    //       id
    //       price
    //       categorey{
    //         categorey_name
    //       }
    //     }
    //   }
    // }
  },

  Mutation: {
//a new product has come into store so it needs to be added to the database.
//This mutation adds data to the inventory, products and tot the categorey tables
    createInvetory(root, args, context){
      return context.prisma.createInvetory(
        {
          quan_in_stock: args.stock,
          sales: 0,
          prod_id: {
            create:{
              title:args.title,
              price: args.price,
              categorey: {
                  where:{id:args.id},
                  categorey_name:args.categorey
              }
            }
          }
        })
    }
  },
  //Taken care of / resolving the reationships between the tables.
 
  Reorder:{
    prod_id(root,args,context){
      return context.prisma.reorder({
        id: root.id
      }).prod_id()
    }
  },

  Inventory:{
    prod_id(root,args,context){
      return context.prisma.inventory({
        id: root.id
      }).prod_id()
    }
  },

  Products:{
      categorey(root, args, context){
        return context.prisma.products({
          id: root.id
        }).categorey()
      },
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