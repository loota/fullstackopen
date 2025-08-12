const blogsRouter = require('express').Router()
const Blog = require('../models/blogs.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!request.body.likes) {
    blog.likes = 0
  }

  if (!request.body.title || !request.body.url) {
    response.status(400).end()
  }

  const saved = await blog.save()
  response.status(201).json(saved)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

  if (!request.body || !request.body.likes) {
    return response.status(400).end()
  }
  if (!request.params.id) {
    return response.status(400).end()
  }

  const id = request.params.id
  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).end()
    }
    const { likes } = request.body
    blog.likes = likes
    await blog.save()
    response.json(blog)
  } catch (error) {
    return response.status(404).end()
  }
})

module.exports = blogsRouter