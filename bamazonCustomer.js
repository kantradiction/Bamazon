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

// Functions
// =============================================================

function afterConnection() {
	//Show items available for sale
	/*read(buyItems);*/
	//Prompt two questions: 
	//1: Which id of the product would they like to buy
	//2: How many units of the product would they like to buy
	whichView();
}

function whichView() {
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			message: "Which view?",
			choices: ["Customer", "Manager", "Admin"]
		}
	]).then(function(response) {
		if (response.choice === "Customer") {
			startCustomer();
		} else if (response.choice === "Manager") {
			startManager();
		} else {
			startAdmin();
		}
	});
}

function startCustomer() {
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			message: "What would you like to do?",
			choices: ["Purchase"]
		}
	]).then(function(response) {
		if (response.choice === "Purchase") {
			read(buyItems);
		}
	});
}

function startManager() {
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			message: "What would you like to do?",
			choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
		}
	]).then(function(response) {
		if (response.choice === "View Products for Sale") {
			viewProductsForSale();
		} else if (response.choice === "View Low Inventory") {
			viewLowInventory();
		} else if (response.choice === "Add to Inventory") {
			addToInventory();
		} else {
			addNewProduct();
		}
	});
}

function startAdmin() {

}

// CRUD Functions - ReST - End
// =============================================================

function create() {
	console.log("CREATE FUNCTION THROWN");
}

//Display all of the items available for sale, including ids, names, and prices of the products for sale
function read(arg) {
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

function update(id, quant) {
	/*console.log("UPDATE FUNCTION THROWN");
	console.log("update products set stock_quantity = " + quant + " where item_id = " + id);*/
	connection.query("update products set stock_quantity = " + quant + " where item_id = " + id);
	/*read(buyItems);*/
}

function deleted() {
	console.log("DELETED FUNCTION THROWN");

}

function end() {
	console.log("ENDING CONNECTION");
	connection.end();
}

function buyItems() {
	console.log("\n");
	inquirer.prompt([
		{
			type: "input",
			name: "id",
			message: "ID: "
		},
		{
			type: "input",
			name: "quantity",
			message: "Quantity: "
		}
	]).then(function(response) {

		//Complete the order
		//Check if the store has enough of the product to meet the customer's request
		//Do a sql search of the id and get the quantity of the product.
		//If false, the app should phrase "insufficient quantity!" and then prevent the order from going through
		//If true, the app should fulfill the order and update the sequel database, then show the customer
		// the total cost of their purchase
		connection.query("SELECT * from products where item_id = " + response.id, function(err, res) {
			//check if any errors
			if (err) throw err;

			//get item and quantity from sql
			var item = res[0];
			var dbQuantity = item.stock_quantity;
			var rQuantity = response.quantity;

			//compare if user input is less than sql item quantity
			if (dbQuantity < rQuantity) {
				console.log("Requested quantity is greater than available quantity.")
				buyItems();
			} else {
				var nQuantity = dbQuantity - rQuantity;
				update(response.id, nQuantity);
				calculateTotal(response.id, rQuantity);
			}
				/*console.log(item.stock_quantity);*/
			
		});
	})
}

function calculateTotal(id, quant) {
	connection.query("SELECT price from products where item_id = " + id, function(err, res) {
		if (err) throw err; 

		var item = res[0];
		var price = res[0].price;
		var total = price * quant;

		console.log("\nTotal price for this purchase: " + total);

		return new Promise(function(resolve, reject) {
			console.log("Purchase completed.\n");
			startCustomer();
		})
	});
}

// What do we do once connected
// =============================================================
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);

	//Immediately display items available for sale via afterConnection function
	afterConnection();
});

