const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (password === undefined) return response.status(400).json({error: 'password required'})
  if (password.length < 3)  return response.status(400).json({error: 'password shorter than 3'})

  if (username === undefined) return response.status(400).json({error: 'username required'})
  if (username.length < 3)  return response.status(400).json({error: 'username shorter than 3'})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    blogs: [],
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch(exception) {
    next(exception)
  }

})

usersRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
        response.json(users)
    } catch(exception) {
        next(exception)
    }
})

module.exports = usersRouter