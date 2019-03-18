const { prisma } = require('./generated/prisma-client');
const { GraphQLServer } = require('graphql-yoga');

const resolvers = {
	Query: {
		customers(root, args, context) {
			return context.prisma.customers()
		},
		products(root, args, context) {
			return context.prisma.products()
		},
		categories(root, args, context) {
			return context.prisma.categories()
		},
		orders(root, args, context) {
			return context.prisma.orders()
		},
		orderlines(root, args, context) {
			return context.prisma.orderlines()
		}
		
	},
	Mutation: {
		/*
 		mutation createLaptop{
 		  createProduct(
 		    title: "Laptop"
 		    catId: "__CATEGORY_ID__"
 		    price: 800
 		    special: 0
 		  ){
 		    id
 		    title
 		    price
 		    special
 		  }
 		}
		
		Create a product by providing a categoryID, title, price, and special offer
 		*/
		createProduct(root, args, context) {
			return context.prisma.createProduct({
				title: args.title,
				category: {
					connect: { id: args.catId }
				},
				price: args.price,
				special: args.special,
			})
		},

		/*
 		
		*/
		createOrder(root, args, context) {
			const date = new Date(); 
			return context.prisma.createOrder({
				customer: {
					connect: { id: args.custId }
				},
				date: date.toISOString(),
				netamount: args.netamount,
				tax: 20,
				totalamount: args.netamount + (args.netamount * (20 / 100))
			})
		},
		createCustomer(root, args, context) {
			return context.prisma.createCustomer({
				firstname: args.first,
				lastname: args.last
			})
		},
		createCategory(root, args, context) {
			return context.prisma.createCategory({
				name: args.name
			})
		},
		async createOrderline(root, args, context) {
			const date = new Date();
			const p = await context.prisma.product({ id: args.productId })
			const netamount = (p.price - (p.price * (p.special / 100))) * args.quantity
			const o = await context.prisma.createOrder({ 
				customer: {
					connect: { id: args.custId } 
				},
				date: date.toISOString(),
				netamount: netamount,
				tax: 20,
				totalamount: netamount + (netamount * (20 / 100))
			})
			console.log(p.price);
			
			return context.prisma.createOrderline({
				order: {
					connect: { id: o.id }
				},
				product: {
					connect: { id: p.id} 
				},
				quantity: args.quantity,
				date: date.toISOString()
			})
		}
	},
	Product: {
		category(root, args, context) {
			return context.prisma.product({
				id: root.id
			}).category()
		}
	},
	Order: {
		customer(root, args, context) {
			return context.prisma.order({
				id: root.id
			}).customer()
		}
	},
	Orderline: {
		order(root, args, context) {
			return context.prisma.orderline({
				id: root.id
			}).order()
		},
		product(root, args, context) {
			return context.prisma.orderline({
				id: root.id
			}).product()
		}
	}
}

const server = new GraphQLServer({
  	typeDefs: './schema.graphql',
  	resolvers,
  	context: {
    		prisma
	}
});
server.start(() => console.log('Server is running on http://localhost:4000'));

