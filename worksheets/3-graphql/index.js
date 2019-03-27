const { prisma } = require('./generated/prisma-client');
const { GraphQLServer } = require('graphql-yoga');

const resolvers = {
  Query: {

    /* PART 2: Query resolver which returns some set of the the attributes from
    a single database relation i.e. Product */

    getProducts(root, args, context) {
      return context.prisma.products()
    },
    getCategories(root, args, context){
      return context.prisma.categories()
    },
    getProductById(root, args, context) {
      return context.prisma.product({id: args.id})
    },
    getProductsByCategory(root, args, context) {
      return context.prisma.products({
        where: {
          category: {
            id: args.id
          }
        }
      })
    },
    getInventories(root, args, context){
      return context.prisma.inventories()
    },
    getReorders(root, args, context){
      return context.prisma.reorders()
    },
    
    /* PART 3: Query resolver which returns the attributes from 3 joined
    database relations having 2 levels of nesting in the resultant output 

    > 3 database relations: Inventory, Product, Category
    > 2 levels of nesting: (Product) title, (Category) categoryname

    This query uses the product ID to return the inventory details for that product.
    Including details about the product and it's category. 
    ID = Forest Gump

    */
    getInventoryByProduct(root, args, context){
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
    createProduct(root, args, context) {
      return context.prisma.createProduct({
          category: {connect: { id: args.category }}, 
          title: args.title,
          actor: args.actor,
          price: args.price,
          special: args.special, 
          common_prod_id: args.common_prod_id
        })
    },
    createCategory(root, args, context) {
      return context.prisma.createCategory({
        categoryname: args.categoryname
      })
    },
    createInventory(root, args, context) {
      return context.prisma.createInventory({
          product: {connect: {id: args.product}},
          quan_in_stock: args.quan_in_stock, 
          sales: args.sales
      })
    },
    
    /* PART 4: Create a mutation resolver to add data the database,
    updating at least two relations.

    > mutation resolver: createReorder 
    > updated relations: Reorder, Inventory, Product

    This query assumes that a stock check has occured in normal business practice. 
    The product "Forest Gump" has been identified as low in stock (quan_low = 5) 
    A reorder is placed on that product to replenish stock levels (quan_reordered = 50)

    The reorder involves: 
    1. finding the inventory for the product using the product ID 
    2. from that extracting the inventory ID (to update the inventory later)
    3. then we use the product ID to get the price for the product from the products table
    4. we calculate a discounted sale price based on the original price
    5. then we call updateProduct to update the product with the new sale price (parsing to control decimal formatting)
    6. finally we call updateInventory to update the inventory to change the stock level to that identified in the stock check
        
    Product ID: Forest Gump

    */ 
    async createReorder(root, args, context){
      let inventory = "";
      let stock = args.quan_low;
      let price = 0;
      let discount = 0.9;
      let discounted = 0;
      let sale_price = 0;
      
      // use the product ID to get it's inventory
      await context.prisma.inventories({
        where: {
          product: {
            id: args.product
          }
        },
    }).then(
      // get the inventory ID (for updateInventory function later) 
      data => {
        inventory = data[0]['id'];
      }
    )

    // as the product is low in stock and we are ordering more
    // we discount the low stock to clear it out before 
    // the new stock arrives
    await context.prisma.product({
      id: args.product
    }).then(
      data => {
        // get the current price
        price = data['price'];
        // calculate the discounted price
        discounted = price * discount;
        // parse the value to a float of 2 decimal places
        sale_price = parseFloat(discounted.toFixed(2));
        //console.log("sale price: " + sale_price);
      }
    )

    // update the price in the product to the new sale price 
    await context.prisma.updateProduct({
      data: {
        price: sale_price
      },
      where: {
        id: args.product
      }
    })

    // update the inventory levels for the product 
    // to the new stock level - identified during manual stock check
    await context.prisma.updateInventory({
      data: {
        quan_in_stock: stock,
      }, 
      where: {
        id: inventory
      }
    })

    // create a reorder entry in the database
    return context.prisma.createReorder({
      product: {
        connect: {id: args.product}
      }, 
      date_low: args.date_low,
      quan_low: args.quan_low,
      date_reordered: args.date_reordered,
      quan_reordered: args.quan_reordered,
      date_expected: args.date_expected
    })
    },
  },
  // associations
  Inventory: {
    product(root, args, context) {
      return context.prisma.inventory({id: root.id}).product()
    }
  },
  Product: {
    category(root, args, context) {
      return context.prisma.product({id: root.id}).category()
    }
  },
  Reorder: {
    product(root, args, context) {
      return context.prisma.reorder({id: root.id}).product()
    }
  }

}

/* PART 5: Running GraphQLServer from the graphql-yoga library to test and
demonstrate resolver queries and mutations */

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))