const model = require("./server/models/index")

model.users.bulkCreate([
	{id: 101, email: "test3@test.com", password: "adfadsflkafgakjsh"},
	{id: 102, email: "test4@test.com", password: "afdafgasggasgasdf"}
]);

model.products.bulkCreate([
	{id: 101, title: "new product 1", price: "12.34", tags: ["stuff"]},
	{id: 102, title: "new product 2", price: "56.78", tags: ["stuff"]}
]);

model.purchases.bulkCreate([
	{id: 1001, name: "J J", address: "123 Fake st.", zip: "12345", state: "AB", user_id: 1},
	{id: 1002, name: "K K", address: "124 Fake st.", zip: "12345", state: "AB", user_id: 2}
]);

model.purchase_items.bulkCreate([
	{id: 10001, purchase_id: 1, product_id: 1, price: 12.34, quantity: 2, state: "Delivered"},
	{id: 10002, purchase_id: 2, product_id: 2, price: 56.78, quantity: 3, state: "Delivered"}
]);
