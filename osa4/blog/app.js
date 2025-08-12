const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const config = require('./utils/config.js')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app