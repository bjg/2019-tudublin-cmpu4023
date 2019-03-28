const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

//Resolvers
const resolvers = {
    Query: {
        products(root, args, context) {
            return context.prisma.products();
        },
		productByCategory(root, args, context) {
            return context.prisma.products({
                where: {
                   category: {
                        id: args.id
					}
				},
			})
		},
		
 	Mutation: {
		createProduct(root, args, context) {
			return context.prisma.createProduct({
				title: args.title,
				actor: args.actor,
				price: args.price,
				special: args.special,
				common_prod_id: args.common_prod_id,
				category: {
					connect: { 
						id: args.category
							}
						},
					},
				)
			},
		}
    }
}

//Server connection
const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: {
        prisma
    },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
