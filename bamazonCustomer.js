// Dependencies
// =============================================================
var inquirer = require("inquirer");
var command = process.argv[2];
var mysql = require("mysql");

// Initialize mysql
// =============================================================
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	//my username
	user: "root",

	password: "red123",

	database: "bamazon"
});

// What do we do once connected
// =============================================================

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	afterConnection();
	connection.end();	
});

function afterConnection() {
	console.log("WE ARE NOW CONNECTED, SCOTTY");
	read();
};

// CRUD Functions - ReST
// =============================================================

function create() {

}

//Display all of the items available for sale, including ids, names, and prices of the products for sale
function read() {
	console.log("READ FUNCTION THROWN");
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		// Log all results from the SELECT statement
		for (var i = 0; i < res.length; i++) {

			console.log("\nID: " + res[i].item_id);
			console.log("Name: " + res[i].product_name);
			console.log("Department: " + res[i].department_name);
			console.log("Price: " + res[i].price);
			console.log("Quantity: " + res[i].stock_quantity);
		};

		//to see what fields are in the response, uncomment out the next line
		/*console.log(res);*/
		connection.end();
	})
}

function update() {

}

function deleted() {

}