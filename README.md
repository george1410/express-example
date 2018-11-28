

# Express.js Example

A really simple example of a REST API using Express.js

  
## How to use
1. First clone this repository onto your computer:
````bash
git clone https://github.com/george1410/express-example.git
````

2. Then open up that directory in a terminal window, and install the required dependencies (defined in package.json) by running:
````bash
npm install
````

3. Now you are ready to start the server:
````bash
npm start
````

4. The server is now running locally on port 3000. 

## Testing it works
### GET
Testing the ````GET```` route is easy - just fire up a browser and go to http://localhost:3000/api/user/userID where userID is the ID of the user that you want to get data about.

By default, the app has users with IDs 1, 2, and 3. Try accessing userID 4 - you should recieve a 404 not found.

### POST
To test the ````POST```` route is a little more difficult, since a browser just makes ````GET```` requests. If you are happy in the command line, I suggest [httpie](https://github.com/jakubroztocil/httpie), however if you'd prefer a GUI, then [Postman](https://www.getpostman.com) is probably the way to go. 

Whichever one you use, set the HTTP method to ````POST````.
Then set the API Endpoint (URL) to http://localhost:3000/api/user 
Finally add some JSON as the body, e.g. 
````json
{
	"name": "Fred",
	"age": 27
}
````
Now you should be able to send the request, recieve the data you just added returned to you, but now with an automatically generated ID.

You **should** now be able to use the GET endpoint, along with that new ID, to get the data for your new user, in addition to the existing ones. :+1: