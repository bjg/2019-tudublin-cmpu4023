# Question 1:
Chose the 4 relations reorder, inventory, products and categories.
I then created these relationships (see datamodel.prisma) in graphql and populated them with the following values.

## Categories
mutation {
  createCategory(categoryname: "Mops") {
    id
  }
}
### Returns with:
{
  "data": {
    "createCategory": {
      "id": "cjtrlitla00ow0745zm0fi5lv"
    }
  }
}

## Products
mutation {
  createProduct(title: "Wowomop",actor:"he", price:9.50,
  category:"cjtrj13if00og0745fmdfop1b" {
    id
  }
}
### Returns with:
{
  "data": {
    "createProduct": {
      "id": "cjtrk82a100ol07458tz4ts9m"
    }
  }
}

## Inventory
mutation {
  createInventory(quan_in_stock: 10, sales:1,
  prod_id:"cjtrk82a100ol07458tz4ts9m") {
	id
  }
}
### Returns with:
{
  "data": {
    "createInventory": {
      "id": "cjtrlm17h00p60745jup299ev"
    }
  }
}

## Reorder
mutation {
  createReorder(quan_low: 10, quan_reordered: 10
  prod_id:"cjtrk82a100ol07458tz4ts9m") {
	id
  }
}
### Returns with:
{
  "data": {
    "createReorder": {
      "id": "cjtrlouza00pb0745bzrgselx"
    }
  }
}

# Question 2 - Return set of attributes from single relation:
## Query for id, title, actor & price attributes from Products relation
query {
    Products {
        id
        title
	actor
	price
    }
}
### Returns with:
  "data": {
    "Products":[
		{
		  "id": "cjtrk82a100ol07458tz4ts9m",
		  "title": "Wowomop",
		  "actor": "he",
		  "price": 9.50
		}
	  ]
	}
# Question 3 - Query with 3 relation joins and atleast two-levels of nesting: 
## This query will use the products relation to join with the category and inventory relation. The real world application of this query is the following:
#### This allows a product to have their category name displayed along with the amount of sales for that product and quantity in stock. It would be beneficial to use to see how well certain categories of products are doing in terms of sales, or if too much stock has been purchased for certain categories.
query {
    Products {
        id
        title
	actor
	price
        category {
            id
            categoryname
        }
	inventory {
            id
            quan_in_stock
	    sales
        }
    }
}

### Returns with:
  "data": {
    "Products":[ 
		{
		  "id": "cjtrk82a100ol07458tz4ts9m",
		  "title": "Wowomop",
		  "actor":"he",
		  "price":9.50,
		  "category":[
			{
				"id": "cjtrj13if00og0745fmdfop1b",
				"categoryname": "Mops"
			}
		  ],
		  "inventory":[
			{
				"id": "cjtrlm17h00p60745jup299ev",
				"quan_in_stock": 10,
				"sales":1
			}
		  ]
		}
	]
  }
  
  # Question 4
  ## This resolver adds data to the inventory & category relations. The real world application of this resolver is the following:
  #### It allows for when a new product is added with a new category, this new category value can be added alongside the stock & sales of the new product. An example could be a new Gadget that doesn't have a defined category yet, this resolver could create the new category of the product with the stock of the item. The resolver eliminates the middleman in a potential edge case of a new product which does not belong to an aleady defined category. Eg of such a case:
  mutation{
	  createInventoryCategory(
		quan_in_stock:3,
		sales: 2,
		prod_id:"cjtrk82a100ol07458tz4ts9m",
		Category:{
			categoryname: "NewCategory"
		}){		
			id
		}
	}
### Returns with:
{
  "data": {
    "createInventoryCategory": {
      "id": "cjtro8jml00pj0745xjwyge5u"
    }
  }
}	

# Question 5
## Done, will demonstrate in the lab.
