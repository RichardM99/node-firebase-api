# Node Firebase API

## Overview
A lightweight node API which demonstrates how you can integrate firebase
authentication with a database.

### Motivation

When developing small prototypes or learning a new front end framework it's 
nice to have a small back end set up that can accept basic requests 
from a client. For instance - most applications require a sign up page for
which this API would be a nice starting point.

### What does it do?

- Creates users in your firebase application and in a local database
- Uses firebase to authenticate requests from the client to 
perform read/write operations on the local database
- Can be easily extended
- Can be easily modified to connect to a real databse

### Is this suitable for production?

Data is stored in a simple JSON file under 

```/db/db.json``` 

using 
[low db](https://github.com/typicode/lowdb).
As such I would not recommend using it for a real world application.

However - you can simply swap the logic inside  of the 

```
/models/base-model.js
```

class to connect to whatever database you like.

As it currently is - it is more suited for small proof of concept projects.

## How to Use

### Requirements

- Node Package Manager (NPM)
- Node version 7.6 or higher

### Setup

This assumes you have already created a firebase application and 
you have both your service account key and web api key.

If you have not yet created a firebase app,
you can do so [here](https://firebase.google.com/)


1. Clone this repo

2. In ```/config/serviceAccountKey.json``` paste in your service account key.

3. In ```/config/config.js``` paste in your web api key.

4. Install dependencies with ```npm install```

5. Start the server with ```npm start```

6. Visit ```localhost:2000/api/home``` in your browser to see if the server is up and running.
You should get a simple JSON response of 

```javascript
{ message: "Home" }
```

### Users

**Create**

Create a user with a POST request to ```localhost:2000/api/users```

Request body - 

```javascript
{
	"email": "email@email.com",
	"password": "password" 
}
```

This will create a user in the local database and in your
firebase database. It uses the id from the local database record
 to associate the two. 

The response will include an ```AUTH_TOKEN``` which the client 
can then use to log in to your firebase application. From the firebase docs -

> You generate these tokens on your server, pass them back to a client device, and then use them to authenticate 
> via the signInWithCustomToken() method.

After signing in with the ```AUTH_TOKEN``` the client will have access to 
an id token which it can then use to make authenticated requests to the database.
Check the [firebase documentation](https://firebase.google.com/docs/reference/js/firebase.User#getIdToken) if
you are unsure of how to get the id token.

You add the id token to the request headers as ```Authorization``` (see the tests
for examples)

**Note** 

The ```UPDATE``` and ```DELETE``` requests require authentication.

**Update**

Update a user with a PUT request to to ```localhost:2000/api/users/{userId}```

Request body - 

```javascript
{
	"id": "1",
	"email": "newemail@email.com",
	"password": "newpassword" 
}
```

**Delete**

Delete a user with a DELETE request to to ```localhost:2000/api/users/{userId}```

No request body needed.

### Tests

To run the tests use ```npm test```

**Note** 

In the ```test/users.js``` test file you will see this function

```javascript
_exchangeCustomTokenForIdToken
```

This is used to mock a user signing in to your firebase application
on the front end in order to test requests that require authentication.

### Database

The local database is a simple JSON 
file managed using [low db](https://github.com/typicode/lowdb)
which is a cool little library.

When you spin up the server for the first time it should look like
this

```javascript
{
  "users": []
}
```

This is set up by the following line in ```models/base-model.js```

```javascript
db.defaults({users: []}).write();
```

You can easily extend this by adding whatever defaults you like
and creating a new model to manage them. For example -

```javascript
// base-model.js
//
db.defaults({users: []}, {posts: []}).write();

// post.js (or whatever name you like)
//
class Post extends BaseModel {
    
    constructor() {
        super("posts");
    }

}
```

Then follow the create, update and delete functionality as laid out in the user model.

As mentioned you could swap out the logic in ```/models/base-model.js```
to connect to a different database.

### Final Note

I developed this little API to learn some firebase and node so it is by no means
intended to be perfect. With that in mind if you have any issues or suggestions please do let 
me know or feel free to open a pull request!


### TODOS

- [ ] Add another endpoint that reads/writes to the database.
- [ ] Better error handling for ```DELETE``` request (should make sure both the local database
and firebase database are in sync in case of error).
- [ ] Move checking for ```userId``` in ```PUT``` and ```DELETE``` requests into a middleware. 


