const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

// Define the GraphQL Resolvers
const resolvers = {
    Query: {
        // Part 2: Resovler that returns attributes from a single
        // relation.
        // Multiple resolvers were made here so I could access my data
        // for testing purposes.
        categories(root, args, context) {
            return context.prisma.categories();
        },
        products(root, args, context) {
            return context.prisma.products();
        },
        orderLines(root, args, context) {
            return context.prisma.orderLines();
        },
        orders(root, args, context) {
            return context.prisma.orders();
        },
        customers(root, args, context) {
            return context.prisma.customers();
        },
    },
    // Part 3: Resolver that returns nesting 2 deep from 3 joined database relations
    // This is the resolver that will be called for each customer that will
    // return it's orders and will filter it so that the only the orders
    // for that customer are returned.
    Customer: {
        orders(parent) {
            return prisma.customer({
                id: parent.id
            }).orders();
        }
    },
    // This resolver will be called for each order and will get the orderLines,
    // but it will filter them so that they only match the parent order.
    Order: {
        orderLines(parent) {
            return prisma.orderLines({
                where: {
                    order: {
                        id: parent.id
                    }
                }
            });
        }
    },
    // Mutations. I added more than one just so that I could easily add
    // test data for the schemas I defined.
    Mutation: {
        createCategory(root, args, context) {
            return context.prisma.createCategory(
                {
                    name: args.name
                }
            )
        },
        createProduct(root, args, context) {
            return context.prisma.createProduct(
                {
                    title: args.title,
                    actor: args.actor,
                    price: args.price,
                    special: args.special,
                    category: {
                        connect: { 
                            id: args.category 
                        }
                    }
                }
            )
        },
        createOrderLine(root, args, context) {
            console.log(args);
            return context.prisma.createOrderLine(
                {
                    quantity: args.quantity,
                    orderDate: args.orderDate,
                    product: {
                        connect: {
                            id: args.product
                        }
                    },
                    order: {
                        create: {
                            orderDate: args.order.orderDate,
                            netAmount: args.order.netAmount,
                            tax: args.order.tax,
                            totalAmount: args.order.totalAmount,
                            customer: {
                                connect: {
                                    id: args.order.customer
                                }
                            }
                        }
                    }
                }
            )
        },
        createCustomer(root, args, context) {
            return context.prisma.createCustomer(
                {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    address1: args.address1,
                    address2: args.address2,
                    city: args.city,
                    state: args.state,
                    zip: args.zip,
                    country: args.country,
                    region: args.int,
                    email: args.int, 
                    phone: args.phone,
                    creditCardType: args.creditCardType,
                    creditCard: args.creditCard,
                    creditCardExpiration: args.creditCardExpiration,
                    username: args.username,
                    password: args.password,
                    age: args.age,
                    income: args.income,
                    gender: args.gender
                }
            )
        },
        createOrder(root, args, context) {
            return context.prisma.createOrder(
                {
                    orderDate: args.orderDate,
                    netAmount: args.netAmount,
                    tax: args.tax,
                    totalAmount: args.totalAmount,
                    customer: {
                        connect: { 
                            id: args.customer 
                        }
                    }
                }
            )
        }
    }
}
/*
const resolvers = {
    Query: {
        publishedPosts(root, args, context) {
            return context.prisma.posts({ where: { published: true } })
        },
        post(root, args, context) {
            return context.prisma.post({ id: args.postId })
        },
        postsByUser(root, args, context) {
            return context.prisma.user({
                id: args.userId
            }).posts()
        },
        users(root, args, context) {
            return context.prisma.users();
        }
    },
    Mutation: {
        createDraft(root, args, context) {
            return context.prisma.createPost(
                {
                    title: args.title,
                    author: {
                        connect: { id: args.userId }
                    }
                },

            )
        },
        publish(root, args, context) {
            return context.prisma.updatePost(
                {
                    where: { id: args.postId },
                    data: { published: true },
                },

            )
        },
        createUser(root, args, context) {
            return context.prisma.createUser(
                { name: args.name },
            )
        }
    },
    User: {
        posts(root, args, context) {
            return context.prisma.user({
                id: root.id
            }).posts()
        }
    },
    Post: {
        author(root, args, context) {
            return context.prisma.post({
                id: root.id
            }).author()
        }
    }
}
*/

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: {
        prisma
    },
})
server.start(() => console.log('Server is running on http://localhost:4000'))