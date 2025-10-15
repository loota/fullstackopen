import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMatch } from 'react-router-dom'
import blogService from '../services/blogs'
import { setBlogs } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import { List, ListItem, Divider, Button } from '@mui/material'

const Blog = () => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const loggedInUser = useSelector(({ user }) => user)

  const blogs = useSelector(({ blogs }) => blogs)
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (!blog) {
    return <div>loading...</div>
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLike = () => {
    handleAddLike(blog)
  }

  const handleAddLike = async (blog) => {
    const { id, title, author, url, likes, user } = blog
    const userId = user ? user.id : null
    const modifiedBlog = await blogService.modify(
      id,
      title,
      author,
      url,
      likes + 1,
      userId
    )
    dispatch(
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : modifiedBlog)))
    )
    dispatch(
      setNotification(
        `${modifiedBlog.title} by ${modifiedBlog.author} liked`,
        5
      )
    )
  }

  const handleDeleteBlog = async (blogToDelete) => {
    await blogService.deleteBlog(blogToDelete)
    dispatch(setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id)))
  }

  let canDelete = false
  if (typeof blog.user !== 'undefined') {
    canDelete =
      typeof loggedInUser !== 'undefined' &&
      typeof blog.id !== 'undefined' &&
      typeof loggedInUser.id !== 'undefined' &&
      typeof blog.user !== 'undefined' &&
      blog.user !== null &&
      typeof blog.user.id !== 'undefined' &&
      blog.user.id === loggedInUser.id
  }

  const deleteThisBlog = () => {
    if (window.confirm('Remove blog ' + blog.title + ' by ' + blog.author)) {
      handleDeleteBlog(blog)
    }
  }
  const Comment = ({ content }) => {
    return <ListItem>{content}</ListItem>
  }
  const handleComment = async (blogId) => {
    const modifiedBlog = await blogService.addComment(blogId, comment)
    dispatch(
      setBlogs(blogs.map((blog) => (blog.id !== blogId ? blog : modifiedBlog)))
    )
    dispatch(setNotification(`comment added: ${comment}`, 5))
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        <h2>
          {blog.title} {blog.author}
        </h2>
        <div>
          <a href={blog.url}>{blog.url}</a>
          <p>
            <span className="likes">{blog.likes}</span> <span>likes</span>
          </p>
          <Button variant="contained" color="primary" onClick={addLike}>
            like
          </Button>
          <p>added by {blog.user ? blog.user.name : ''}</p>
          {canDelete && (
            <Button
              variant="contained"
              color="primary"
              onClick={deleteThisBlog}
            >
              Remove
            </Button>
          )}
          <Divider />
          <h3>comments</h3>
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleComment(blog.id)}
          >
            add comment
          </Button>
          {blog.comments.length > 0 && (
            <>
              <List>
                {blog.comments.map((comment, index) => (
                  <Comment key={index} content={comment} />
                ))}
              </List>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
