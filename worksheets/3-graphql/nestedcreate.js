const { prisma } = require('./generated/prisma-client')

// A `main` function so that we can use async/await
async function main() {
    // Create a new user with a new post
    const newCustomer = await prisma.createCustomer({
        name: "John",
        email: "jsohn@john.com",
        orders: {
            create: [{
                date: 1553012719,
                amount: 10.00,
            }, {
                date: 1553012234,
                amount: 5.00,
            }]
        },
    });
    console.log(`Created new customer: ${newCustomer.name} (ID: ${newCustomer.id})`)
    
    // Read all users from the database and print them to the console
    const allUsers = await prisma.customers()
    console.log(allUsers)
    
    const allPosts = await prisma.orders()
    console.log(allPosts)
}

main().catch(e => console.error(e))
