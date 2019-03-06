const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

// Define the GraphQL Resolvers
const resolvers = {
    Query: {
        // Part 2: Resolver that returns the categories
        categories(root, args, context) {
            return context.prisma.categories();
        },
        customers(root, args, context) {
            return context.prisma.customers();
        },
        /*customer(root, args, context) {
            return context.prisma.customer({
                id: args.id
            }).order();
        }*/
    },
    Customer: {
        orders(parent) {
            return prisma.customer({
                id: parent.id
            }).orders();
        }
    },
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
                        connect: { id: args.category }
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
                        connect: { id: args.customer }
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