const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithMultipleBlogs } = require('./dummy_data')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(listWithMultipleBlogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list is empty, zero likes', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has multiple entries, sum of entry likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(36)
  })
})


describe('favorite blog', () => {

  const best = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
  }

  test('when list is empty, empty object', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toMatchObject({})
  })

  test('when list has one blog, return it', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toMatchObject({ title: listWithOneBlog[0].title, author: listWithOneBlog[0].author, likes: listWithOneBlog[0].likes })
  })

  test('when list has multiple, return the first best', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(result).toMatchObject(best)
  })
})


describe('most blogs', () => {
  const best1 = {
    author: 'Edsger W. Dijkstra',
    blogs: 1
  }

  const best2 = {
    author: "Robert C. Martin",
    blogs: 3
  }

  test('when list has no blog, return empty object', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toMatchObject({})
  })

  test('when list has one blog, return the author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toMatchObject(best1)
  })

  test('when list has multiple blog, return the best author', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toMatchObject(best2)
  })

})

describe('most likes', () => {
  const best1 = {
    author: 'Edsger W. Dijkstra',
    likes: 5
  }

  const best2 = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }

  test('when list has no blog, return empty object', () => {
    const result = listHelper.mostLikes([])
    expect(result).toMatchObject({})
  })

  test('when list has one blog, return the author', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toMatchObject(best1)
  })

  test('when list has multiple blog, return the author with most likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toMatchObject(best2)
  })
})
