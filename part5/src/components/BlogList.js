import Blog from './Blog'

const BlogList = ({ blogs, user, likeBlog, deleteBlog }) => {
  return (
    <div id='blog-list'>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          likeHandler={likeBlog}
          deleteHandler={deleteBlog}
        />
      )}
    </div>
  )
}

export default BlogList
