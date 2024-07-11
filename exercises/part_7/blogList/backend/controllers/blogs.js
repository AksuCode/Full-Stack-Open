const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware');
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
        response.json(blogs)
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    try {

        const blogObj = request.body

        if (!Object.keys(blogObj).includes('title')) {response.status(400).end(); return}

        if (!Object.keys(blogObj).includes('url')) {response.status(400).end(); return}

        if (!Object.keys(blogObj).includes('likes')) blogObj.likes = 0

        const user = request.user

        const blog = new Blog({
            title: blogObj.title,
            author: blogObj.author,
            user: user.id,
            url: blogObj.url,
            likes: blogObj.likes
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)

    } catch(exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        const user = request.user

        const blog = await Blog.findById(request.params.id)

        if (blog.user.toString() !== user.id.toString()) {
            return response.status(401).json({ error: 'invalid user' })
        }
        
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        const result = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        response.status(200).json(result)
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogsRouter