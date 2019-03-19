# Lab 3 - GraphQL

### Part 1
The implemented relations
![Alt text](resultImages/1 Tables implemented.PNG?raw=true "Title")

The data model code
![Alt text](resultImages/1 Data model.PNG?raw=true "Title")

The qraphql code
![Alt text](resultImages/1 Graphql schema.PNG?raw=true "Title")


### Part 2
Resolver for basic query 
![Alt text](resultImages/2 Resolver.PNG?raw=true "Title")

Query returns a number of attributes
![Alt text](resultImages/2 Output.PNG?raw=true "Title")


### Part 3
What it does: Displays a detailed breakdown of a product in the system, including it's name, price, category, amount currently in stock and amount sold.
Resolver for query that deals with two relations
![Alt text](resultImages/3 Resolver.PNG?raw=true "Title")

Resolver for building connections
![Alt text](resultImages/3 Nesting relationships.PNG?raw=true "Title")

Query output showing two connected realtions
![Alt text](resultImages/3 Output.PNG?raw=true "Title")


### Part 4
What it does: Makes it possible to generate a reorder in the system when quantities become too low and associate it with a product.
Order table was not selected so this mutator deals with creating a reorder instead, the reorder details are updated with dates, quantities and the connection to the products table.
![Alt text](resultImages/4 Resolver.PNG?raw=true "Title")

The output of the modified relations
![Alt text](resultImages/4 Output.PNG?raw=true "Title")
