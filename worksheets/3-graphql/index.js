const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    products(root, args, context) {
      return context.prisma.products()
    },
    categories(root, args, context){
      return context.prisma.categories()
    },
    inventories(root, args, context){
      return context.prisma.inventories()
    },
    productById(root, args, context) {
      return context.prisma.product({ id: args.id })
    },
    productsByCategory(root, args, context){
      return context.prisma.products({
        where: {
          category: {
            id: args.id
          }
        },
      })
    },
    /*
      Retrieve the current inventory for a given product,
      this can be used to check the current inventory level
      for a particular product in the system, we can then
      determine if we need to purchase more stock
    */
    inventoryForProducts(root, args, context){
      return context.prisma.inventories({
        where: {
          product: {
            id: args.id
          }
        },
      })
    },
  },
  Mutation: {
    createCategory(root, args, context) {
      return context.prisma.createCategory(
        {
          categoryname: args.categoryname
        },
      )
    },
    createProduct(root, args, context) {
      return context.prisma.createProduct(
        {
          title: args.title,
          category: {
            connect: { 
              id: args.category 
            }
          },
          actor: args.actor,
          price: args.price,
          special: args.special,
          common_prod_id: args.common_prod_id
        },
      )
    },
    createInventory(root, args, context) {
      return context.prisma.createInventory(
        {
          product: {
            connect: { id: args.product }
          },
          quan_in_stock: args.quan_in_stock,
          sales: args.sales,
        },
      )
    },
    /*
      when a reorder is created, the reordered quantity of stock
      is taken away from the current inventory of the product in
      question, the price for the product is also increased by 1
      the reorder is then added to the database 

      this is to keep the database consistent, and also modify
      out product prices to reach demand (this modify can be 
      carried out on any field, price has just been used as an 
      example here)
    */
    async createReorder(root, args, context) {

      let inv_id = "";
      let prev_quan = 0;
      let old_price = 0;
      let new_quan = 0;

      await context.prisma.inventories({
        where: {
          product: {
            id: args.prod_id
          }
        },
      }).then(
        data => {
          inv_id = data[0]['id'];
          prev_quan = data[0]['quan_in_stock'];

          new_quan = prev_quan - args.quan_reordered;
        }
      )

      await context.prisma.product({
        id: args.prod_id
      }).then(
        data => {
          old_price = data['price'];
          old_price++;
        }
      )

      await context.prisma.updateProduct(
        {
          data: {
            price: old_price,
          },
          where: {
            id: args.prod_id
          }
        }
      )

      await context.prisma.updateInventory(
        {
          data: {
            quan_in_stock: new_quan,
          },
          where: {
            id: inv_id
          }
        }
      )

      return context.prisma.createReorder(
        {
          prod_id: {
            connect: { id: args.prod_id }
          },
          date_low: args.date_low,
          quan_low: args.quan_low,
          date_reordered: args.date_reordered,
          quan_reordered: args.quan_reordered,
          date_expected: args.date_expected
        },
      )
    },
  },
  Product: {
    category(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).category()
    }
  },
  Inventory: {
    product(root, args, context) {
      return context.prisma.inventory({
        id: root.id
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