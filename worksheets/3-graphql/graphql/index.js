const { GraphQLScalarType }= require('graphql')
const { Kind } = require('graphql/language')
const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    // put querys here
  },
  Mutation: {
    products(root, args, context) {

    },
    reorder(root, args, context) {

    },
    inventory(root, args, context) {

    },
    categories(root, args, content){

    },


  },
  // end mutation
  Products: {
  },
  Reorder: {
  },
  Inventory: {
  },
  Categories: {
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