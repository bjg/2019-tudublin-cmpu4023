const {
  prisma
} = require('./generated/prisma-client')
const {
  GraphQLServer
} = require('graphql-yoga')

// Q2 & Q3
// Sample Query
// The query is resolved in the third part seen below 
// the fuction returns all reorders and products where the prod_id matches
// query{	
//   reorders(first: 10){
//     quan_low
//     product{
//       prod_id
//     }
//   }
// }

const resolvers = {
  Query: {
    products(root, args, context) {
      return context.prisma.products({})
    },
    product(root, args, context) {
      return context.prisma.product({
        id: args.prod_id
      })
    },
    reorders(root, args, context) {
      return context.prisma.product({
        where: {
          prod_id: args.prod_id
        }
      }).reorders()
    },
  },
// Q4
// Sample Mutation Query
// Here we are using a nested mutation to update the Reorder table
// And update the product table
// mutation{
//   createReorder(
//     data:{
//       date_low:"datetimeEntry",
//       quan_low:1,
//       date_reordered:"datetimeEntry",
//       quan_reordered: 10,
//       date_expected:"datetimeEntry",
//       product:{
//         create:{
//           prod_id: 101,
//           title: "test title",
//           actor:"test actor",
//           price:1,
//           sepcial:1
//         }
//       }
//     }
//   ){
//     quan_low,
//     product{
//       prod_id,
//       price
//     }
//   }
// }

  Mutation: {
    createOrder(root, args, context) {
      return context.prisma.createOrders({
          orderdate: args.orderDate,
          netamout: args.netamount,
            tax: args.tax,
            totalamount: args.tax + args.netamout,
            customer: {
              connect: {
                customerID: args.cust_id
              }
            }
        },
      )
    },

    createProduct(root, args, context) {
      return context.prisma.createProduct({
          title: args.title,
          actor: args.actor,
          price: args.price,
          special: args.special
        },

      )
    },
    createReOrder(root, args, context) {
      return context.prisma.createReOrder({
        date_low: args.date_low,
        quan_low: args.quan_low,
        date_reordered: args.date_reordered,
        quan_reordered: args.quan_reordered,
        date_expected: args.date_expected,
        product: {
          connect: {
            prod_id: args.prod_id
          }
        }
      })
    },
    createOrderlines(root, args, context) {
      return context.prisma.createReOrder({
        orderlinesid: args.orderlinesid,
        quantity: args.quantity,
        orderdate: args.orderdate,

        product: {
          connect: {
            prod_id: args.prod_id
          },
          orders: {
            connect: {
              orderid: args.orderid
            }
          }
        }
      })
    },
  },
}
// Q5
// GraphQL Server

// Q1
// Please see typeDefs in schema.graphQL for the tables and their 
// relations I've defined
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4466'))