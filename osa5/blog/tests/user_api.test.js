const supertest = require('supertest')
const { test, describe, beforeEach, after } = require('node:test')
const app = require('../app')
const User = require('../models/user.js')
const mongoose = require('mongoose')
const assert = require('node:assert')

const api = supertest(app)

describe('users api', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a new user will get saved', async () => {
    const newUser = {
      username: 'akro',
      name: 'Esko Morko',
      password: 'puuppa'
    }

    const usersAtStart = await User.find({})

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEndFromApi = await api
      .get('/api/users')
      .expect(200)

    const usernames = usersAtEndFromApi.body.map(e => e.username)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    assert.strictEqual(usersAtEndFromApi.body.length, usersAtStart.length + 1)
    assert(usernames.includes('akro'))
  })

  test('a new user with too short username will not get saved', async () => {
    const newUser = {
      username: 'ak',
      name: 'Esko Morko',
      password: 'puuppa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('a new user with too short password will not get saved', async () => {
    const newUser = {
      username: 'akro',
      name: 'Esko Morko',
      password: 'pu'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})