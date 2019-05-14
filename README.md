# Massive Index

massive GET /users

massive GET /users/:id

massive GET /products

massive GET /products/:id

massive GET /purchases

massive GET /products_unsafe[?name=string]      -- Injection (Unsafe)

massive GET /products[?name=string]             -- Parameterised Query

massive GET /products_function[?name=string]    -- DB function call

# Sequelize Index

sequelize GET /users

sequelize GET /users/:id

sequelize GET /products

sequelize GET /purchases

sequelize GET /products/:id

sequelize GET /products[?name=string]

sequelize POST /products

sequelize PUT /products/:id

sequelize DELETE /products/:id

# Massive Endpoints

## massive GET /users

curl -X GET http://localhost:3000/users

    [
        {
            "email": "Shari.Julian@yahoo.com",
            "sex": "M"
        },
        {
            "email": "Evelyn.Patnode@gmail.com",
            "sex": "M"
        },
    
        ...
    ]

## massive GET /users/:id

curl -X GET http://localhost:3000/users/1

    {
        "email": "Earlean.Bonacci@yahoo.com",
        "sex": "No sex defined"
    }

## massive GET /users/:id - ERROR

curl -X GET http://localhost:3000/users/51

    {
        "message": "No data with id 51"
    }

## massive GET /products

curl -X GET http://localhost:3000/products

    [
        {
            "title": "Coloring Book",
            "price": "5.99",
            "tags": [
                "Book",
                "Children"
            ]
        },
        {
            "title": "Baby Book",
            "price": "7.99",
            "tags": [
                "Book",
                "Children",
                "Baby"
            ]
        },
    
        ...
    ]

## massive GET /products/:id

curl -X GET http://localhost:3000/products/1

    {
        "title": "Dictionary",
        "price": "9.99",
        "tags": [
            "Book"
        ]
    }

## massive GET /products/:id - ERROR

curl -X GET http://localhost:3000/products/21

    {
        "message": "No data with ID 21"
    }

## massive GET /purchases

curl -X GET http://localhost:3000/purchases

    [
        {
            "title": "Laptop Computer",
            "name": "Adell Mayon",
            "address": "1482 31st St.",
            "email": "Jeremiah.Buonocore@yahoo.com",
            "price": "899.99",
            "quantity": 1,
            "state": "Returned"
        },
        {
            "title": "Laptop Computer",
            "name": "Alfonzo Bodkin",
            "address": "8330 10th Ave.",
            "email": "Zita.Luman@yahoo.com",
            "price": "899.99",
            "quantity": 4,
            "state": "Delivered"
        },
    
        ...
    ]

## massive GET /products_unsafe[?name=string]

curl -X GET 'http://localhost:3000/products_unsafe?name=Dictionary'

    [
        {
            "id": 1,
            "title": "Dictionary",
            "price": "9.99",
            "created_at": "2011-01-01T20:00:00.000Z",
            "deleted_at": null,
            "tags": [
                "Book"
            ]
        }
    ]

## massive GET /products_unsafe[?name=string] - INJECTION

curl -X GET \
  'http://localhost:3000/products_unsafe?name=Python%20Book%27;%20DELETE%20FROM%20purchase_items%20WHERE%20product_id%20=%201;%20DELETE%20FROM%20products%20WHERE%20id%20=%201;%20COMMIT;%20SELECT%20%2A%20FROM%20products%20WHERE%20%271%27=%271'

Shall delete the product of ID 1

    [
        {
            "id": 5,
            "title": "Coloring Book",
            "price": "5.99",
            "created_at": "2011-01-01T20:00:00.000Z",
            "deleted_at": null,
            "tags": [
                "Book",
                "Children"
            ]
        },
        {
            "id": 4,
            "title": "Baby Book",
            "price": "7.99",
            "created_at": "2011-01-01T20:00:00.000Z",
            "deleted_at": null,
            "tags": [
                "Book",
                "Children",
                "Baby"
            ]
        },
    
        ...
    ]

## massive GET /products[?name=string] - PARAMETERISED QUERY

curl -X GET \
  'http://localhost:3000/products?name=Python%20Book'

    [
        {
            "id": 2,
            "title": "Python Book",
            "price": "29.99",
            "created_at": "2011-01-01T20:00:00.000Z",
            "deleted_at": null,
            "tags": [
                "Book",
                "Programming",
                "Python"
            ]
        }
    ]

curl -X GET \
  'http://localhost:3000/products?name=Python%20Book%27;%20DELETE%20FROM%20purchase_items%20WHERE%20product_id%20=%202;%20DELETE%20FROM%20products%20WHERE%20id%20=%202;%20COMMIT;%20SELECT%20%2A%20FROM%20products%20WHERE%20%271%27=%271'

    {
        "message": "No data with title Python Book'; DELETE FROM purchase_items WHERE product_id = 2; DELETE FROM products WHERE id = 2; COMMIT; SELECT * FROM products WHERE '1'='1"
    }

