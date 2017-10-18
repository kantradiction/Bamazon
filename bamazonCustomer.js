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

	//Immediately display items available for sale via afterConnection function
	afterConnection();
});

// Prompts
// =============================================================

function afterConnection() {
	console.log("WE ARE NOW CONNECTED, SCOTTY");

	//Show items available for sale
	read(buyItems);
	//Prompt two questions: 
	//1: Which id of the product would they like to buy
	//2: How many units of the product would they like to buy
};

// CRUD Functions - ReST - End
// =============================================================

function create() {
	console.log("CREATE FUNCTION THROWN");
}

//Display all of the items available for sale, including ids, names, and prices of the products for sale
function read(arg) {
	console.log("READ FUNCTION THROWN");
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		// Log all results from the SELECT statement
		for (var i = 0; i < res.length; i++) {

			console.log("\nID: " + res[i].item_id);
			console.log("Name: " + res[i].product_name);
			console.log("Department: " + res[i].department_name);
			console.log("Price: $" + res[i].price);
			console.log("Quantity: " + res[i].stock_quantity);
		};

		if (res) {
			arg();
		}

		//to see what fields are in the response, uncomment out the next line
		/*console.log(res);*/
		/*connection.end();*/
	})
}

function update() {
	console.log("UPDATE FUNCTION THROWN");

}

function deleted() {
	console.log("DELETED FUNCTION THROWN");

}

function end() {
	console.log("ENDING CONNECTION");
	connection.end();
}

function buyItems() {
	inquirer.prompt([
		{
			type: "input",
			name: "id",
			message: "What is the ID of the product you would like to buy?"
		},
		{
			type: "input",
			name: "quantity",
			message: "How many units of this product would you like to buy?"
		}
	]).then(function(response) {

		//Complete the order
		//Check if the store has enough of the product to meet the customer's request
		//If false, the app should phrase "insufficient quantity!" and then prevent the order from going through
		//If true, the app should fulfill the order and update the sequel database, then show the customer
		// the total cost of their purchase
		console.log(response);

	})
}