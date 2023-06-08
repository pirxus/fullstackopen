const Blog = require('../models/blog')

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'willremovethissoon',
    author: 'asdf',
    url: 'sdf'
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  nonExistingId, blogsInDB
}
