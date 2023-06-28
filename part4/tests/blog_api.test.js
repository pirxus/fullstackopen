const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper.js')

const initialBlogs = require('./dummy_data').listWithMultipleBlogs.map(blog => {
  delete blog._id
  delete blog.__v
  return blog
})

const getAdminToken = async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'password' })
  return loginResponse.body.token
}


beforeEach(async () => {
  // create an admin user
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  // ensure that each blog has the admin linked via the user attribute
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs.map(blog => {
    blog.user = user.id
    return blog
  }))
})

describe('blog api basic tests', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200) 
      .expect('Content-Type', /application\/json/)
  })

  test('number of fetched blogs is the same as the initial count', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('verify that blog has the property id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })

  test('test that post creates a new blog entry', async () => {

    // first, login the user
    const token = await getAdminToken()

    const blog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('test that post fails with 401 without a token', async () => {

    const blog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
  })
})

describe('blog object properties', () => {

  test('test that post fills missing likes property with zero', async () => {
    // first, login the user
    const token = await getAdminToken()

    const newBlog = {
      title: "How to drink bleach",
      author: "Jon Doe",
      url: "asdasdf"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })

  test('test that missing title returns bad request', async () => {
    const token = await getAdminToken()

    const newBlog = {
      author: "Jon Doe",
      url: "asdfasdf"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)
  })

  test('test that missing url returns bad request', async () => {
    const token = await getAdminToken()

    const newBlog = {
      title: "Sick blog bro",
      author: "Jon Doe",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)
  })
})

describe('deleting blogs', () => {

  test('deleting an existing blog', async () => {
    // first, login the user
    const token = await getAdminToken()

    const initialContents = await helper.blogsInDB()
    const toDelete = initialContents[0]

    await api
      .delete(`/api/blogs/${toDelete.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const blogsAfter = await helper.blogsInDB()
    expect(blogsAfter).toHaveLength(initialContents.length - 1)
  })

  test('deleting a non-existent blog', async () => {
    // first, login the user
    const token = await getAdminToken()

    const invalidId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
  })

})

describe('updating blogs', () => {

  test('updating an existing blog', async () => {
    const initialContents = await helper.blogsInDB()
    const toUpdate = initialContents[0]
    toUpdate.url = 'this is a dummy url'

    await api.put(`/api/blogs/${toUpdate.id}`).send(toUpdate).expect(200)

    const updatedBlogs = await helper.blogsInDB()
    expect(updatedBlogs.map(blog => blog.url)).toContain(toUpdate.url)

  })
  
  test('updating a non-existent blog', async () => {
    const invalidId = await helper.nonExistingId()
    const newBlog = {
      title: "How to drink bleach",
      author: "Jon Doe",
      url: "asdasdf"
    }

    await api.put(`/api/blogs/${invalidId}`).send(newBlog).expect(200)
  })

  test('updating but bad request body', async () => {
    const initialContents = await helper.blogsInDB()
    const toUpdate = initialContents[0]
    toUpdate.url = ''
    await api.put(`/api/blogs/${toUpdate.id}`).send(toUpdate).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
