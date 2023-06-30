import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'

import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'

const App = () => {
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs.toSorted((a, b) => b.likes - a.likes))
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const createNewBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      blog.user = { name: user.name }

      blogFormRef.current.toggleVisibility()
      setSuccessMessage(`Blog '${blog.title}' by ${blog.author} successfully added`)
      setBlogs(blogs.concat(blog))

    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.error)
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const likeBlog = async (newBlog) => {
    try {
      const response = await blogService.update(newBlog.id, newBlog)
      setBlogs(blogs.map(blog => {
        if (blog.id === response.id) {
          blog.likes = response.likes
          return blog
        } else {
          return blog
        }
      }))

    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.error)
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    if (window.confirm('Do you really want to delete this blog?')) {
      try {
        blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id ))

      } catch (error) {
        console.log(error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => { setErrorMessage(null) }, 5000)
      }
    }
  }

  const logoutUser = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const blogDisplay = () => {
    return (
      <div>
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in <button onClick={logoutUser}>logout</button></p>
        </div>
        <div>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createNewBlog={createNewBlog}/>
          </Togglable>

          <BlogList blogs={blogs} user={user} likeBlog={likeBlog} deleteBlog={deleteBlog}/>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <Notification message={successMessage} type='success'/>
        <Notification message={errorMessage} type='error'/>
      </div>
      <div>
        { user ? blogDisplay() : <LoginForm setUser={setUser}/> }
      </div>
    </div>
  )
}

export default App
