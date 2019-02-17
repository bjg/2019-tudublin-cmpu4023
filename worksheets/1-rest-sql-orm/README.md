These are sample outputs of the endpoints for parts 1 - 3

http://localhost:3000/users

[
	{
		email: "Shari.Julian@yahoo.com",
		details: ""sex"=>"M""
	},
	{
		email: "Evelyn.Patnode@gmail.com",
		details: ""sex"=>"M""
	},
	...
]


http://localhost:3000/users/1

[
	{
		email: "Earlean.Bonacci@yahoo.com",
		details: null
	}
]


http://localhost:3000/products

[
	{
		id: 5,
		title: "Coloring Book",
		price: "5.99",
		created_at: "2011-01-01T20:00:00.000Z",
		deleted_at: null,
		tags: [
		"Book",
		"Children"
		]
	},
	...
]


http://localhost:3000/products/1

[
	{
		id: 1,
		title: "Dictionary",
		price: "9.99",
		created_at: "2011-01-01T20:00:00.000Z",
		deleted_at: null,
		tags: [
		"Book"
		]
	}
]


http://localhost:3000/purchases

[
	{
		name: "Letitia Levron",
		address: "5590 50th Ave.",
		email: "Stacia.Schrack@aol.com",
		price: "899.99",
		quantity: 1,
		state: "Delivered"
	},
	...
]

http://localhost:3000/products?name=Dictionary

[
	{
		id: 1,
		title: "Dictionary",
		price: "9.99",
		created_at: "2011-01-01T20:00:00.000Z",
		deleted_at: null,
		tags: [
		"Book"
		]
	}
]


