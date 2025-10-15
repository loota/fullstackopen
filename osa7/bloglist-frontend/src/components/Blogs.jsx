import { useSelector, useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { useRef } from 'react'
import { setBlogs } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material'

const Blogs = () => {
  const user = useSelector(({ user }) => user)
  const blogs = useSelector(({ blogs }) => blogs)

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const handleCreateBlog = async (blogObject) => {
    const { title, author, url } = blogObject
    const newBlog = await blogService.create(title, author, url)
    dispatch(setBlogs(blogs.concat(newBlog)))
    dispatch(
      setNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        5
      )
    )
    blogFormRef.current.toggleVisibility()
  }

  return (
    <>
      <div>
        <h2>blogs</h2>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title} {blog.author}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}
export default Blogs
