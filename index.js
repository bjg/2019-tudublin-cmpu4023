const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    user(root, args, context) {
      return context.prisma.user({ id: args.name })
    },

    catagories(root, args, context) {
      return context.prisma.catagories({ catname: args.name })
    },

    orderlines(root, args, context) {
      return context.prisma.orderlines({ oltitle: args.name })
    },

    order(root, args, context) {
      return context.prisma.order({ ordtax: args.int })
    },

    products(root, args, context) {
      return context.prisma.products({ prodcategory: args.name, prodtitle: args.name, prodprice: args.int })
    }
  },
  Mutation: {
    createCategories(root, args, context) {
      return context.prisma.createUser(
        { catname: args.name },
      )
    },

    createOrderlines(root, args, context) {
      return context.prisma.createUser(
        { oltitle: args.name },
      )
    },

    createOrders(root, args, context) {
      return context.prisma.createUser(
        { ordtax: args.int },
      )
    },

    createProducts(root, args, context) {
      return context.prisma.createUser(
        { prodcategory: args.name, prodtitle: args.name, prodprice: args.int},
      )
    }
  },

  Products: {
    products(root, args, context) {
      return context.prisma.products({
        prodid: root.id,
        prodcategory: root.string,
        prodtitle: root.string,
        prodprice: root.int,
        prodorderlines: orderlines
      })
    }
  },

  Orders: {
    orders(root, args, context) {
      return context.prisma.orders({
        id: root.id,
        ordid: root.id,
        ordtax: root.int,
        ordorderlines: orderlines
      })
    }
  },

  Orderlines: {
    orderlines(root, args, context) {
      return context.prisma.orderlines({
        olid: root.id,
        oltitle: root.string
      })
    }
  },

  Categories: {
    categories(root, args, context) {
      return context.prisma.categories({
        catid: root.id,
        catname: root.string,
        catProd: products,
      })
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
server.start(() => console.log(`Server is running on http://localhost:4000`))