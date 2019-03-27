const {
    prisma
} = require("./generated/prisma-client");
const {
    GraphQLServer
} = require("graphql-yoga");

const resolvers = {
    Query: {

        getCategories(root, args, context) {
            return context.prisma.categories();
        }, //Part 2
        getProducts(root, args, context) {
            return context.prisma.products();
        },
        getReorders(root, args, context) {
            return context.prisma.reorders();
        },
        getInventories(root, args, context) {
            return context.prisma.inventories();
        },

        //Part 3
        lowInventoryProducts(root, args, context) {
            return context.prisma.inventories({
                where: {
                    quan_in_stock_lt: 5
                }
            });
        }
    },
    Mutation: {
        addCategory(root, args, context) {
            return context.prisma.createCategory({
                categoryname: args.name
            });
        },
        //Part 4 Mutation that updates at least two relationship
        //This mutation creates a new reoder and changs the price of the product as well as the quantitiy in the inventory
        /**
         * A Business Scenario for this mutation will be when a new reorder is made to a new supplier
         * so the price might change and needs to be updated.
         */
        async reorderDifferentPrice(root, args, context) {

            const reorder = await context.prisma.createReorder({
                date_low: args.date_low,
                quan_low: args.quan_low,
                date_reordered: args.date_reordered,
                quan_reordered: args.quan_reordered,
                prod_id: {
                    connect: {
                        id: args.prod_id
                    }
                }
            })

            await context.prisma.updateProduct({
                where: {
                    id: args.prod_id
                },
                data: {
                    price: args.new_price
                }
            })

            var invId;
            var currStock;

            await context.prisma.inventories({
                where: {
                    prod_id: {
                        id: args.prod_id
                    }
                },
            }).then(inv => {
                invId = inv[0]['id']
                currStock = inv[0]['quan_in_stock']
            });

            await context.prisma.updateInventory({
                where: {
                    id: invId
                },
                data: {
                    quan_in_stock: currStock + args.quan_reordered
                },
            })

            return reorder;
        }
    },
    //These relationships are defined in order to get information from other nodes
    //when calling the queries
    Inventory: {
        prod_id(root, args, context) {
            return context.prisma
                .inventory({
                    id: root.id
                })
                .prod_id();
        }
    },
    Reorder: {
        prod_id(root, args, context) {
            return context.prisma
                .reorder({
                    id: root.id
                })
                .prod_id();
        }
    },
    Product: {
        category(root, args, context) {
            return context.prisma
                .product({
                    id: root.id
                })
                .category();
        }
    }
};


//PART 5: Code to set up the server
const server = new GraphQLServer({
    typeDefs: "./schema.graphql",
    resolvers,
    context: {
        prisma
    }
});
server.start(() => console.log("Server is running on http://localhost:4000"));

// A `main` function so that we can use async/await
async function main() {
    //Create a new category
    const newCategory = await prisma
        .createCategory({
            categoryname: ""
        })
    console.log(`Created new Categoty: ${newCategory.categoryname} (ID: ${newCategory.id})`)

    //Retrieve all categories
    const allCategories = await prisma.categories();
    console.log(allCategories);

    //Create new product
    const newProduct = await prisma
        .createProduct({
            category: {
                connect: {
                    id: 'cjtfw71up000n0957x2vvhej9'
                }
            },
            title: "Shirt",
            actor: "?",
            price: 40,
            special: 1,
            common_prod_id: 002
        })
    console.log(`Created new Product: ${newProduct.title} (ID: ${newProduct.id})`)

    //Get All products
    const allProducts = await prisma.products();
    console.log(allProducts);

    //Create  new Inventory
    const newInventory = await prisma
        .createInventory({
            prod_id: {
                connect: {
                    id: 'cjtfwtlto001x0957u7bvytrs'
                }
            },
            quan_in_stock: 3,
            sales: 20
        })
    console.log(`Created new Inventory: ${newInventory.quan_in_stock} (ID: ${newInventory.id})`)

    const allInventories = await prisma.inventories();
    console.log(allInventories);

    const allReorders = await prisma.reorders();
    console.log(allReorders);
}

main().catch(e => console.error(e));