const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')
const config = require('./utils/config.js')
const middleware = require('./utils/middleware.js')

app.use(middleware.tokenExtractor)

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

module.exports = app