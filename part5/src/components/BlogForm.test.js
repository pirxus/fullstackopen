import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('test that form has handler receives correct data after submitting', async () => {
  const blog = {
    title: 'Not a blog',
    author: 'John Doe',
    url: 'google.com'
  }

  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createNewBlog={createBlog}/>)

  const titleInput = container.querySelector('input[name="Title"]')
  const authorInput = container.querySelector('input[name="Author"]')
  const urlInput = container.querySelector('input[name="URL"]')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)

  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Not a blog')
  expect(createBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(createBlog.mock.calls[0][0].url).toBe('google.com')
})
