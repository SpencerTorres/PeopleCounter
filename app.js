// Before anything else, load the env file.
require('dotenv').config()

// Import Express module
const app = require('express')()
// Import a generic Node HTTP server, and pair it with Express.
const server = require('http').Server(app)
// Start the websocket server, and pair it with the HTTP one.
const io = require('socket.io').listen(server)

// Import Redis driver
const ioRedis = require('ioredis')
// Create connection to Redis server using parameters from the env file.
const redis = new ioRedis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASS,
  db: process.env.REDIS_DB
})

// Upon socket connection, send people count from redis.
io.on('connection', (client) => {
  redis.get('people_count', (err, peopleCount) => {
    client.emit('UPDATE_COUNT', peopleCount)
  })
})

/**
 * Increase the people count via POST request.
 */
app.post('/increase', (req, res) => {
  // Confirm request has correct key before allowing change.
  if(!req.query.key || req.query.key !== process.env.KEY)
    return res.sendStatus(401)

  // Increase people count in redis by 1
  redis.incr('people_count', (err, newPeopleCount) => {
    if(err)
      return res.sendStatus(500)

    // Send new people count to listening sockets
    io.emit('UPDATE_COUNT', newPeopleCount)
    // Respond to POST request with new people count.
    res.json({ count: newPeopleCount })
  })
})
/**
 * Decrease the people count via POST request.
 */
app.post('/decrease', (req, res) => {
  // Confirm request has correct key before allowing change.
  if(!req.query.key || req.query.key !== process.env.KEY)
    return res.sendStatus(401)

  // Decrease people count in redis by 1
  redis.decr('people_count', (err, newPeopleCount) => {
    if(err)
      return res.sendStatus(500)

    // Send new people count to listening sockets
    io.emit('UPDATE_COUNT', newPeopleCount)
    // Respond to POST request with new people count.
    res.json({ count: newPeopleCount })
  })
})

// This is an API route that returns the current people count.
// It can be accessed by a GET request to /count
app.get('/count', (req, res) => {
  // Get the people count from redis, and send the response to the client.
  redis.get('people_count', (err, peopleCount) => {
    if(err)
      return res.sendStatus(500)

    res.json({ count: peopleCount })
  })
})

// Respond to ANY other request with our HTML.
app.use((req, res) => {
  // Send HTML file
  res.sendFile(__dirname + '/index.html')
})

// Set the port of the app.
app.set('port', process.env.PORT || 3000)

// Start the HTTP server
server.listen(app.get('port'), () => {
  console.log('People Counter running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  ) 
})
