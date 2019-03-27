const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    getExistingCategories(root, args, context) {
      return context.prisma.categories()
    },
     //This query takes an id and returns all the information about an specific category.
    getCategoryByID(root, args, context) {
      return context.prisma.categories({
        where: {
          id: args.catId
        }
      })
    },
    getExistingProducts(root, args, context) {
      return context.prisma.products()
    },
    //This query takes an id and returns all the information about an specific product.
    getProductByID(root, args, context) {
      return context.prisma.products({
        where: {
          id: args.prodId
        }
      })
    },
    getExistingInventory(root, args, context) {
      return context.prisma.inventories()
    },
    getExistingOrderLines(root, args, context) {
      return context.prisma.orderLineses()
    },
    getExistingOrders(root, args, context) {
      return context.prisma.orders()
    },
  },
  /*Part 3: This resolvers are functions necessary to query and display nested fields of tables. 
  With them we can achieve queries from multiple relations having 2 levels of nesting in the output.*/
  Product: {
    category(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).category()
    },
    inventory(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).inventory()
    },
  },
  Inventory: {
    prod_id(root, args, context) {
      return context.prisma.inventory({
        id: root.id
      }).prod_id()
    }
  },
  Order: {
    orderline(root, args, context) {
      return context.prisma.order({
        id: root.id
      }).orderline()
    }
  },
  OrderLines: {
    product(root, args, context) {
      return context.prisma.orderLines({
        id: root.id
      }).product()
    },
    order(root, args, context) {
      return context.prisma.orderLines({
        id: root.id
      }).order()
    },
  },

  Mutation: {
    createNewCategory(root, args, context) {
      return context.prisma.createCategory({
        categoryname: args.categorynames
        })
    },
    /*Part 4: The following mutation creates a product which is assigned to a category. 
    As a result of this it also creates a new record in the inventory table which is link to this product. 
    This query is useful to keep control of the stock of products that in the database.It also set an initial quantity of stock for the created product*/
    createNewProduct(root, args, context) {
      return context.prisma.createProduct({
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prod_id: args.common_prod_id,
        category: {
          connect: {
            id: args.categoryId
          }
        },
        inventory: {
          create: {
            quan_in_stock: args.stock_quantity,
            sales: 0
          }
        }
      })
    },
    /*This mutation creates a customer's order in the database. 
    It also creates a link from the product table to the order table through the orderlines table 
    which stores the primary of both of the (product ID and order ID) and some other fields. The quantity in stock fiel of the 
    inventory table is updated. This is calculated by substracting the quantity bought from the current stock in the inventory*/
    async createNewOrder(root, args, context) {
      var stock, inventory_id;
      const orders= context.prisma.createOrder({
        orderdate: args.orderdate,
        customer: args.customer_name,
        netamount: args.netamount,
        tax: args.tax,
        totalamount: args.totalamount,
        orderline:{
          create:{
            product: {
              connect:{
                id: args.product_id
              }
            },
            quantity: args.quantity,
            orderdate: args.orderdate
          }
        }
      });
      
      //Search for the inventory id and stock of the product. This is required to update the inventory table.
      await context.prisma.inventories({
          where: {
              prod_id: {
                  id: args.product_id
              }
          },
      }).then(output => {
          inventory_id = output[0]['id']
          stock = output[0]['quan_in_stock']
      });
      //Update the inventory that corresponds to the product bought by a user.
      await context.prisma.updateInventory({
        data: {
            quan_in_stock: stock - args.quantity
        },
        where: {
          id: inventory_id
        }
      })
     
      return orders;
    }

  }//end of mutations

   
}//end of resolvers
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))