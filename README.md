# People Counter

This was created for the purpose of helping a user on Reddit. You can find the post [here.](https://redd.it/7psv27)

The goal is to make a simple application that can count people as they walk by. A sensor will make an HTTP request to this app, and the total people count would be updated live for any people watching the page.

Technology used:
- NodeJS
- Express
- Redis
- Socket.io

## Setup

The code is simple, compact, and well commented for the purpose of teaching. A more fractured file structure is recommended for any serious/scaleable project.

NodeJS should be installed, and you should have access to an instance of Redis.

How to setup and run:
1. Clone this repository
2. Locate the repository on your computer and open a terminal in that directory. Type `npm install` to install the dependencies.
3. Open .env-template, and follow the steps detailed inside. (Duplicate the file as `.env` and edit the variables to your liking)
4. Run the server with `node app.js`

## App Usage
The server is running, assuming you followed the setup steps. You'll now be able to access `localhost:3000` and see the basic HTML page.
  
#### Increasing/Decreasing the people count
To change the people count, send a `POST` request to either `/increase` or `/decrease`. To ensure security you will need to provide the key you defined in the `.env`.
Here's an example usage for increasing the people count:
`POST` `http://localhost:3000/increase?key=MyKey`

This would return the new total count in JSON format:
```javascript
{
  count: 1
}
```

#### Reading the people count
This was a route I tossed in the code just for fun. If you send a `GET` request to `/count`, you will get the current people count.

For example:
`GET` `http://localhost:3000/count`

would give the following JSON response:
```javascript
{
  count: 2
}
```
