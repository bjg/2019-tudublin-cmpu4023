// This program initialises the database with some dummy data for testing.
const { prisma } = require('./generated/prisma-client')

async function main() {

    // Orders.
    const order1 = await prisma.createOrder({amount: 9.50});
    const order2 = await prisma.createOrder({amount: 5.50});

    // Categories.
    const fruit = await prisma.createCategory({name: "fruit"});
    const drinks = await prisma.createCategory({name: "drinks"});

    // Products.
    const apple = await prisma.createProduct({
        title: "apple",
        price: 1,
        category: {connect: {id: fruit.id}},
    });
    const pear = await prisma.createProduct({
        title: "pear",
        price: 2,
        category: {connect: {id: fruit.id}},
    });
    const coke = await prisma.createProduct({
        title: "coke",
        price: 1.50,
        category: {connect: {id: drinks.id}},
    });
    const pepsi = await prisma.createProduct({
        title: "pepsi",
        price: 2,
        category: {connect: {id: drinks.id}},
    });

    // Order 1's orderlines.
    const pear_order1 = await prisma.createOrderline({
        quantity: 3,
        product: {connect: {id: pear.id}},
        order: {connect: {id: order1.id}},
    });
    const apple_order1 = await prisma.createOrderline({
        quantity: 2,
        product: {connect: {id: apple.id}},
        order: {connect: {id: order1.id}},
    });
    const coke_order1 = await prisma.createOrderline({
        quantity: 1,
        product: {connect: {id: coke.id}},
        order: {connect: {id: order1.id}},
    });

    // Order 2's orderlines.
    const pepsi_order2 = await prisma.createOrderline({
        quantity: 2,
        product: {connect: {id: pepsi.id}},
        order: {connect: {id: order2.id}},
    });
    const coke_order2 = await prisma.createOrderline({
        quantity: 1,
        product: {connect: {id: coke.id}},
        order: {connect: {id: order2.id}},
    });

  const ol = await prisma.orderlines();
  console.log(ol);
}

main().catch(e => console.error(e))

