const supertest = require('supertest')
const { test, after } = require('node:test')
const app = require('../app')
const Blog = require('../models/blogs.js')
const mongoose = require('mongoose')
const assert = require('node:assert')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have ids', async () => {
  const response = await api.get('/api/blogs')

  assert.ok(response.body[0].id)
})

test('a new blog can be added', async () => {
  const newBlog = {
    author: 'Steve Murgler',
    title: 'Fabulous article',
    url: 'www.example.com/',
    likes: 3
  }

  const blogsAtStart = await Blog.find({})

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await Blog.find({})
  assert.strictEqual(blogs.length, blogsAtStart.length + 1)
  const titles = blogs.map(n => n.title)
  assert(titles.includes('Fabulous article'))
})

test('a new blog with no likes will get 0 as likes', async () => {
  const newBlog = {
    author: 'Steve Murgler',
    title: 'Fabulous article',
    url: 'www.example.com/'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('a new blog with no title will not get saved', async () => {
  const newBlog = {
    author: 'Steve Murgler',
    url: 'www.example.com/',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

})

test('a new blog with no url will not get saved', async () => {
  const newBlogWithoutUrl = {
    author: 'Steve Murgler',
    title: 'Amazing article',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)
})

test('deleting a blog will delete', async () => {
  const newBlog = {
    author: 'Steve Murgler',
    title: 'only deletion test is allowed this title',
    url: 'www.example.com/amazing',
    likes: 1
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtStart = await Blog.find({})
  const titlesAtStart = blogsAtStart.map(n => n.title)
  assert(titlesAtStart.includes(newBlog.title))

  await api
    .delete('/api/blogs/' + response.body.id)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  const titles = blogsAtEnd.map(n => n.title)
  assert(!titles.includes(newBlog.title))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('modifying a blog will modify', async () => {
  const newBlog = {
    author: 'Steve Murgler',
    title: 'Amazing test article',
    url: 'www.example.com/amazing',
    likes: 1
  }

  const newBlogResponse = await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const id = newBlogResponse.body.id

  newBlog.likes = 22

  await api
    .put(`/api/blogs/${id}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const getResponse = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const changedBlog = getResponse.body.find((val) => val.id === id)
  newBlog.id = changedBlog.id
  assert.deepStrictEqual(changedBlog, newBlog)
})

test('modifying a nonexisting blog will not modify', async () => {
  const newBlog = {
    author: 'Steve Murgler',
    title: 'Amazing test article',
    url: 'www.example.com/amazing',
    likes: 1
  }

  const id = '105'

  await api
    .put(`/api/blogs/${id}`)
    .send(newBlog)
    .expect(404)
})

after(async () => {
  await mongoose.connection.close()
})