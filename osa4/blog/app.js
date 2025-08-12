const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs.js')
const config = require('./utils/config.js')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app