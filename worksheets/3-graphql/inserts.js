const { prisma } = require('./generated/prisma-client');

async function main() {
	let newCustomer = await prisma.createCustomer({firstname: 'David', lastname: 'Lemon'});
        console.log(`Created new user: ${newCustomer.firstname} (ID: ${newCustomer.id})`);
	newCustomer = await prisma.createCustomer({firstname: 'Lauren', lastname: 'Melon'});
        console.log(`Created new user: ${newCustomer.firstname} (ID: ${newCustomer.id})`);
	newCustomer = await prisma.createCustomer({firstname: 'Daniel', lastname: 'Orange'});
        console.log(`Created new user: ${newCustomer.firstname} (ID: ${newCustomer.id})`);
	
	let tech = await prisma.createCategory({name: 'Technology'});
	console.log(`Created new category: ${tech.name} (ID: ${tech.id})`);
	let pets = await prisma.createCategory({name: 'Pets'});
        console.log(`Created new category: ${pets.name} (ID: ${pets.id})`);
	let food = await prisma.createCategory({name: 'Food'});
        console.log(`Created new category: ${food.name} (ID: ${food.id})`);
	let sports = await prisma.createCategory({name: 'Sports'});
        console.log(`Created new category: ${sports.name} (ID: ${sports.id})`);
	
}

main().catch(e => console.error(e));
