const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes , 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((best, blog) => {
    if (best.likes === undefined || blog.likes > best.likes ) {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      }

    } else {
      return best
    }

  }, {})
}

const mostBlogs = blogs => {
  const result = lodash.countBy(blogs, 'author')

  return Object.entries(result).reduce((best, item) => {
    if (best.blogs === undefined || item[1] > best.blogs) {
      return { author: item[0], blogs: item[1] }
    } else {
      return best
    }
  }, {})
}

const mostLikes = blogs => {
  const authorLikes= Object.entries(lodash.groupBy(blogs, 'author')).map(entry => {
    const [ author, data ] = entry
    return { author: author, likes: data.reduce((sum, item) => sum + item.likes, 0)}
  })

  return authorLikes.reduce((best, item) => {
    if (best.likes === undefined || item.likes > best.likes) {
      return item
    } else {
      return best
    }
  }, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
