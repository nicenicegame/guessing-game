'use strict'
// Packages.
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const MongoClient = require('mongodb').MongoClient
const redis = require('redis')
const gameRouter = require('./gameRouter')

// Constants
const PORT = 80 // App's port
const HOST = '0.0.0.0' // App's host
const uri = 'mongodb://root:password@mongodb' // MongoDB's connection string.
const dbName = 'guessingGame' // MongoDB's Database Name

// App
const app = express()

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.urlencoded({ extended: false }))

app.use('/', gameRouter)

const main = async () => {
  const client = new MongoClient(uri, { useUnifiedTopology: true })
  try {
    // Connect to the MongoDB cluster
    await client.connect()
    console.log('Connected successfully to MongoDB server')

    // Get the guessingGame collection
    app.locals.db = client.db(dbName)
  } catch (e) {
    console.error(e)
    setTimeout(function () {
      main().catch(console.error)
    }, 5000)
  } finally {
    // await client.close();
  }
}

// connect to Redis
const redisClient = redis.createClient('redis://redis:6379')
redisClient.on('connect', function (error) {
  console.log('Connected successfully to Redis server')
})
redisClient.on('error', function (error) {
  console.error(error)
})

// connect to MongoDB
main().catch(console.error)

// App listen
app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
