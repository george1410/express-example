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
var path = require('path');
app.use(bodyParser.json());

// Format responses that are in json with 2 spaces
// You can just ignore this as it does not change functionality
app.set('json spaces', 2);

// Shows the whole array, when a request is made to /api/users
app.get('/api/users', (req, res) => {
    // Read the JSON file where we store our user data into memory
    fs.readFile('users.json', (err, data) => {
        if (err) {
            // If an error occured while reading the file, return HTTP Status Code 500 (Internal Error) to client
            console.log("Error reading JSON.");
            res.sendStatus(500);
            return;
        }
        // Send all of the data as json that was previously read
        res.json(JSON.parse(data));
    })
});

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
        //reg.params.id is actually a string and is thus parsed to an int for comparison
        var theUser = userArr.find(user => user.id === parseInt(req.params.id));
        if (theUser === undefined) {
            // If theUser is undefined (i.e. there is no user with the provided ID)
            // Return 404 (Not Found) to the client
            res.sendStatus(404);
            return;
        }

        // Return the requested user object back to the client (in JSON form)
        res.json(theUser);
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
        res.json(newData);
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
        if (theUser === undefined) {
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
        res.json(theUser);
    });

});

// Responds with an html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

// Redirects every route back to '/'
// This needs to be the last route as it acts as a catch-all
app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(3000);
