const { prisma } = require('./prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    products(root, args, context) {
      return context.prisma.products()
    },
    orders(root, args, context) {
      	return context.prisma.orders()
    },
    order(root, args, context) {
      	return context.prisma.orders({where:{id:args.id}})
    },  
    orderlines(root, args, context) {
      return context.prisma.orderlines()
    },
    categories(root, args, context) {
      return context.prisma.categories()
    }
  },
  Mutation: {
    createProduct(root, args, context) {
      return context.prisma.createProduct(
        {
          title: args.title,
          price: args.price,
          category: {
            connect: {id:args.category}
          }
        },

      )
    },
    createCategory(root, args, context) {
      return context.prisma.createCategory(
        { categoryname: args.categoryname },
      )
    },
    createOrderline(root, args, context) {
      return context.prisma.createOrderline(
        { product: { connect:{id:args.product}},
          quantity: args.quantity }
      )
    },
    /*Creates an order and its orderlines in one query
    I decided to create this because an Order without Orderlines
    is redundant, will also connect orderlines to their respective
    products*/
  createOrder(root, args, context) {
  	  var orderlines = []
  	  args.order.orderlines.forEach(orderline => {orderlines.push({product:{connect:{id:orderline.product}}, quantity:orderline.quantity})});
  	  
      return context.prisma.createOrder({
      	orderdate: args.order.orderdate,
      	orderlines:{create:orderlines}
      	}
      )
    }
  },
  /*The following resolves resolve relations between tables
  allowing for nested queries. These resolves allows a user/client
  to view the orderlines within an order, the products, for each
  orderline and the category of each product. These resolvers are not
  query specific and will automatically resolve relations in any query*/
  Order: {
    orderlines(root, args, context) {
      return context.prisma.order({
        id: root.id
      }).orderlines()
    }
  },
  Orderline: {
    product(root, args, context) {
      return context.prisma.orderline({
        id: root.id
      }).product()
    }
  },
  Product: {
    category(root, args, context) {
      return context.prisma.product({
        id: root.id
      }).category()
    }
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


