# Lab Week 3

## Nested Mutation

### Query

	mutation{
	  createOrder(order:{
	    orderdate:"19/03/19", 
	    orderlines:[
	      {quantity:1, product:"cjtfycdm300310735zfjrf2jm"}
	      ,{quantity:3, product:"cjtfyemz9003g0735rwvt2lmd"},
	    	{quantity:1, product:"cjtfyfqek003n0735f1qf18oq"}]})
	  {
    	id
	  }
	}
	
### Response

	{
	  "data": {
	    "createOrder": {
	      "id": "cjtfykx1500400735vpvbl32f"
	    }
	  }
	}
	
	
## Nested Query

### Nested Query with Param

	query{
	  order(id:"cjtfykx1500400735vpvbl32f"){
	    id
	    orderdate
	    orderlines{
	      quantity
	      product{
	        title
	        price
	        category{
	          categoryname
	        }
	      }
	    }
	  }
	}
	
### Reponse

	{
	  "data": {
		"order": [
		  {
		    "id": "cjtfykx1500400735vpvbl32f",
		    "orderdate": "19/03/19",
		    "orderlines": [
		      {
		        "quantity": 1,
		        "product": {
		          "title": "Programming Music",
		          "price": 20,
		          "category": {
		            "categoryname": "CD"
		          }
		        }
		      },
		      {
		        "quantity": 3,
		        "product": {
		          "title": "Programming Book",
		          "price": 25,
		          "category": {
		            "categoryname": "Book"
		          }
		        }
		      },
		      {
		        "quantity": 1,
		        "product": {
		          "title": "Relaxing Book",
		          "price": 25,
		          "category": {
		            "categoryname": "Book"
		          }
		        }
		      }
		    ]
		  }
		]
	  }
	}
	
### Nested Query without Param

	query{
	  orders{
	    id
	    orderdate
	    orderlines{
	      quantity
	      product{
	        title
	        price
	        category{
	          categoryname
	        }
	      }
	    }
	  }
	}
	
### Response

	{
	  "data": {
		"orders": [
		  {
		    "id": "cjtfykx1500400735vpvbl32f",
		    "orderdate": "19/03/19",
		    "orderlines": [
		      {
		        "quantity": 1,
		        "product": {
		          "title": "Programming Music",
		          "price": 20,
		          "category": {
		            "categoryname": "CD"
		          }
		        }
		      },
		      {
		        "quantity": 3,
		        "product": {
		          "title": "Programming Book",
		          "price": 25,
		          "category": {
		            "categoryname": "Book"
		          }
		        }
		      },
		      {
		        "quantity": 1,
		        "product": {
		          "title": "Relaxing Book",
		          "price": 25,
		          "category": {
		            "categoryname": "Book"
		          }
		        }
		      }
		    ]
		  },
		  {
		    "id": "cjtfyv204004q07353h5ky3u2",
		    "orderdate": "19/03/19",
		    "orderlines": [
		      {
		        "quantity": 5,
		        "product": {
		          "title": "Programming Music",
		          "price": 20,
		          "category": {
		            "categoryname": "CD"
		          }
		        }
		      }
		    ]
		  }
		]
	  }
	}

