const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const createHash = async (password) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

const user = {
  username: "teemuteekkari",
  password: "salasana"
}

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()

    await User.deleteMany({})
    const hashedUser = new User ({
      username: user.username,
      passwordHash: await createHash(user.password)
    })
    await (new User(hashedUser)).save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier for blogs is id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => assert(Object.keys(blog).includes('id')))
})

test('adding blog fails when unauthorized', async () => {
  const tmpBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }

  await api
          .post('/api/blogs')
          .send(tmpBlog)
          .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(initialBlogs.length, response.body.length)
})

test('blog post is created succesfully', async () => {
  const tmpBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }

  const res = await api
                      .post('/api/login')
                      .send(user)
                      .expect(200)
  const loginResponse = res.body

  await api
          .post('/api/blogs')
          .send(tmpBlog)
          .set({authorization: `Bearer ${loginResponse.token}`})
          .expect(201)
          .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(initialBlogs.length + 1, response.body.length)
})

test('adding blog missing likes property defaults to zero', async () => {
  const tmpBlog = {
    title: "UNIQUE TITLE FOR TESTING",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
  }

  const res = await api
                      .post('/api/login')
                      .send(user)
                      .expect(200)
  const loginResponse = res.body

  await api
          .post('/api/blogs')
          .send(tmpBlog)
          .set({authorization: `Bearer ${loginResponse.token}`})
          .expect(201)
          .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const dbBlogs = response.body

  const postedBlog = dbBlogs.find((blog) => blog.title === "UNIQUE TITLE FOR TESTING")

  assert(Object.keys(postedBlog).includes('likes'))

  assert.strictEqual(postedBlog.likes, 0)
})

test('adding a blog missing title or url property returns status code 400', async () => {
  let tmpBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }

  const res = await api
                      .post('/api/login')
                      .send(user)
                      .expect(200)
  const loginResponse = res.body

  await api
          .post('/api/blogs')
          .send(tmpBlog)
          .set({authorization: `Bearer ${loginResponse.token}`})
          .expect(400)

  tmpBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    likes: 2
  }

  await api
          .post('/api/blogs')
          .send(tmpBlog)
          .set({authorization: `Bearer ${loginResponse.token}`})
          .expect(400)
      
  tmpBlog = {
    author: "Robert C. Martin",
    likes: 2
  }

  await api
          .post('/api/blogs')
          .send(tmpBlog)
          .set({authorization: `Bearer ${loginResponse.token}`})
          .expect(400)

})

test('deleting blog resource succesfully', async () => { 

  const initialDbBlogs = (await api.get('/api/blogs')).body

  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }

  const res = await api
                      .post('/api/login')
                      .send(user)
                      .expect(200)
  const loginResponse = res.body

  await api
          .post('/api/blogs')
          .send(newBlog)
          .set({authorization: `Bearer ${loginResponse.token}`})
          .expect(201)
          .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(initialBlogs.length + 1, response.body.length)

  const blogToDelete = response.body[initialBlogs.length]

  await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set({authorization: `Bearer ${loginResponse.token}`})
          .expect(204)

  const currentDbBlogs = (await api.get('/api/blogs')).body

  assert(!currentDbBlogs.includes(blogToDelete))

  assert.strictEqual(initialDbBlogs.length, currentDbBlogs.length)

})

test('updating blog resource', async () => { 

  const initialDbBlogs = (await api.get('/api/blogs')).body
  const blogToUpdate = initialDbBlogs[0]

  const newLikes = 1000000

  assert.notStrictEqual(blogToUpdate.likes, newLikes)

  blogToUpdate.likes = newLikes

  await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(blogToUpdate)
          .expect(200)

  const currentDbBlogs = (await api.get('/api/blogs')).body

  const updatedBlog = currentDbBlogs.find((blog) => blog.id === blogToUpdate.id)

  assert(updatedBlog)

  assert.strictEqual(updatedBlog.likes, newLikes)

})

after(async () => {
  await mongoose.connection.close()
})