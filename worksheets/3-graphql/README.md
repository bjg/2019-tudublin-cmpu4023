# GraphQL Lab

## Mutations

### Create Customer

Mutation

    mutation {
        createCustomer(firstname: "Robert", lastname: "Vaughan", address1: "BamTown",
        city: "Dublin", zip: 3453, country: "Ireland", email: "rv@gmail.com", creditcardtype: 1,
        creditcard: "424242", creditcardexpiration: "2/22", username: "rv", password: "123456") {
            id
        }
    }

Output

    "data": {
        "createCustomer": {
            "id": "cjtfvs0cy001c070529gkimi0"
        }
    }

### Create Order

Mutation

    mutation {
        createOrder(netamount: 5465.4, tax: 543.4, totalamount: 432.4, customerid:"cjtfvs0cy001c070529gkimi0") {
            id
        }
    }

Output

    "data": {
        "createOrder": {
            "id": "cjtfvsca2001i0705mr46fj4h"
        }
    }

### Create Category

Mutation

    mutation {
        createCategory(categoryname: "Behemoth") {
            id
        }
    }

Output

    "data": {
        "createCategory": {
           "id": "cjtfvsnu3001o0705zryqaj9m"
        }
    }

### Create Product

Mutation

    mutation {
        createProduct(title: "Behemoth", price: 44.44, categoryid:"cjtfvsnu3001o0705zryqaj9m") {
            id
        }
    }

Output

    "data": {
        "createProduct": {
            "id": "cjtfvt1q8001u070564grwxvd"
        }
    }

### Create Order Line

Mutation

    mutation {
        createOrderLine(
            quantity: 3,
            orderdate: "24/07/2017"
            productid:"cjtfvt1q8001u070564grwxvd",
            order: {
                netamount: 554.40,
                tax: 54.30,
                totalamount: 610.60,
                customerid:"cjtfvs0cy001c070529gkimi0"
                }
            ) {
            id
            quantity
        }
    }

Output
    
    "data": {
        "createOrderLine": {
            "id": "cjtfvuphx00230705cu100jve",
            "quantity": 3
        }
    }
    
## Queries

### Get Orders and their Order Lines

Query

    query {
        orders {
            id
            netamount
            orderLines {
                id
                orderdate
            }
        }
    }

Output

    "data": {
        "orders": [
            ...
            {
                "id": "cjtfvupi400240705bdx382dg",
                "netamount": 5465.4,
                "orderLines": [
                    {
                        "id": "cjtfvuphx00230705cu100jve",
                        "orderdate": "24/07/2017"
                    }
                ]
            }
        ]
    }

### Get a customers orders and the order lines associated to said order

Query

    query {
        customers {
            id
            firstname
            orders {
                id
                netamount
                orderLines {
                    id
                    orderdate
                }
            }
        }
    }

Output

    "data": {
        "customers": [
            ...
            {
                "id": "cjtfvs0cy001c070529gkimi0",
                "firstname": "Robert",
                "orders": [
                    {
                        "id": "cjtfvupi400240705bdx382dg",
                        "netamount": 5465.4,
                        "orderLines": [
                            {
                                "id": "cjtfvuphx00230705cu100jve",
                                "netamount": 5465.4
                            }
                        ]
                    }
                ]
            }
        ]
    }