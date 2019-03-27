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
		},
		async orderlineById(root, args, context) {
			const o = await context.prisma.orderline({id: args.olid}).product()
			console.log(o);
			return o
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
 		mutation createOrder {
		  createOrder(
			custId: "__CUSTOMER_ID__"
			netamount: 30
		  ){
			id
			customer {
				id
				firstname
				lastname
			}
			date
			netamount
			tax
			totalamount
		  }
		}

		Create an order by providing the customers id, and netamount
		Tax for the country of daniel has been set at 20%
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
		/*
		mutation createCustomer{
		  createCustomer(
			firstname: "John"
			lastname: "Cena"
		  ){
			id
			firstname
			lastname
		  }
		}

		Create a customer by providing a first and last name
		 */
		createCustomer(root, args, context) {
			return context.prisma.createCustomer({
				firstname: args.first,
				lastname: args.last
			})
		},

		/*
		mutation createCategory{
		  createCategory(
			name: "Entertainment"
		  ){
			id
			name
		  }
		}

		Create a new category by providing its name
		 */
		createCategory(root, args, context) {
                        return context.prisma.createCategory({
                                name: args.name
                        })
                },	

		/*
		mutation createOrderline{
		  createOrderline(
			custId: "__CUSTOMER_ID__",
			productId:"__PRODUCT_ID__",
			quantity: 1
		  ){
			id
			quantity
			date
			product {
			  id
			  title
			  price
			  special
			}
				order {
			  id
			  customer {
				id
				firstname
				lastname
			  }
			  date
			  netamount
			  tax
			  totalamount
			}
		  }
		}

		Create orderline will create an orderline row and an order row.
		It accepts the customers id, a product id, and a quantity

		It will retrieve the product from the database by the product id
		then it calculate the netamount by factoring in its special (sale amount)
		and how many of the items are to be purchased.
		Then we create the order using the calculated netamount, the customers id,
		and the total amount which factors in the country of Daniels tax rate which is 20%

		Once this is all done, it then creates the orderline using the new orders id, and the products id.
		 */
		async createOrderline(root, args, context) {
			const date = new Date();
			const p = await context.prisma.product({ id: args.productId });
			const netamount = (p.price - (p.price * (p.special / 100))) * args.quantity;
			const o = await context.prisma.createOrder({ 
				customer: {
					connect: { id: args.custId } 
				},
				date: date.toISOString(),
				netamount: netamount,
				tax: 20,
				totalamount: netamount + (netamount * (20 / 100))
			});
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
};

const server = new GraphQLServer({
  	typeDefs: './schema.graphql',
  	resolvers,
  	context: {
    		prisma
	}
});
server.start(() => console.log('Server is running on http://localhost:4000'));

