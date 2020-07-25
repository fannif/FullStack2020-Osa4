const express = require('express')
const config = require('./utils/config')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to database')
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        logger.info('Connected to database')
    }).catch((error) => {
        logger.error('Encoutered an error connecting to database: ', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app