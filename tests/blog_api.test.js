const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const ObjectId = require('mongodb')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [ 
    { 
        _id: "5a422a851b54a676234d17f7", 
        title: "React patterns", 
        author: "Michael Chan", 
        url: "https://reactpatterns.com/", 
        likes: 7, 
        __v: 0,
    }, 
    { 
        _id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5, 
        __v: 0,
    }
]

var loggedInToken = ''

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salis', 10)
    const newUser = new User({
        username: 'testi',
        _id: "5e0af1c63b6482125c1b42cb",
        passwordHash
    })

    await newUser.save()
  
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
  
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()

    const response = await api
        .post('/api/login')
        .send({
          username: 'testi',
          password: 'salis'
        })

    loggedInToken = response.body.token
})

test('blogs are successfully returned in json form', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the correct amount of blogs is returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is returned among the blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(resp => resp.title)

    expect(titles).toContain('Go To Statement Considered Harmful')
})

test('identifying field of returned blogs is called id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('returned blogs do not have field _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0]._id).toBeUndefined()
})

test('a valid blog can be added as json', async () => {
    const newBlog = { 
        _id: "5a422bc61b54a676234d17fc", 
        title: "Type wars", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 2, 
        __v: 0 
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${loggedInToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('if blog is added number of blogs goes up by one', async () => {
    const newBlog = { 
        _id: "5a422bc61b54a676234d17fc", 
        title: "Type wars", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 2, 
        __v: 0 
    }

    await api.post('/api/blogs').set('Authorization', `bearer ${loggedInToken}`).send(newBlog)
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('added blog can be found from the database with correct content', async () => {
    const newBlog = { 
        _id: "5a422bc61b54a676234d17fc", 
        title: "Type wars", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 2, 
        __v: 0 
    }

    await api.post('/api/blogs').send(newBlog).set('Authorization', `bearer ${loggedInToken}`)
    const response = await api.get('/api/blogs')

    const expectedBlog = { 
        id: "5a422bc61b54a676234d17fc", 
        title: "Type wars", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 2
    }

    expect(response.body).toContainEqual(expectedBlog)
})

test('if no value is given for likes, value is set to zero', async () => {
    const newBlog = { 
        _id: "5a422bc61b54a676234d17fc", 
        title: "Type wars", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        __v: 0 
    }

    await api.post('/api/blogs').set('Authorization', `bearer ${loggedInToken}`).send(newBlog)
    const response = await api.get('/api/blogs')

    const expectedBlog = { 
        id: "5a422bc61b54a676234d17fc", 
        title: "Type wars", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 0
    }

    expect(response.body).toContainEqual(expectedBlog)
})

test('if blog to add has no title response is 400 bad request', async () => {
    const newBlog = { 
        _id: "5a422bc61b54a676234d17fc",
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 2,
        __v: 0 
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInToken}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('if blog to add has no url response is 400 bad request', async () => {
    const newBlog = { 
        _id: "5a422bc61b54a676234d17fc", 
        title: "Type wars",
        author: "Robert C. Martin", 
        likes: 2,
        __v: 0 
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInToken}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('can delete a blog with status 204 if id and token are valid', async () => {
    await Blog.deleteMany()

    const blogs = [{ 
        _id: "5a422a851b54a676234d17f7", 
        title: "React patterns", 
        author: "Michael Chan", 
        url: "https://reactpatterns.com/", 
        likes: 7, 
        __v: 0,
        user: "5e0af1c63b6482125c1b42cb"
    }, 
    { 
        _id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5, 
        __v: 0,
        user: "5e0af1c63b6482125c1b42cb"
    }]

    let blogObject = new Blog(blogs[0])
    await blogObject.save()
  
    blogObject = new Blog(blogs[1])
    await blogObject.save()
    
    const blogToDelete = { 
        id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5 
    }

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${loggedInToken}`)
        .expect(204)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length - 1)

    const ids = response.body.map(blog => blog.id)

    expect(ids).not.toContain(blogToDelete.id)
})

test('cannot delete a blog with missing token and responds with 401', async () => {
    await Blog.deleteMany()

    const blogs = [{ 
        _id: "5a422a851b54a676234d17f7", 
        title: "React patterns", 
        author: "Michael Chan", 
        url: "https://reactpatterns.com/", 
        likes: 7, 
        __v: 0,
        user: "5e0af1c63b6482125c1b42cb"
    }, 
    { 
        _id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5, 
        __v: 0,
        user: "5e0af1c63b6482125c1b42cb"
    }]

    let blogObject = new Blog(blogs[0])
    await blogObject.save()
  
    blogObject = new Blog(blogs[1])
    await blogObject.save()
    
    const blogToDelete = { 
        id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5 
    }

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)

    const ids = response.body.map(blog => blog.id)

    expect(ids).toContain(blogToDelete.id)
})

test('cannot delete a blog with invalid token and responds with 401', async () => {
    await Blog.deleteMany()

    const blogs = [{ 
        _id: "5a422a851b54a676234d17f7", 
        title: "React patterns", 
        author: "Michael Chan", 
        url: "https://reactpatterns.com/", 
        likes: 7, 
        __v: 0,
        user: "5e0af1c63b6482125c1b42cb"
    }, 
    { 
        _id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5, 
        __v: 0,
        user: "5e0af1c63b6482125c1b42cb"
    }]

    const passwordHash = await bcrypt.hash('salis', 10)
    const newUser = new User({
        username: 'testi2',
        _id: "5e0af1c63b6482125c1b42cc",
        passwordHash
    })

    await newUser.save()
  
    let blogObject = new Blog(blogs[0])
    await blogObject.save()
  
    blogObject = new Blog(blogs[1])
    await blogObject.save()

    const res = await api
        .post('/api/login')
        .send({
          username: 'testi2',
          password: 'salis'
        })

    const token = res.body.token
    
    const blogToDelete = { 
        id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5 
    }

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(401)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)

    const ids = response.body.map(blog => blog.id)

    expect(ids).toContain(blogToDelete.id)
})

test('changes to edited blog with valid id are saved with status 200', async () => {
    const blogToUpdate = { 
        id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5 
    }

    const updatedBlog = { 
        id: "5a422aa71b54a676234d17f8",
        title: "Edited blog title", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 10
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
    
    const response = await api.get('/api/blogs')

    expect(response.body).toContainEqual(updatedBlog)
})

test('amount of blogs does not change when one is edited', async () => {
    const blogToUpdate = { 
        id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5 
    }

    const updatedBlog = { 
        id: "5a422aa71b54a676234d17f8",
        title: "Edited blog title", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 10
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('when blog is edited, old version no longer exists', async () => {
    const blogToUpdate = { 
        id: "5a422aa71b54a676234d17f8", 
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5 
    }

    const updatedBlog = { 
        id: "5a422aa71b54a676234d17f8",
        title: "Edited blog title", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 10
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
    
    const response = await api.get('/api/blogs')

    expect(response.body).not.toContainEqual(blogToUpdate)
})

test('cannot add blog without token and status code 401 is returned', async () => {
    const newBlog = { 
        _id: "5a422bc61b54a676234d17fc",
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 2,
        __v: 0 
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})