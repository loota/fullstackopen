const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const middleware = require('../utils/middleware.js')
const userExtractor = middleware.userExtractor
const ObjectId = require('mongodb').ObjectId

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1, id: 1 })
  if (blog === null) {
    response.status(404).end()
  }
  response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  if (!request.body.likes) {
    blog.likes = 0
  }

  if (!request.body.title || !request.body.url) {
    response.status(400).json( { 'error': 'No title or url in request' }).end()
  }

  const user = request.user
  if (!user) {
    response.status(401).json({ 'error': 'Not logged in. Blogs can be added only when a user is logged in.' }).end()
  }

  blog.user = user.id
  const saved = await blog.save()
  user.blogs = user.blogs.concat(saved._id)
  await user.save()
  const populatedBlog = await Blog.findById(blog.id).populate('user', { username: 1, name: 1, id: 1 })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).end()
  }

  if (!request.decodedToken) {
    response.status(401).end()
  }

  const user = request.user

  if (blog.user && blog.user.toString() === user.id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).end()
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {

  if (!request.body || !request.body.likes) {
    return response.status(400).json( { error: 'likes is required' } ).end()
  }
  if (!request.params.id) {
    return response.status(400).json( { error: 'id is required' } ).end()
  }
  if (!request.decodedToken) {
    response.status(401).json( { error: 'login token is required' } ).end()
  }

  const id = request.params.id
  try {
    if (ObjectId.isValid(id) === false) {
      return response.status(404).end()
    }
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).end()
    }
    //if (blog.user.toString() !== request.user.id.toString()) {
    // response.status(401).json( { error: 'only the same user may modify a blog who has created it' } ).end()
    //}
    const { title, author, url, likes, user } = request.body
    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes
    if (user) {
      blog.user = user
    } else {
      console.log(request.user.id)
      blog.user = request.user.id
    }
    await blog.save()
    const populatedBlog = await Blog.findById(blog.id).populate('user', { username: 1, name: 1, id: 1 })
    response.json(populatedBlog)
  } catch (error) {
    console.log(error)
    return response.status(404).end()
  }
})

module.exports = blogsRouter