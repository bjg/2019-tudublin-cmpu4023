const {
  prisma
} = require('./generated/prisma-client')
const {
  GraphQLServer
} = require('graphql-yoga')

function update(context,args){
  console.log('Updating the inventory quantity')

  return context.prisma.updateInventory({
    data: {
      quantity_in_stock:15,
      sales:1,
      testupdate: "UPDATED!"
    },   
    where: {
      id: args.inventoryId
    }
  })
}
//part 2, 3 ,4 
const resolvers = {
  Query: {
    /*
        part 1
        Single Table Queries
    */
    getCategoriesEndpoint(root, args, context) {
      console.log('-------- SELECTING CATEGORIES ------------')
      return context.prisma.categories()
    },

    getCategoriesWhereEndpoint(root, args, context) {
      console.log('-------- SELECTING CATEGORIES WHERE ID = ' + args.catId + ' ------------')
      return context.prisma.categories({
        where: {
          id: args.catId
        }
      })
    },

    getCustomersEndpoint(root, args, context) {
      console.log('-------- SELECTING CUSTOMERS ------------')
      return context.prisma.customers()
    },

    getProductsEndpoint(root, args, context) {
      console.log('-------- SELECTING Products ------------')
      return context.prisma.productses()
    },

    getOrdersEndpoint(root, args, context) {
      console.log('-------- SELECTING ORDERS ------------')
      return context.prisma.orderses()
    },

    getCust_HistsEndpoint(root, args, context) {
      console.log('-------- SELECTING CUST_HIST ------------')
      return context.prisma.cust_Hists()
    },

    getInventoryEndpoint(root, args, context) {
      console.log('-------- SELECTING inventory ------------')
      return context.prisma.inventories()
    },

    //part 2
    getProductsByCategoryEndpoint(root, args, context) {
      console.log('-------- Products By Category ------------')
      console.log(args);
      return context.prisma.category({
        id: args.categoryId
      })

    },
    getOrderlinesEndpoint(root, args, context) {
      console.log('-------- Selecting Orderlines ------------')
      return context.prisma.orderlineses()

    },
  }, //end query

  Mutation: {
    //create category
    createCategoryEndpoint(root, args, context) {
      console.log('-------- INSERTING CATEGORY ------------')
      console.log(args)
      return context.prisma.createCategory({
        categoryname: args.categoryname
      }, )
    },

    //create category
    createCustomerEndpoint(root, args, context) {
      console.log('-------- INSERTING CUSTOMER ------------')
      console.log(args)
      return context.prisma.createCustomer({
        firstname: args.firstname,
        lastname: args.lastname,
        address1: args.address1,
        address2: args.address2,
        city: args.city,
        state: args.state,
        zip: args.zip,
        county: args.county,
        region: args.region,
        email: args.email,
        phone: args.phone,
        creditcardtype: args.creditcardtype,
        creditcard: args.creditcard,
        creditcardexpiration: args.creditcardexpiration,
        username: args.username,
        password: args.password,
        age: args.age,
        income: args.income,
        gender: args.gender
      }, )
    },

    createProductsEndpoint(root, args, context) {
      console.log('-------- INSERTING Product ------------')
      console.log(args)
      return context.prisma.createProducts({
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prod_id: args.common_prod_id,
        category: {
          connect: {
            id: args.categoryId
          }
        }
      })
    },

    createInventoryEndpoint(root, args, context){
      console.log('-------- INSERTING INVENTORY ------------')
      console.log(args)

      return context.prisma.createInventory({
        quantity_in_stock: args.quantity_in_stock,
        sales: args.sales,
        testupdate: "notupdatedyet",
        product: {
          connect: {
            id: args.productId
          }
        }
      
      } )

    },

    createOrdersEndpoint(root, args, context) {
      console.log('-------- INSERTING ORDERS ------------')
      console.log(args)
      return context.prisma.createOrders({
        orderdate: args.orderdate,
        netamount: args.netamount,
        tax: args.tax,
        totalamount: args.totalamount,
        customer: {
          connect: {
            id: args.customerId
          }
        }
      }, )
    },

    //part 4. Briefly, describe an application of the query you have chosen to write as a comment in your resolver code
    /*
     
Application example:
The query in this case would be a good example of a transactional relational system. When a customer purchases an item the inventory stock is affected. This can be modified to have triggers to alert the manager to order more stock or automate this process. This type of query is very common with ecommerce websites such as amazon, tesco, river island etc.. 


    */

    createCust_HistEndpoint(root, args, context) {
      console.log('-------- INSERTING Cust_Hists ------------')
      console.log(args)
      return context.prisma.createCust_Hist({
        customer: {
          connect: {
            id: args.customerId
          }
        },
        order: {
          connect: {
            id: args.orderId
          }
        },
        product: {
          connect: {
            id: args.productId
          }
        }

      })
    },

    //part 4 - mutation that adds new order to the database
    createOrderlinesEndpoint(root, args, context) {
      console.log('-------- INSERTING ORDERLines ------------')
      console.log(args)

      //when orderlines created - take the quatity, and subtract this from the inventory quantity of that product
      console.log('------ You are ordering ' + args.quantity + ' of product:' + args.productId)

      let check = update(context,args);
      check.then(data=>{
        console.log(data.quantity_in_stock)
      })

      console.log('---------- INVENTORY QUANTITY UPDATED FOR PRODUCT :' + args.productId)
      
      return context.prisma.createOrderlines({
        product: {
          connect: {
            id: args.productId
          }
        },
        order: {
          connect: {
            id: args.orderId
          }
        },
        quantity: args.quantity,
        orderdate: args.orderdate,
        inventoryId: args.inventoryId


      }, )
    },


  }, //end mutation

  //part 3
  /**
   * Application example:
The query in this case would be a good example of a many to many join. We can easily get data from 3 or 4 tables. In the case of an application, we could get all orders by a customer and all of the products on that order also. We could also return all of the categories each of those products belong to.

Return:
	All Orders of Customer “eric strong”
	All Products that belong to that order
	All of the categories for each of those products
   */
  // this gets the products.category value defined in the schema
  Products: {
    category(root, args, context) {
      return context.prisma.products({
        id: root.id
      }).category()
    }
  },


  Orders: {
    customer(root, args, context) {
      return context.prisma.orders({
        id: root.id
      }).customer()
    }
  },

  Cust_Hist: {
    customer(root, args, context) {
      return context.prisma.cust_Hist({
        id: root.id
      }).customer()
    },
    order(root, args, context) {
      return context.prisma.cust_Hist({
        id: root.id
      }).order()
    },
    product(root, args, context) {
      return context.prisma.cust_Hist({
        id: root.id
      }).product()
    },
  },

  Inventory:{
    product(root, args, context) {
        return context.prisma.inventory({
          id: root.id
        }).product()
    }
  },


  Orderlines:{
    product(root, args, context) {
        return context.prisma.orderlines({
          id: root.id
        }).product()
    },
    order(root, args, context) {
      return context.prisma.orderlines({
        id: root.id
      }).order()
    },

  }

} // end resolvers

//part 5
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
