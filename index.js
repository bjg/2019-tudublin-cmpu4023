const {
  GraphQLServer 
} = require('graphql-yoga')
const { 
  prisma 
} = require('./generated/prisma-client')

const resolvers = {
  Query: {
    //Part Two. Any of the following queries should suffice.
    allCategories: (root, args, context, info) => {
      return context.prisma.categories()
    },
    allProducts: (root, args, context, info) => {
      return context.prisma.products()
    },
    allInventories: (root, args, context, info) => {
      return context.prisma.inventories()
    },
    allReorders: (root, args, context, info) => {
      return context.prisma.reorders()
    },
    allCustomers: (root, args, context, info) => {
      return context.prisma.customers()
    },
    allOrders: (root, args, context, info) => {
      return context.prisma.orders()
    },
    //Part Three. This query returns Orderline information, product information,
    //and the product category. It can be used to see product details for each
    //line of an order. The lineDetails resolver performs the same function but
    //an ID is used to specify the order line. 
    allOrderlines: (root, args, context, info) => {
      return context.prisma.orderlines()
    },
    allCust_hist: (root, args, context, info) => {
      return context.prisma.cust_hists()
    },
    lineDetails: (root, args, context, info) => {
      return context.prisma.orderlines({id: args.id})
    },
  },
  Mutation: {
    createCategories: (root, args, context) => {
      return context.prisma.createCategory({
	categoryname: args.categoryname,
      })
    },
    createProducts: (root, args, context) => {
      return context.prisma.createProduct({
        title: args.title,
	actor: args.actor,
	price: args.price,
	special: args.special,
        common_prod_id: args.common_prod_id,
	category: {
	  connect: {
	    id: args.categoryId
	  }
        }
      })
    },
    createInventories: (root, args, context) => {
      return context.prisma.createInventory({
	quan_in_stock: args.quan_in_stock,
	sales: args.sales,
	product: {
	  connect: {
	    id: args.productId
	  }
	}
      })
    },
    createReorders: (root, args, context) => {
      return context.prisma.createReorder({
	date_low: args.date_low,
	quan_low: args.quan_low,
	date_reordered: args.date_reordered,
	quan_reordered: args.quan_reordered,
	date_expected: args.date_expected,
	product: {
	  connect: {
	    id: args.productId
	  }
	}
      })
    },
    createCustomers: (root, args, context) => {
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
    //This mutation can be used to create an order and add the relation to
    //customer table.
    createOrders: (root, args, context) => {
      return context.prisma.createOrder({
	orderdate: args.orderdate,
	netamount: args.netamount,
	tax: args.tax,
	totalamount: args.totalamount,
        customer: {
	  connect: {
	    id: args.customerId
	  }
	}
      })
    },
    createOrderlines: (root, args, context) => {
      return context.prisma.createOrderline({
        quantity: args.quantity,
	orderdate: args.orderdate,
	product: {
	  connect: {
	    id: args.productId
	  }
	},
	order: {
	  connect: {
	    id: args.orderId
	  }
	}
      })
    },
  },
  Product: {
    category(root, args, context)  {
      return context.prisma.product({
	id: root.id
      }).category()
    },
  },
  Inventory: {
    product(root, args, context)  {
      return context.prisma.inventory({
        id: root.id
      }).product()
    },
  },
  Reorder: {
    product(root, args, context)  {
      return context.prisma.reorder({
	id: root.id
      }).product()
    },
  },
  Order: {
    customer(root, args, context) {
      return context.prisma.order({
	id: root.id
      }).customer()
    },
  },
  Orderline: {
    order(root, args, context) {
      return context.prisma.orderline({
	id:root.id
      }).order()
    },
    product(root, args, context) {
      return context.prisma.orderline({
	id:root.id
      }).product()
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: { prisma },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