## massive GET /products_function[?name=string] - DB FUNCTION CALL

curl -X GET \
  'http://localhost:3000/products_function?name=Python%20Book'

    [
        {
            "id": 2,
            "title": "Python Book",
            "price": "29.99",
            "created_at": "2011-01-01T20:00:00.000Z",
            "deleted_at": null,
            "tags": [
                "Book",
                "Programming",
                "Python"
            ]
        }
    ]

curl -X GET \
  'http://localhost:3000/products_function?name=Python%20Book%27;%20DELETE%20FROM%20purchase_items%20WHERE%20product_id%20=%202;%20DELETE%20FROM%20products%20WHERE%20id%20=%202;%20COMMIT;%20SELECT%20%2A%20FROM%20products%20WHERE%20%271%27=%271'

    {
        "message": "No title Python Book'; DELETE FROM purchase_items WHERE product_id = 2; DELETE FROM products WHERE id = 2; COMMIT; SELECT * FROM products WHERE '1'='1"
    }

# Sequelize Endpoints

## sequelize GET /users

curl -X GET http://localhost:3000/users

    [
        {
            "email": "jenny@gmail.com",
            "sex": "No sex defined"
        },
        {
            "email": "denny@gmail.com",
            "sex": "No sex defined"
        },
    
        ...
    ]

## sequelize GET /users/:id

curl -X GET  http://localhost:3000/users/51

    {
        "email": "john@gmail.com",
        "sex": "No sex defined"
    }

## sequelize GET /users/:id - ERROR

curl -X GET  http://localhost:3000/users/99

    {
        "message": "No data with ID 99"
    }

## sequelize GET /products

curl -X GET http://localhost:3000/products

    [
        {
            "title": "Coloring Book",
            "price": "5.99",
            "tags": [
                "Book",
                "Children"
            ]
        },
        {
            "title": "Baby Book",
            "price": "7.99",
            "tags": [
                "Book",
                "Children",
                "Baby"
            ]
        },
    
        ...
    ]

## sequelize GET /purchases

curl -X GET http://localhost:3000/purchases

    [
        {
            "name": "Adell Mayon",
            "address": "1482 31st St.",
            "user.email": "Jeremiah.Buonocore@yahoo.com",
            "purchase_items.price": "899.99",
            "purchase_items.quantity": 1,
            "purchase_items.state": "Returned",
            "purchase_items.product.id": 7,
            "purchase_items.product.title": "Laptop Computer"
        },
        {
            "name": "Alfonzo Bodkin",
            "address": "8330 10th Ave.",
            "user.email": "Zita.Luman@yahoo.com",
            "purchase_items.price": "899.99",
            "purchase_items.quantity": 4,
            "purchase_items.state": "Delivered",
            "purchase_items.product.id": 7,
            "purchase_items.product.title": "Laptop Computer"
        },
    
        ...
    ]

## sequelize GET /products/:id

curl -X GET http://localhost:3000/products/21

    {
        "title": "The Video Store",
        "price": "9.99",
        "tags": [
            "Book"
        ]
    }

## sequelize GET /products/:id - ERROR

curl -X GET http://localhost:3000/products/9999

    {
        "message": "No data with ID 9999"
    }

## sequelize GET /products[?name=string]

curl -X GET 'http://localhost:3000/products?name=Behemoth'

    {
        "title": "Behemoth",
        "price": "23.99",
        "tags": [
            "Music",
            "Vinyl"
        ]
    }

## sequelize POST /products

curl -X POST \
  http://localhost:3000/products \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'title=Behemoth&price=10.99&tags=%7B%22tags%22%3A%20%5B%22Music%22%2C%20%22Vinyl%22%2C%20%22Metal%22%5D%7D&id=24'

    {
        "id": 24,
        "title": "Behemoth",
        "price": "10.99",
        "tags": [
            "Music",
            "Vinyl",
            "Metal"
        ],
        "createdAt": "2019-02-15T10:20:36.076Z",
        "deletedAt": null
    }

## sequelize PUT /products/:id

curl -X PUT \
  http://localhost:3000/products/24 \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'title=Behemoth&tags=%7B%22tags%22%3A%20%5B%22Good%22%5D%7D&price=9.99'

    {
        "message": "Update occurred"
    }

curl -X PUT \
  http://localhost:3000/products/27 \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'title=Behemoth&tags=%7B%22tags%22%3A%20%5B%22Good%22%5D%7D&price=9.99'

    {
        "message": "No update"
    }

## sequelize DELETE /products/:id

curl -X DELETE http://localhost:3000/products/24

    {
        "message": "Delete successful"
    }

curl -X DELETE http://localhost:3000/products/24

    {
        "message": "No delete occurred"
    }