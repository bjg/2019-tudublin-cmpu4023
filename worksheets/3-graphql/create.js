const { prisma } = require('./generated/prisma-client')

// A `main` function so that we can use async/await
async function main() {

  // Create a new user called `Alice`
  const newCustomer = await prisma.createCustomer({ name: 'Alice' })
  console.log(`Created new customer: ${newCustomer.name} (ID: ${newCustomer.id})`)

  // Read all users from the database and print them to the console
  const allCustomers = await prisma.customers()
  console.log(allCustomers)
}

main().catch(e => console.error(e))
