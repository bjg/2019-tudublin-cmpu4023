/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 3
 *	Questions: All
 *	Type: Index."
 ***/

const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {

    /***
     * Question (2)
     * 
     * Build a GraphQL query resolver which returns some set 
     * of the the attributes from a single database relation.
     * 
     * Customers    - No Relation
     * Categories   - No Relation
     * Products     - 1 Relation
     * Reorder      - 1 Relation
     * Orders       - 1 Relation
     * Inventory    - 2 Relations
     * Orderlines   - 2 Relations
     * Cust_hist    - 3 Relations - Question (3)
     */
    Query: {
        
        /***
         * CUSTOMERS
         ***/

        /* Retrieve all Customers */
        allCustomers(root, args, context) { 
            return context.prisma.customerses()
        },

        /* Retrieve a Customer with a Specific ID */
        specificCustomers(root, args, context) {
            return context.prisma.customerses({
                where: {
                    id: args.customersId
                }
            })
        },

        /***
         * ORDERS
         ***/

        /* Retrieve all Orders */
        allOrders(root, args, context) { 
            return context.prisma.orderses()
        },

        /* Retrieve an Order with a Specific ID */
        specificOrders(root, args, context) {
            return context.prisma.orderses({
                where: {
                    id: args.ordersId
                }
            })
        },

        /***
         * CATEGORIES
         ***/

        /* Retrieve all Categories */
        allCategories(root, args, context) { 
            return context.prisma.categorieses()
        },

        /* Retrieve a Category with a Specific ID */
        specificCategories(root, args, context) {
            return context.prisma.categorieses({
                where: {
                    id: args.categoriesId
                }
            })
        },

        /***
         * PRODUCTS
         ***/

        /* Retrieve all Products */
        allProducts(root, args, context) { 
            return context.prisma.productses()
        },

        /* Retrieve a Product with a Specific ID */
        specificProducts(root, args, context) {
            return context.prisma.productses({
                where: {
                    id: args.productsId
                }
            })
        },

        /***
         * REORDERS
         ***/

        /* Retrieve all Re-Orders */
        allReorders(root, args, context) { 
            return context.prisma.reorders()
        },

        /* Retrieve a Re-Order with a Specific ID */
        specificReorders(root, args, context) {
            return context.prisma.reorders({
                where: {
                    id: args.reordersId
                }
            })
        },

        /***
         * INVENTORY
         ***/

        /* Retrieve all Inventories */
        allInventory(root, args, context) { 
            return context.prisma.inventories()
        },

        /* Retrieve an Inventory with a Specific ID */
        specificInventory(root, args, context) {
            return context.prisma.inventories({
                where: {
                    id: args.inventoryId
                }
            })
        },

        /***
         * ORDERLINES
         ***/

        /* Retrieve all Order Lines */
        allOrderLines(root, args, context) { 
            return context.prisma.orderlineses()
        },

        /* Retrieve an Order Line with a Specific ID */
        specificOrderLines(root, args, context) {
            return context.prisma.orderlineses({
                where: {
                    id: args.orderlinesId
                }
            })
        },

        /***
         * CUST_HIST
         ***/

        /***
         * Question (3)
         * 
         * Build a GraphQL query resolver which returns the attributes from 3 joined database relations 
         * having 2 levels of nesting in the resultant output.
         * 
         * Joined Tables:
         * - Customers
         * - Orders
         * - Products
         * 
         * Description:
         * - A method to display all the customer's history and a method
         *   to display a specific customer history with the given ID.
         * 
         * - Customer History is like a receipt, it will have it's own unique ID
         *   and it will include the customer, order and product details.
         * 
         * - This has 3 joined database relations and 2 levels of nesting in the output.
         */
        /* Retrieve all Customer Histroy */
        allCustomerHistory(root, args, context) { 
            return context.prisma.cust_hists()
        },

        /* Retrieve a Customer History with a Specific ID */
        specificCustomerHistory(root, args, context) {
            return context.prisma.cust_hists({
                where: {
                    id: args.cust_histId
                }
            })
        }

    }, // End Query
    
    Mutation: {

        /* Creating a User */
        createCustomer(root, args, context) {

            return context.prisma.createCustomers({
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
            },)
        },

        /* Creating an Order */
        createOrder(root, args, context) {

            return context.prisma.createOrders({
                orderdate: args.orderdate,
                netamount: args.netamount,
                tax: args.tax,
                totalamount: args.totalamount,
                customers: {
                    connect: { id: args.customersId }
                }
            },)
        },

        /* Creating a Category */
        createCategory(root, args, context) {

            return context.prisma.createCategories({
                categoryname: args.categoryname
            },)
        },

        /**
         * Question (4)
         * 
         * Create a mutation resolver to add data the database. 
         * Your mutation should update at least two relations (of your choice)
         * 
         * Description:
         * - Upon creating a new Product, a new Inventory will be created for it.
         * - Alongside this, Category can also be created and linked with this Product.
         * 
         * Relations Updated: 
         * - Categories
         * - Inventory
         */
        /* Creating a Product */
        createProduct(root, args, context) {

            return context.prisma.createProducts({
                title: args.title,
                actor: args.actor,
                price: args.price,
                special: args.special,
                common_prod_id: args.common_prod_id,
                categories: {
                    // connect: { id: args.categoriesId },
                    create: { categoryname: args.categoryname }
                },
                inventory: {
                    create: { quan_in_stock: args.quan_in_stock, sales: 0 }
                }
            },)
        },
    
        /* Creating a Re-Order */
        createReorders(root, args, context) {

            return context.prisma.createReorder({
                date_low: args.date_low,
                quan_low: args.quan_low,
                date_reordered: args.date_reordered,
                quan_reordered: args.quan_reordered,
                date_expected: args.date_expected,
                products: {
                    connect: { id: args.productsId }
                }
            },)
        },

        /* Creating Inventory for a Product */
        createInventory(root, args, context) {

            return context.prisma.createInventory({
                quan_in_stock: args.quan_in_stock,
                sales: args.sales,
                products: {
                    connect: { id: args.productsId }
                }
            },)
        },

        /* Creating Order Lines for a Product and Order */
        createOrderline(root, args, context) {

            return context.prisma.createOrderlines({
                quantity: args.quantity,
                orderdate: args.orderdate,
                orders: {
                    connect: { id: args.ordersId }
                },
                products: {
                    connect: { id: args.productsId }
                }
            },)
        },

        /* Creating Customer History */
        createCustomerHistory(root, args, context) {

            return context.prisma.createCust_hist({
                customers: {
                    connect: { id: args.customersId }
                },
                orders: {
                    connect: { id: args.ordersId }
                },
                products: {
                    connect: { id: args.productsId }
                }
            },)
        },

    }, // End Mutation

    /* The link between Orders and Customers */
    Orders: {

        customers(root, args, context) {
            
            return context.prisma.orders({
                id: root.id
            }).customers()
        }
    },

    /* The link between Products, Categories and Inventory */
    Products: {

        categories(root, args, context) {

            return context.prisma.products({
                id: root.id
            }).categories()
        },

        inventory(root, args, context) {

            return context.prisma.products({
                id: root.id
            }).inventory()
        }
    },

    /* The link between Reorder and Products */
    Reorder: {
        
        products(root, args, context) {

            return context.prisma.reorder({
                id: root.id
            }).products()
        }
    },

    /* The link between Inventory and Products */
    Inventory: {
        
        products(root, args, context) {

            return context.prisma.inventory({
                id: root.id
            }).products()
        }
    },

    /* The link between Orderlines, Orders and Products */
    Orderlines: {
        
        orders(root, args, context) {

            return context.prisma.orderlines({
                id: root.id
            }).orders()
        },

        products(root, args, context) {

            return context.prisma.orderlines({
                id: root.id
            }).products()
        }
    },

    /***
     * Question (4)
     * 
     * This links the following tables: Customers, Orders and Products 
     * with the Cust_hist table.
     */
    /* The link for Customer History, Customers, Orders and Products */
    Cust_hist: {

        customers(root, args, context) {
            
            return context.prisma.cust_hist({
                id: root.id
            }).customers()
        },
        
        orders(root, args, context) {

            return context.prisma.cust_hist({
                id: root.id
            }).orders()
        },

        products(root, args, context) {

            return context.prisma.cust_hist({
                id: root.id
            }).products()
        }
    }
    
} // End Resolvers

/***
 * Question (5)
 * 
 * Set up a running GraphQLServer from the graphql-yoga library 
 * to test and demonstrate your resolver queries 
 * and mutations you implemented in sections 2-4 above
 * 
 * Note: All Test Queries can be found in the file named: queries.txt
 */
const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: { prisma },
})
  
server.start(() => console.log('Server is running on http://localhost:4000'))