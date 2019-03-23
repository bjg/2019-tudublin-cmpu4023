const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

async function getProductPrice(productId) {
  let product = await prisma
    .product({
      id: productId
    })
  return product.price;
  console.log("Product Price: " + product);
}

async function getOrder(orderId) {
  let order = await prisma
    .order({
      id: orderId
    })
  return order;
  console.log("Order:\n" + order);
}

async function updateOrderPrice(orderId, newTotal) {
  let order = await prisma
    .updateOrder({
      data: {
        total_amount: newTotal
      },
      where: {
        id: orderId
      }
    })
  console.log("New Order:\n" + order);
}

const resolvers = {
  Query: {
    /* 
       Part 2:
       - the below query resolver returns all customers from the customer table
    */
    allProducts(root, args, context) {
      return context.prisma.products()
    },

    /* 
       Part 3:
       - The below query can be used to retrieve all order lines - including order, customer and
         product info - of a specific user based on their username
    */
    orderLinesByCustomer(root, args, context) {
      return context.prisma.orderLines({
        where: {
          order_every: {
            customer_every: {
              username: args.customerUsername
            }
          }
        }
      })
    }

  },

  Mutation: {
    addOrderLine(root, args, context) {

     let newTotal;

      // Retrieve product price and begin promis chaining
      getProductPrice(args.productId)
        .then(price => {
          // Retrieve specific order in which orderline is being added to
          getOrder(args.orderId)
            .then(order => {
              // Calculate the new total_amount value of the order and parse to float
              newTotal = parseFloat((order.total_amount + (args.quantity * price)).toFixed(2));
              // Update order
              updateOrderPrice(args.orderId, newTotal);
            })
        })

      return context.prisma.createOrderLine({
        order: {
          connect: {
	    id: args.orderId
	  }
	},
	product: {
	  connect: {
	    id: args.productId
	  }
	},
	quantity: args.quantity
      })

    }
  },

  // Creates connection between related tables to allow nested queries
  Order: {
    customer(root, args, context) {
      return context.prisma.order({
        id: root.id
      }).customer()
    }
  },
  OrderLine: {
    order(root, args, context) {
      return context.prisma.orderLine({
        id: root.id
      }).order()
    },
    product(root, args, context) {
      return context.prisma.orderLine({
        id: root.id
      }).product()
    }
  }

}


// Part 5:
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
