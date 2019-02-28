DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price DECIMAL (10,2) default 0,
  stock INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Quad-Core Processor", "Computers", 319.99, 10);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("500GB SSD", "Computers", 119.50, 5);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Computer Case", "Computers", 85.00, 11);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Keyboard", "Computers", 19.99, 8);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Baseball Hat", "Clothing", 9.99, 4);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Blue Jeans", "Clothing", 45.00, 15);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Parka", "Clothing", 164.99, 7);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Frozen Pizza", "Groceries", 5.29, 100);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Milk", "Groceries", 2.69, 25);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Steak", "Groceries", 14.87, 2);