const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    if (!request.token) {
        return response.status(401).json({ error: 'Token is missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'Token is missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        ...body,
        likes: body.likes === undefined ? 0 : body.likes
    })

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    if (!request.token) {
        return response.status(401).json({ error: 'Token is missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'Token is missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (!user.id || user.id.toString() !== blog.user.toString()) {
        return response.status(401).json({ error: 'Token is missing or invalid' })
    }
    
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
        title: body.title,
        author:body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
        response.json(updated.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter