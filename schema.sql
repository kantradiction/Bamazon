drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products(
item_id int not null auto_increment primary key,
product_name varchar(50) null,
department_name varchar(50) null,
price decimal (10, 2) null,
stock_quantity int null
);

insert into products (product_name, department_name, price, stock_quantity)
values 
	("Jiffy Pop", "Snacks", "3.99", 20), 
	("Doritos Cooler Ranch", "Snacks", "4.99", 15), 
	("Snyders of Hanover Pretzels", "Snacks", "2.99", 5), 
	("Lays Potato Chips", "Snacks", "4.99", 20), 
	("Poore Brothers Salt and Vinegar Chips", "Snacks", "1.99", 10), 
	("Shamrock 2% Milk", "Dairy", "1.49", 50), 
	("Eggmans Eggs - 12 Ct", "Dairy", "2.99", 30), 
	("Sargento Low Moisture String Cheese", "Dairy", "5.99", 18), 
	("Kraft American Cheese Slices", "Dairy", "4.99", 16), 
	("Yoplait Yogurt - Strawberry", "Dairy", "5.99", 10)
;

select * from bamazon.products;