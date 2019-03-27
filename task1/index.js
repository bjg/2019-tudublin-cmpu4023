const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
	//Start Queries
	Query: {
		getCustomer(root, args, context) {
			return context.prisma.customers()
		},
		getCustomerById(root, args, context) {
			return context.prisma.customer({
				id: args.id
			})
		},
		getProducts(root, args, context) {
			return context.prisma.products()
		},
		getOrders(root, args, context) {
			return context.prisma.orders()
		},
		getCategories(root, args, context) {
			return context.prisma.categories()
		}
	},	//End Queries
	
	//Start Mutations
	Mutation: {
		
		//Create Customer
		createCustomer(root, args, context) {
			return context.prisma.createCustomer({
				firstname: args.firstname,
				lastname: args.lastname,
				address1: args.address1,
				address2: args.address2,
				city: args.city,
				state: args.state,
				zip: args.zip,
				country: args.country,
				region: args.region,
				email: args.email,
				phone: args.phone,
				creditcardtype: args.creditcardtype,
				creditcard: args.creditcard,
				creditcardexpiration: args.creditcardexpiration,
				username: args.username,
				password: args.password,
				age: args.age,
				income: args.income,
				gender: args.gender
			})
		},
		
		//Create Products
		createProducts(root, args, context) {
			return context.prisma.createProducts({
				category: {
					connect: {id: args.categoryId}
				},
				title: args.title,
				actor: args.actor,
				price: args.price,
				special: args.special,
				common_prod_id: args.common_prod_id
			})
		},
		
		//Create Orders
		createOrders(root, args, context) {
			return context.prisma.createOrders({
				orderdate: args.orderdate,
				customerid: {
					connect: {id: args.customerId}
				},
				netamount: args.netamount,
				tax: args.tax,
				totalamount: args.totalamount
			})
		},
		
		//Create Categories
		createCategories(root, args, context) {
			return context.prisma.createCategories({
				categoryname: args.categoryname
			})
		}
	} //End Mutations
}// End resolvers

//Configure GraphQL Server
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4646'))
 
