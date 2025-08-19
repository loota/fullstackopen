import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', async () => {
  const blog = {
    title: 'Malices Adventures In The Wonderland',
    author: 'Eduardo Griega',
    url: 'http://example.com/liiperilaaperi',
    likes: 10,
    user: {
      name: 'Porkkis'
    }
  }

  const { container } = render(<Blog blog={blog} handleAddLike={() => {}} loggedInUser={{}} deleteBlog={() => {}} />)

  const element = screen.getByText(
    'Malices Adventures In The Wonderland', { exact: false }
  )
  expect(element).toHaveTextContent('Malices Adventures In The Wonderland')
  expect(element).toHaveTextContent('Eduardo Griega')
  expect(element).not.toHaveTextContent('likes')
  expect(element).not.toHaveTextContent('10')
  expect(element).not.toHaveTextContent('http://example.com/liiperilaaperi')
  expect(element).not.toHaveTextContent('Porkkis')
})

test('renders all content when the view button is clicked', async () => {
  const blog = {
    title: 'Malices Adventures In The Wonderland',
    author: 'Eduardo Griega',
    url: 'http://example.com/liiperilaaperi',
    likes: 10,
    user: {
      name: 'Porkkis'
    }
  }

  const { container } = render(<Blog blog={blog} handleAddLike={() => {}} loggedInUser={{}} deleteBlog={() => {}} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(container).toHaveTextContent('likes')
  expect(container).toHaveTextContent('10')
  expect(container).toHaveTextContent('http://example.com/liiperilaaperi')
  expect(container).toHaveTextContent('Porkkis')
})

test('like handler function is called twice if like is clicked twice', async () => {
  const blog = {
    title: 'Malices Adventures In The Wonderland',
    author: 'Eduardo Griega',
    url: 'http://example.com/liiperilaaperi',
    likes: 10,
    user: {
      name: 'Porkkis'
    }
  }

  const mockHandler = vi.fn()
  const { container } = render(<Blog blog={blog} handleAddLike={mockHandler} loggedInUser={{}} deleteBlog={() => {}} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})