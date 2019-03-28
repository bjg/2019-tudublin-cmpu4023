const { prisma } = require('./generated/prisma-client')
	const { GraphQLServer } = require('graphql-yoga')
	
	const resolvers = {
	  Query: {

                    Querycategories(root, args, context){
	                return context.prisma.categories()
	               },
	            Queryproducts(root, args, context) {
	                 return context.prisma.products()
	               },
	    
	            Queryinventories(root, args, context){
	                 return context.prisma.inventories()
	            },
                    Queryreorders(root, args, context){
                          return context.prisma.reorders()
                     },


                   productsByCategory(root, args, context){
	                 return context.prisma.products({
	                  where: {
	                            category: {id: args.id}
	                          },
	                  })
	            },
	      
	           inventoryByProducts(root, args, context){
	                     return context.prisma.inventories({
	                           where: {
	                                 product: {id: args.id}
	                                 },
	                            })
	             }, 
             
	  },


	  //Question 4
	  Mutation: {
	    createCategory(root, args, context) {
	      return context.prisma.createCategory(
	        {
	          categoryname: args.categoryname
	        },
	      )
	    },

	    createProduct(root, args, context) {
	      return context.prisma.createProduct(
	        {
	          title: args.title,
	          category: {
	            connect: { 
	              id: args.category 
	            }
	          },
	          actor: args.actor,
	          price: args.price,
	          special: args.special,
	          common_prod_id: args.common_prod_id
	        },
	      )
	    },
	    createInventory(root, args, context) {
	      return context.prisma.createInventory(
	        {
	          product: {
	            connect: { id: args.product }
	          },
	          quan_in_stock: args.quan_in_stock,
	          sales: args.sales,
	        },
	      )
	    },
	    
	    createReorder(root, args, context) {
	      return context.prisma.createReorder(
	        {
	          prod_id: {
	            connect: { id: args.prod_id }
	          },
	          date_low: args.date_low,
	          quan_low: args.quan_low,
	          date_reordered: args.date_reordered,
	          quan_reordered: args.quan_reordered,
	          date_expected: args.date_expected
	        },
	      )
	    },
	  },

         
               //Question 3
	  Product: {
	    category(root, args, context) {
	      return context.prisma.product({
	        id: root.id
	      }).category()
	    }
	  },

	  Inventory: {
	    product(root, args, context) {
	      return context.prisma.inventory({
	        id: root.id
	      }).product()
	    }
	  },
	}
	
	const server = new GraphQLServer({
	  typeDefs: './schema.graphql',
	  resolvers,
	  context: {
	    prisma
	  },
	})
	server.start(() => console.log('Server is running on http://localhost:4000'))
