const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salis', 10)
    const user = new User({
        username: 'testi',
        passwordHash
    })

    await user.save()
})

test('can create a user with unique username and valid password', async () => {
    const initialUsers = await api.get('/api/users')
    
    const newUser = {
        username: 'kayttaja',
        name: 'Testi Kayttaja',
        password: 'salasana'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const updatedUsers = await api.get('/api/users')
    expect(updatedUsers.body).toHaveLength(initialUsers.body.length + 1)

    const usernames = updatedUsers.body.map(user => user.username)
    expect(usernames).toContain(newUser.username)
})

test('cannot create user with invalid password and response is status 400', async () => {
    const initialUsers = await api.get('/api/users')
    
    const newUser = {
        username: 'kayttaja',
        name: 'Testi Kayttaja',
        password: '1'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const updatedUsers = await api.get('/api/users')
    expect(updatedUsers.body).toHaveLength(initialUsers.body.length)
    
    const usernames = updatedUsers.body.map(user => user.username)
    expect(usernames).not.toContain(newUser.username)
})

test('cannot create user with existing username and response is status 400', async () => {
    const initialUsers = await api.get('/api/users')
    
    const newUser = {
        username: 'testi',
        name: 'Testi Kayttaja',
        password: '1234'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const updatedUsers = await api.get('/api/users')
    expect(updatedUsers.body).toHaveLength(initialUsers.body.length)
})

test('cannot create user with short username and response is status 400', async () => {
    const initialUsers = await api.get('/api/users')
    
    const newUser = {
        username: 'te',
        name: 'Testi Kayttaja',
        password: '1234'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const updatedUsers = await api.get('/api/users')
    expect(updatedUsers.body).toHaveLength(initialUsers.body.length)

    const usernames = updatedUsers.body.map(user => user.username)
    expect(usernames).not.toContain(newUser.username)
})

test('error message is correct with invalid password', async () => {
    const newUser = {
        username: 'kayttaja',
        name: 'Testi Kayttaja',
        password: '1'
    }

    const errorResult = await api
        .post('/api/users')
        .send(newUser)

    expect(errorResult.body.error).toContain('password must be at least 3 characters')
})

test('error message is correct with taken username', async () => {
    const newUser = {
        username: 'testi',
        name: 'Testi Kayttaja',
        password: '1234'
    }

    const errorResult = await api
        .post('/api/users')
        .send(newUser)

    expect(errorResult.body.error).toContain('expected `username` to be unique')
})

test('error message is correct with too short a username', async () => {
    const newUser = {
        username: 'te',
        name: 'Testi Kayttaja',
        password: '1234'
    }

    const errorResult = await api
        .post('/api/users')
        .send(newUser)

    expect(errorResult.body.error).toContain('Path `username` (`te`) is shorter than the minimum allowed length')
})

afterAll(() => {
    mongoose.connection.close()
})