/*
  Name: Robert Vaughan
  StudentNo: C15341261

  A node script that will allow a user to query upon
  data via a GraphQL client.
*/

const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");

const resolvers = {
  
  Query: {
    orders(root, args, context) {
      return context.prisma.orders()
    },
    orderLines(root, args, context) {
      return context.prisma.orderLines()
    },
    customers(root, args, context) {
      return context.prisma.customers()
    },
    products(root, args, context) {
      return context.prisma.products()
    },
    categories(root, args, context) {
      return context.prisma.categories()
    }
  },

  // The following resolvers all for the nested 
  // query to occur within the GraphQL client.
  // The basic idea is to get all OrderLines associated
  // by a users order. The purpose of such a query could.
  // be to fetch the dates associated with a cutomers
  // order. In a real world scenrio, it would make somewhat
  // sense to tie the order date with the Product to Order
  // relationship established by OrderLine. Therefore, the purpose
  // of querying this date is key for it allows one to understand
  // when a product order was made. If you wanted to get even more
  // fancy, you could even fetch the products too.
  Customer: {
    orders(root, args, context) {
      return context.prisma.customer({
        id: root.id
      }).orders()
    }
  },
  Order: {
    orderLines(root, args, context) {
      return context.prisma.orderLines({
        where: {
          order: {
            id: root.id
          }
        }
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

    createCustomer(root, args, context) {
      return context.prisma.createCustomer(
        {
            firstname: args.firstname,
            lastname: args.lastname,
            address1: args.address1,
            address2: args.address2,
            city: args.city,
            zip: args.zip,
            country: args.country,
            email: args.email,
            creditcardtype: args.creditcardtype,
            creditcard: args.creditcard,
            creditcardexpiration: args.creditcardexpiration,
            username: args.username,
            password: args.password
        },
      )
    },

    createOrder(root, args, context) {
      return context.prisma.createOrder(
        {
            netamount: args.netamount,
            tax: args.tax,
            totalamount: args.totalamount,
            customer: {
                connect: { 
                    id: args.customerid 
                }
            }
        },
      )
    },

    createProduct(root, args, context) {
      return context.prisma.createProduct(
        {
            title: args.title,
            price: args.price,
            category: {
                connect: {
                    id: args.categoryid
                }
            }
        },
      )
    },

    // The primary reason as to why this mutation would be present
    // within the application is to allow a business to create
    // a link between an product and an order when such an
    // order is initalised. For instance, if a customer makes
    // and order, we need to establish the orderLine along with
    // the product and the customer tied to the aforementioned order.
    // One could also approach this question by creating an order which
    // then creates an OrderLine (or a list of OrderLines).
    createOrderLine(root, args, context) {
      return context.prisma.createOrderLine(
        {
            quantity: args.quantity,
            orderdate: args.orderdate,
            product: {
                connect: { 
                    id: args.productid
                }
            },
            order: {
                create: {
                    netamount: args.order.netamount,
                    tax: args.order.tax,
                    totalamount: args.order.totalamount,
                    customer: {
                        connect: { 
                            id: args.order.customerid 
                        }
                    }
                }
            }
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