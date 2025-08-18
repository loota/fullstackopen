const supertest = require('supertest')
const { describe, test, beforeEach, after } = require('node:test')
const app = require('../app')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const mongoose = require('mongoose')
const assert = require('node:assert')

const api = supertest(app)

let userId = null

const login = async () => {
  const loginResponse = await api
    .post('/api/login/')
    .send({
      username: 'akro',
      password: 'puuppa'
    })

  return loginResponse.body.token
}

describe('when using the blogs api', () => {
  beforeEach(async() => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const newUser = {
      username: 'akro',
      name: 'Esko Morko',
      password: 'puuppa',
      blogs: []
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    userId = response.body.id

    const newBlog = {
      author: 'Steve Murgler',
      title: 'Initial blog',
      url: 'www.example.com/blog',
      likes: 2,
      user: userId
    }

    const token = await login()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.ok(response.body[0].id)
  })

  test('a new blog can be added', async () => {
    const newBlog = {
      author: 'Steve Murgler',
      title: 'Fabulous article',
      url: 'www.example.com/',
      likes: 3,
      user: userId
    }

    const token = await login()

    const blogsAtStart = await Blog.find({})

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + token)
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

    const token = await login()

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
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

    const token = await login()

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)

  })

  test('a new blog with no url will not get saved', async () => {
    const newBlogWithoutUrl = {
      author: 'Steve Murgler',
      title: 'Amazing article',
      likes: 1
    }

    const token = await login()

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
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

    const token = await login()

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await Blog.find({})
    const titlesAtStart = blogsAtStart.map(n => n.title)
    assert(titlesAtStart.includes(newBlog.title))

    await api
      .delete('/api/blogs/' + response.body.id)
      .set('Authorization', 'Bearer ' + token)
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
      likes: 1,
      user: userId
    }

    const token = await login()

    const newBlogResponse = await api
      .post('/api/blogs/')
      .set('Authorization', 'Bearer ' + token)
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
    newBlog.user = {
      username: 'akro',
      name: 'Esko Morko',
      id: userId
    }
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

  test('adding a blog fails if not logged in', async () => {
    const newBlog = {
      author: 'Steve Murgler',
      title: 'Amazing test article',
      url: 'www.example.com/amazing',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('deleting a blog fails if logged in as another user', async () => {
    const newBlog = {
      author: 'Steve Murgler',
      title: 'Fabulous article',
      url: 'www.example.com/',
      likes: 3,
      user: userId
    }

    const token = await login()

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogId = postResponse.body.id

    const evilUser = {
      username: 'evil',
      name: 'Malicious',
      password: 'maliciousdelicious',
      blogs: []
    }

    await api
      .post('/api/users')
      .send(evilUser)
      .expect(201)

    const loginResponse = await api
      .post('/api/login/')
      .send({
        username: 'evil',
        password: 'maliciousdelicious'
      })

    const evilToken = loginResponse.body.token

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', 'Bearer ' + evilToken)
      .send(newBlog)
      .expect(401)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
