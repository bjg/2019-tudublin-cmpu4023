const { GraphQLScalarType }= require('graphql')
const { Kind } = require('graphql/language')
const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    // put querys here
    createdProdcuts(root, args, content){
      return content.prisma.products({id: args.prod_id})
    }
  },
  Mutation: {
    createProdcuts(root, args, context) {
      return context.prisma.createProdcuts({
        prod_id: args.prod_id,
        category: args.category,
        title: args.title,
        actor: args.actor,
        price: args.price,
        special: args.special,
        common_prod_id: args.common_prod_id
      })

    }

  },
  // end mutation
  Products: {
    products(root, args, context){
    return context.prisma.products({
      prod_id: root.id,
      category: root.id,
      title: root.string,
      actor: root.string,
      price: root.string,
      special: root.int,
      common_prod_id: root.id

    })
  }
    
  },
  Reorder: {
    reorder(root, args, context){
      return context.prisma.reorder({
        prod_id: root.id,
        date_low: root.DateTime,
        quan_low: root.int,
        date_reordered: root.DateTime,
        quan_reordered: root.int,
        date_expected: root.int

      })
    }
  },
  Inventory: {
    inventory(root, args, context){
      return context.prisma.inventory({
        prod_id: root.id,
        quan_in_stock: root.int,
        sales: root.int
      })
    }
  },
  Categories: {
    category(root, args, context){
      return context.prisma.category({
        category: root.id,
        categoryname: root.string
      })
    }
    
  },
  Date: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
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