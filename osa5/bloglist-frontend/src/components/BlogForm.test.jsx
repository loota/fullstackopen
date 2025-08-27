import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('blog creation handler is called when create-button is clicked', async () => {
  const mockHandler = vi.fn()
  const { container } = render(<BlogForm createBlog={mockHandler} />)
  const user = userEvent.setup()
  const button = screen.getByText('create')
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)
})