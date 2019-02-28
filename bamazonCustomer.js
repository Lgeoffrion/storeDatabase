var mysql = require("mysql");
var inquirer = require('inquirer');
var isNumber = require('is-number');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});


//display items for sale by query from mySQL server
function start() {  
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        console.log("            -----=====Welcome to Bamazon!=====-----\n");
        console.log("     -----=====Please See Our Current Offerings=====-----\n");
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + "    |   Item: " + res[i].product_name + "  |   Price: $"
                + res[i].price + "  |   Quantity Left: " + res[i].stock + "\n");
        }

        inquirer //prompt questions for purchase
            .prompt([{
                name: "id",
                type: "input",
                message: "Enter the ID number of what you would to buy.\nID Number: ",
                validate: function (value) {
                    if (isNumber(value)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function (value) {
                    if (isNumber(value)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }])
            .then(function (answer) {
                //setting variables for following functions
                var itemToPuchase = (answer.id) - 1;
                var howMany = parseInt(answer.quantity);
                var totalCost = parseFloat((res[itemToPuchase].price) * howMany);
                inquirer
                .prompt({
                    name: "confirmPurchase",
                    type: "confirm",
                    message: "Your Total is $" + totalCost + ". Confirm your purchase?",
                })
                .then(function (answer2) {
                    //function to change database numbers if purchase is confirmed and enough stock      
                    if (answer2.confirmPurchase === true && res[itemToPuchase].stock >= howMany) {
                        //after purchase, updates quantity in Products
                        connection.query("UPDATE products SET ? WHERE ?", [
                            { stock: (res[itemToPuchase].stock - howMany) },
                            { item_id: answer.id }
                        ], function (err, result) {
                            if (err) throw err;
                            console.log("Purchase Complete! Your total is $" + totalCost + ".\n");
                            reprompt();
                        })
                    }
                    //if they dont confirm purchase
                    else if(answer2.confirmPurchase === false){
                        console.log ("Your order has been canceled.\n")
                        reprompt();
                    }
                    //error if not enough stock for purchase
                    else {
                        console.log("Sorry, there's not enough in stock! Please try again.\n");
                        reprompt();
                    }
                });
              
            });
    });
}

//function to send user to beginning again or end program
function reprompt() {
    inquirer.prompt([{
        type: "confirm",
        name: "reply",
        message: "Would you like to purchase another item?"
    }]).then(function (answer) {
        if (answer.reply) {
            start();
        } else {
            console.log("Thank You for Shopping with Bamazon!");
            connection.end();
        }
    });
}

start();
