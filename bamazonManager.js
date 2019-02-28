var mysql = require("mysql");
var inquirer = require('inquirer');
var isNumber = require('is-number');
var Table = require('easy-table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});


function start() {
  inquirer.prompt([{
    type: "list",
    name: "options",
    message: "What would you like to do?",
    choices: ["View Current Inventory", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"]
  }]).then(function (ans) {
    switch (ans.options) {
      case "View Current Inventory": viewProducts();
        break;
      case "View Low Inventory": viewLowInventory();
        break;
      case "Add to Inventory": addToInventory();
        break;
      case "Add New Product": addNewProduct();
        break;
      case "End Session": console.log('Goodbye'); connection.end();
    }
  });
}

//views all inventory
function viewProducts() {
  console.log('\n                         -----======Viewing Products=====-----');

  connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    console.log('----------------------------------------------------------------------------------------------------\n')
        //easy table npm to generate table in easy read format
        var t = new Table
        res.forEach(function(res) {
          t.cell('ID', res.item_id)
          t.cell('Product', res.product_name)
          t.cell('Department', res.department_name)
          t.cell('Price', res.price, Table.number(2))
          t.cell('Quantity Left', res.stock)
          t.newRow()
        })
        console.log(t.toString())
    console.log('----------------------------------------------------------------------------------------------------')
    start();
  });
}

//views inventory lower than 5
function viewLowInventory() {
  console.log('-----======Viewing Low Inventory=====-----');

  connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    var lowqty = [];
    var l = new Table
    for (var i = 0; i < res.length; i++) {
        if (res[i].stock <= 5) {
  lowqty.push(res[i]);
        }
      }
    console.log('----------------------------------------------------------------------------------------------------\n');
    //easy table npm to generate table in easy read format
    lowqty.forEach(function(lowqty) {
      l.cell('ID', lowqty.item_id)
      l.cell('Product', lowqty.product_name)
      l.cell('Department', lowqty.department_name)
      l.cell('Price', lowqty.price, Table.number(2))
      l.cell('Quantity Left', lowqty.stock)
      l.newRow()
    })
    console.log(l.toString())
    console.log('----------------------------------------------------------------------------------------------------');

    start();
  });
}

//displays prompt to add more of an item to the store and asks how much
function addToInventory() {
  console.log('-----======Adding to Inventory=====-----');

  connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    var itemArray = [];
    //pushes each item into an itemArray
    for (var i = 0; i < res.length; i++) {
      itemArray.push(res[i].product_name);
    }

    inquirer.prompt([{
      type: "list",
      name: "product",
      choices: itemArray,
      message: "Which item would you like to add inventory?"
    }, {
      type: "input",
      name: "qty",
      message: "How many would you like to add?",
      validate: function (value) {
        if (isNumber(value)) {
          return true;
        } else {
          return false;
        }
      }
    }]).then(function (ans) {
      var currentQty;
      for (var i = 0; i < res.length; i++) {
        if (res[i].product_name === ans.product) {
          currentQty = res[i].stock;
        }
      }
      connection.query('UPDATE products SET ? WHERE ?', [
        { stock: currentQty + parseInt(ans.qty) },
        { product_name: ans.product }
      ], function (err, res) {
        if (err) throw err;
        console.log('The quantity was updated to ' + (currentQty + parseInt(ans.qty)));
        start();
      });
    })
  });
}

//allows manager to add a completely new product to store
function addNewProduct() {
  console.log('\n                           -----======Adding New Product=====-----');
  console.log('----------------------------------------------------------------------------------------------------');
  var deptNames = [];

  //grab name of departments
  connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (deptNames.indexOf(res[i].department_name) < 0) //makes only 1 instance of each catagory show up
      deptNames.push(res[i].department_name);
    }
  })

  inquirer.prompt([{
    type: "input",
    name: "product",
    message: "Product: ",
  }, {
    type: "list",
    name: "department",
    message: "Department: ",
    choices: deptNames
  }, {
    type: "input",
    name: "price",
    message: "Price: ",
    validate: function (value) {
      if (isNumber(value)) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    type: "input",
    name: "quantity",
    message: "Quantity: ",
    validate: function (value) {
      if (isNumber(value)) {
        return true;
      } else {
        return false;
      }
    }
  }]).then(function (ans) {
    connection.query('INSERT INTO products SET ?', {
      product_name: ans.product,
      department_name: ans.department,
      price: ans.price,
      stock: ans.quantity
      
    }, function (err, res) {
      if (err) throw err;
    })
    console.log(ans.product + ' was added to the store.');
    console.log('----------------------------------------------------------------------------------------------------\n');
    start();
  });
}

//Start the program
start();
