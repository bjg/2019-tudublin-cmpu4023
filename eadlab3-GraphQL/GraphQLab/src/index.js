const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('../generated/prisma-client')

const typeDefs = `
type Query { 
    category: [Categories!]!
    title: String! 
}

type Categories {
    category: ID!
    categoryname: String!
}
`

let categories = [{
    category: '20',
    categoryname: 'Action',
}]

const resolvers = {
    Query: {
        prod_id: () => `15`,
        // 2
        category: () => categories,
    },
    // 3
    Categories: {
        category: (parent) => parent.category,
        categoryname: (parent) => parent.categoryname
    }
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))