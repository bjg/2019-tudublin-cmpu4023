const { GraphQLScalarType }= require('graphql')
const { Kind } = require('graphql/language')
const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    createdProducts(root, args, context) {
      return context.prisma.products({ where: { prod_id: true } })
    },
    createdCategories(root, args, context) {
      return context.prisma.category({ where: { category: true } })
    },
    createdInventory(root, args, context) {
      return context.prisma.inventory({ where: { prod_id: true } })
    },
    createdReorder(root, args, context) {
      return context.prisma.reorder({ where: { prod_id: true } })
    },
  },
  Mutation: {
    createdProducts(root, args, context) {
      return context.prisma.createdProducts(
        {
          prod_id: args.prod_id

        },

      )
    },
    createdCategories(root, args, context) {
      return context.prisma.createdCategories(
        {
          category: args.category

        },

      )
    },
    createdInventory(root, args, context) {
      return context.prisma.createdInventory(
        {
          prod_id: args.prod_id

        },

      )
    },
    createdReorder(root, args, context) {
      return context.prisma.createdReorder(
        {
          prod_id: args.prod_id

        },

      )
    },
  },
  Products: {
    products(root, args, context) {
      return context.prisma.products({
        id: root.prod_id
      }).products()
    }
  },
  Reorder: {
    reorder(root, args, context) {
      return context.prisma.reorder({
        id: root.prod_id
      }).reorder()
    }
  },
  Inventory: {
    inventory(root, args, context) {
      return context.prisma.inventory({
        id: root.prod_id
      }).inventory()
    }
  },
  Categories: {
    categories(root, args, context) {
      return context.prisma.categories({
        id: root.prod_id
      }).categories()
    }
  },
 DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) 
      }
      return null;
    },
  })
}
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
