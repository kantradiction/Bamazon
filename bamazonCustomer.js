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
	console.log("\n");
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			message: "Which view?",
			choices: ["Customer", "Manager", "End"/*, "Admin"*/]
		}
	]).then(function(response) {
		if (response.choice === "Customer") {
			startCustomer();
		} else if (response.choice === "Manager") {
			startManager();
		} else if (response.choice === "End") {
			connection.end();
		} /*else {
			startAdmin();
		}*/
	});
}

function startCustomer() {
	console.log("\n");
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			message: "What would you like to do?",
			choices: ["Purchase", "Home"]
		}
	]).then(function(response) {
		if (response.choice === "Purchase") {
			read(buyItems);
		} else {
			whichView();
		}
	});
}

function startManager() {
	console.log("\n");
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			message: "What would you like to do?",
			choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product", "Home"]
		}
	]).then(function(response) {
		if (response.choice === "View Products for Sale") {
			read(startManager);
		} else if (response.choice === "View Low Inventory") {
			viewLowInventory(startManager);
		} else if (response.choice === "Add to Inventory") {
			addToInventory(startManager);
		} else if (response.choice === "Add New Product") {
			create(startManager);
		} else {
			whichView();
		}
	});
}

/*function startAdmin() {

}*/

// CRUD Functions - ReST - End
// =============================================================

function create(callback) {
	console.log("\n");
	inquirer.prompt([
		{
			type: "input",
			name: "product_name",
			message: "What is the name of the product you would like to add?",
		},
		{
			type: "input",
			name: "department_name",
			message: "What department does this product belong in?",
		},
		{
			type: "input",
			name: "price",
			message: "What is the sale price of this product?",
		},
		{
			type: "input",
			name: "stock_quantity",
			message: "How much of this product do you currently have on hand?",
		}
	]).then(function(results) {
		connection.query("insert into products set ?",
			{
				product_name: results.product_name,
				department_name: results.department_name,
				price: results.price,
				stock_quantity: results.stock_quantity
			}, function(err, res) {
				console.log(res.affectedRows + "product added.\n");
			}
		);

		return new Promise(function(resolve, reject) {
			callback();
		});
	});
}

//Display all of the items available for sale, including ids, names, and prices of the products for sale
function read(callback) {
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

		return new Promise(function(resolve, reject) {
			callback();
		})

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

// Manager Functions
// =============================================================

function viewLowInventory(callback) {
	connection.query("SELECT * FROM products where stock_quantity < 5", function(err, res) {
		if (err) throw err;
		// Log all results from the SELECT statement
		if (res.length < 1) {
			console.log("\nNo Low Inventory");
		} else {
			for (var i = 0; i < res.length; i++) {
				console.log("\nID: " + res[i].item_id);
				console.log("Name: " + res[i].product_name);
				console.log("Department: " + res[i].department_name);
				console.log("Price: $" + res[i].price);
				console.log("Quantity: " + res[i].stock_quantity);
			};
		}
		return new Promise(function(resolve, reject) {
			callback();
		})
	})
}

function addToInventory(callback) {
	console.log("\n");
	//FIGURE OUT HOW TO CALL READ BEFORE INQUIRER RUNS
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
		connection.query("SELECT * from products where item_id = " + response.id, function(err, res) {
			//check if any errors
			if (err) throw err;

			//get item and quantity from sql
			var item = res[0];
			var dbQuantity = parseInt(item.stock_quantity);
			var rQuantity = parseInt(response.quantity);

			var nQuantity = (dbQuantity + rQuantity);
			update(response.id, nQuantity);

			return new Promise(function(resolve, reject) {
				read(callback);
			})
		});
	})
}

// What do we do once connected
// =============================================================
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);

	//Immediately display items available for sale via afterConnection function
	afterConnection();
});

