import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, likeHandler, deleteHandler }) => {
  const [showDetail, setShowDetail] = useState(false)
  const toggleShowDetail = () => setShowDetail(!showDetail)

  const likeClicked = async () => {
    likeHandler({
      id: blog.id,
      user: blog.user,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    })
  }

  const deleteBlog = () => {
    deleteHandler(blog.id)
  }

  const style = {
    margin: 0
  }

  const fullInfo = () => {
    return (
      <div>
        <p style={style}>
          {blog.title} {blog.author} <button id="hide" onClick={toggleShowDetail}>hide</button>
        </p>
        <p style={style}>{blog.url}<br/></p>
        <p style={style}>likes {blog.likes} <button id="like" onClick={likeClicked}>like</button></p>
        <p style={style}>{blog.user.name}</p>
        {
          user.username === blog.user.username &&
            <p style={style}><button id="blog-delete-btn" onClick={deleteBlog}>remove</button></p>
        }
      </div>
    )
  }

  const baseInfo = () => {
    return (
      <div className='blogPreview'>
        {blog.title} {blog.author} <button id="blog-view-btn" onClick={toggleShowDetail}>view</button>
      </div>
    )
  }

  return (
    <div className="blog">
      { showDetail ? fullInfo() : baseInfo() }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  likeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired
}

export default Blog
