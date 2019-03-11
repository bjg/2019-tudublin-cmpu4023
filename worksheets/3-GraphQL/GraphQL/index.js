const { prisma } = require('./generated/prisma-client')

// A `main` function so that we can use async/await
async function main() {

  // Create a new user called `Alice`
  const newUser = await prisma.createUser({ name: 'Alice' })
  console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`)

  // Read all users from the database and print them to the console
  const allUsers = await prisma.users()
  console.log(allUsers)

  // Fetch a single user
  const user = await prisma
  .user({ id: 'cjt4gja74000h0703jmreyal3' })

  // Filtered user list
  const usersCalledAlice = await prisma
  .users({
    where: {
      name: 'Alice'
    }
  })

  // Update a users name
  const updatedUser = await prisma
  .updateUser({
    where: { id: 'cjt4gja74000h0703jmreyal3' },
    data: { name: 'Bob' }
  })

  // Delete a user
  const deletedUser = await prisma
  .deleteUser({ id: 'cjt4gja74000h0703jmreyal3' })
}

main().catch(e => console.error(e))