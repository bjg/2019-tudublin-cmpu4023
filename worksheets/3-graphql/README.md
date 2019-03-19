# Lab 3 - GraphQL

### Part 1
![Alt text](images/1 Tables implemented.png)

![Alt text](images/1tablesImplemented.png)

![Alt text](3.jpg)

![Alt text](images/5 5.jpg)

![Alt text](images/8.jpg)

# Lab 3 - GraphQL

### Part 1
The implemented relations

![Alt text](images/1 Tables implemented.png)

The data model code

![Alt text](images/1 Data model.png?raw=true "Title")

The qraphql code

![Alt text](images/1 Graphql schema.png?raw=true "Title")


### Part 2
Resolver for basic query 

![Alt text](images/2 Resolver.png?raw=true "Title")

Query returns a number of attributes

![Alt text](images/2 Output.png)


### Part 3
What it does: Displays a detailed breakdown of a product in the system, including it's name, price, category, amount currently in stock and amount sold.
Resolver for query that deals with two relations

![Alt text](images/3 Resolver.png?raw=true "Title")

Resolver for building connections

![Alt text](images/3 Nesting relationships.png?raw=true "Title")

Query output showing two connected realtions

![Alt text](images/3 Output.png?raw=true "Title")


### Part 4
What it does: Makes it possible to generate a reorder in the system when quantities become too low and associate it with a product.
Order table was not selected so this mutator deals with creating a reorder instead, the reorder details are updated with dates, quantities and the connection to the products table.

![Alt text](images/4 Resolver.png?raw=true "Title")

The output of the modified relations

![Alt text](images/4 Output.png?raw=true "Title")
