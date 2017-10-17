var inquirer = require("inquirer");
var command = process.argv[2];

var express = require("express");
var app = express();
var port = 3000;

var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	//my username
	user: "root",

	password: "red123",

	database: "bamazon"
})

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	afterConnection();
	connection.end();	
})