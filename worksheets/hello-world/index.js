const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    products(root, args, context) {
      return context.prisma.products()
    },
    inventories(root, args, context){
      return context.prisma.inventories()
    },
    categories(root, args, context){
      return context.prisma.categories()
    },
    productById(root, args, context) {
      return context.prisma.products({ id: args.id })
    },
    productByCategory(root, args, context){
      return context.prisma.products({
        where: {
          category: {
            id: args.id
          }
        },
      })
    },
    
    productByInventory(root, args, context){
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
    /* Question 4
      if there is a reorder, the amount of the product reordered 
      is minused from the products inventory ,
      the price for the product is also increased by 0.1 every time
      there is a reorder
    */
    async createReorder(root, args, context) {

      let inventory_id = "";
      let old_quan = 0;
      let old_price = 0;
      let new_quan = 0;

      await context.prisma.inventories({
        where: {
          product: {
            id: args.product
          }
        },
      }).then(
        data => {
          inventory_id = data[0]['id'];
          old_quan = data[0]['quan_in_stock'];

          new_quan = old_quan - args.quan_reordered;
        }
      )

      await context.prisma.product({
        id: args.product
      }).then(
        data => {
          old_price = data['price'];
          old_price = old_price + 0.1;
        }
      )

      await context.prisma.updateProduct(
        {
          data: {
            price: old_price,
          },
          where: {
            id: args.product
          }
        }
      )

      await context.prisma.updateInventory(
        {
          data: {
            quan_in_stock: new_quan,
          },
          where: {
            id: inventory_id
          }
        }
      )

      return context.prisma.createReorder(
        {
          product: {
            connect: { id: args.product }
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
// Question 5
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000')) 
