const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

const initialUsers = [
    {
        "username": "TeemuTTK",
        "name": "Teemu Teekkari",
        "password": "TTK112"
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
})

test('username validation works', async () => {
    
    const user = {
        name: "Tuukka",
        password: "1234567"
    }

    let result = await api
                            .post('/api/users')
                            .send(user)
                            .expect(400)

    assert.strictEqual(result.body.error, 'username required')

    user.username = "12"

    result = await api
        .post('/api/users')
        .send(user)
        .expect(400)

    assert.strictEqual(result.body.error, 'username shorter than 3')
    
    user.username = "TeemuTTK"

    result = await api
        .post('/api/users')
        .send(user)
        .expect(400)

    assert.strictEqual(result.body.error, 'expected `username` to be unique')

})

test('password validation works', async () => {
    
    const user = {
        username: "TuukkaTTK",
        name: "Tuukka",
    }

    let result = await api
                            .post('/api/users')
                            .send(user)
                            .expect(400)

    assert.strictEqual(result.body.error, 'password required')

    user.password = "12"

    result = await api
        .post('/api/users')
        .send(user)
        .expect(400)

    assert.strictEqual(result.body.error, 'password shorter than 3')
})

test('user added succesfully', async () => {

    const response = await api.get('/api/users')
    const initialDbUsers = response.body
    
    const user = {
        username: "TuukkaTTK",
        name: "Tuukka",
        password: "1234567"
    }

    await api
            .post('/api/users')
            .send(user)
            .expect(201)

    const response2 = await api.get('/api/users')
    const currentDbUsers = response2.body

    assert.strictEqual(initialDbUsers.length + 1, currentDbUsers.length)
})

after(async () => {
    await mongoose.connection.close()
})