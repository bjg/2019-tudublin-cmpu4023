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
    /* Part 3: Resolver that returns nesting 2 deep from 3 joined database relations
    This is the resolver that will be called for each customer that will
    return it's orders and will filter it so that the only the orders
    for that customer are returned.
    Example:
    An application of this resolver would be to allow an application to get each customer and for
    each customer their orders and for each order, their order lines. This would be useful
    for an invoicing application or something similar that would be able to report on all information
    regarding orders and order lines purchased. It could be used by a business to potenitally calculate
    order totals for accounts or reporting. */
    Customer: {
        orders(parent) {
            return prisma.customer({
                id: parent.id
            }).orders();
        }
    },
    /* This resolver will be called for each order and will get the orderLines,
    but it will filter them so that they only match the parent order. */
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
    /* Mutations. I added more than one just so that I could easily add
    test data for the schemas I defined. */
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
        /* Part 4. The requirement was to add to one and update or add to a second.
        For this mutator, it will create an OrderLine and it will link it to a particular
        product. It will then also create an order for that order line and it will also
        link that order to a particular customer.
        Example:
        An application for this query would be for generating a new order for a customer
        by a billing application. If there is no current order, create an order line which 
        will handle taking care of the first order line and also the order itself.
        If there are already order lines present, then the billing application could just update
        by adding another but by just linking it to the particular order created by this mutation. */
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
        // Other Mutations for testing and adding data.
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

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: {
        prisma
    },
})
server.start(() => console.log('Server is running on http://localhost:4000'))