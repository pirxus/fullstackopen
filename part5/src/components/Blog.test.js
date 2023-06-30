import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Not a blog',
    author: 'John Doe',
    url: 'google.com',
    likes: 2
  }

  const { container } = render(<Blog user={{ id: 42 }} blog={blog} likeHandler={() => {}} deleteHandler={() => {}}ca/>)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Not a blog')
  expect(div).toHaveTextContent('John Doe')
  expect(div).not.toHaveTextContent('google.com')
  expect(div).not.toHaveTextContent('2')
})

test('test url and likes visibility after clicking view', async () => {
  const blog = {
    title: 'Not a blog',
    author: 'John Doe',
    url: 'google.com',
    likes: 2,
    user: {
      username: 'pirx'
    }
  }

  const blogUser = {
    id: 42,
    name: 'xd',
    username: 'pirxus'
  }

  const { container } = render(<Blog user={blogUser} blog={blog} likeHandler={() => {}} deleteHandler={() => {}}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Not a blog')
  expect(div).toHaveTextContent('John Doe')
  expect(div).toHaveTextContent('google.com')
  expect(div).toHaveTextContent('2')
})

test('test that clicking like twice will call the likeHandler twice', async () => {
  const blog = {
    title: 'Not a blog',
    author: 'John Doe',
    url: 'google.com',
    likes: 2,
    user: {
      username: 'pirx'
    }
  }

  const blogUser = {
    id: 42,
    name: 'xd',
    username: 'pirxus'
  }

  const mockHandler = jest.fn()

  const { container } = render(<Blog user={blogUser} blog={blog} likeHandler={mockHandler} deleteHandler={() => {}}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Not a blog')
  expect(div).toHaveTextContent('John Doe')
  expect(div).toHaveTextContent('google.com')
  expect(div).toHaveTextContent('2')

  expect(mockHandler.mock.calls).toHaveLength(2)
})
