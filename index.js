/**
 * George McCarron - 2018
 * hello@georgemccarron.com
 * 
 * index.js
 * 
 * A really simple example of a REST API using Express.js
 */

var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Handles all HTTP GET requests to /api/user/<user_id>
// Should return the data object for the requested user ID
app.get('/api/user/:id', (req, res) => {

    // Read the JSON file where we store our user data into memory
    fs.readFile('users.json', (err, data) => {
        if (err) {
            // If an error occured while reading the file, return HTTP Status Code 500 (Internal Error) to client
            console.log("Error reading JSON.");
            res.sendStatus(500);
            return;
        }

        // Parse the contents of the file as JSON
        // i.e. convert it to a 'real' javascript array of objects
        var userArr = JSON.parse(data);

        // Get the user object from the array that has the ID we provided as a URL parameter
        var theUser = userArr.find(user => user.id == req.params.id);
        if (theUser == null) {
            // If theUser is null (i.e. there is no user with the provided ID)
            // Return 404 (Not Found) to the client
            res.sendStatus(404);
            return;
        }

        // Return the requested user object back to the client (in JSON form)
        res.send(theUser);
    });
});

// Handles all HTTP POST requests to /api/user
// Should return the data object for the newly created user
app.post('/api/user', (req, res) => {

    // Store the data from the request into a nice neat variable
    // Note that it has already been converted into a JavaScript object
    // This is because we require and use 'body-parser' at the top of this file
    var newData = req.body;
    
    // read the JSON file where we store our user data into memory
    fs.readFile('users.json', (err, data) => {
        if (err) {
            // If an error occured while reading the file, return HTTP Status Code 500 (Internal Error) to client
            console.log("Error reading JSON.");
            res.sendStatus(500);
            return;
        }
        // Parse the contents of the file as JSON
        // i.e. convert it to a 'real' javascript array of objects
        var userArr = JSON.parse(data);

        // Set the id property of the new object
        // Note that this is a really bad way of generating unique IDs, but it will do for this
        newData.id = userArr.length + 1;

        // Add the new object to our array that we read from the JSON file
        userArr.push(newData);

        // Now we can write the array to the users.json file
        // We want to write the contents of the array in JSON format, hence JSON.stringify()
        fs.writeFile('users.json', JSON.stringify(userArr), (err) => {
            if(err) {
                // If an error occured while writing the file, return HTTP Status Code 500 (Internal Error) to client
                console.log("Error writing to file.");
                res.sendStatus(500);
                return;
            }
        });

        // Return the newly created user object back to the client (in JSON form)
        res.send(newData);
    });
});

// Handles all HTTP POST requests to /api/user/<user_id>
// Should return the data object for the updated user
app.post('/api/user/:id', (req, res) => {

    // Store the data from the request into a nice neat variable
    // Note that it has already been converted into a JavaScript object
    // This is because we require and use 'body-parser' at the top of this file
    var newData = req.body;

    // Read the JSON file where we store our user data into memory
    fs.readFile('users.json', (err, data) => {
        if (err) {
            // If an error occured while reading the file, return HTTP Status Code 500 (Internal Error) to client
            console.log("Error reading JSON.");
            res.sendStatus(500);
            return;
        }

        // Parse the contents of the file as JSON
        // i.e. convert it to a 'real' javascript array of objects
        var userArr = JSON.parse(data);

        // Get the user object from the array that has the ID we provided as a URL parameter
        var theUser = userArr.find(user => user.id === parseInt(req.params.id));
        if (theUser == undefined) {
            // If theUser is undefined (i.e. there is no user with the provided ID)
            // Return 404 (Not Found) to the client
            res.sendStatus(404);
            return;
        }

        // Loop through each of the properties provided in the request body
        for (const prop in req.body) {
            if (req.body.hasOwnProperty(prop)) {
                // Update the user object property with the value supplied in the request body
                theUser[prop] = req.body[prop];
            }
        }

        fs.writeFile('users.json', JSON.stringify(userArr), (err) => {
            if(err) {
                // If an error occured while writing the file, return HTTP Status Code 500 (Internal Error) to client
                console.log("Error writing to file.");
                res.sendStatus(500);
                return;
            }
        });

        // Return the requested user object back to the client (in JSON form)
        res.send(theUser);
    });

});

app.listen(3000);