import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleAddLike, loggedInUser, deleteBlog }) => {
  const [showAllInfo, setShowAllInfo] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const allInfo = { display: showAllInfo ? '' : 'none' }
  const toggleShowAllInfo = () => {
    setShowAllInfo(!showAllInfo)
  }
  const addLike = () => {
    handleAddLike(blog)
  }

  let canDelete = false
  if (typeof blog.user !== 'undefined') {
    canDelete = (typeof loggedInUser !== 'undefined') &&
   (typeof blog.id !== 'undefined') &&
    (typeof loggedInUser.id !== 'undefined') &&
    (typeof blog.user !== 'undefined') && (blog.user !== null) &&
    (typeof blog.user.id !== 'undefined') &&
    (blog.user.id === loggedInUser.id)
  }

  const deleteThisBlog = () => {
    if (window.confirm('Remove blog ' + blog.title + ' by ' + blog.author)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleShowAllInfo}>view</button>
        <div style={allInfo}>
          <p>{blog.url}</p>
          <p>likes {blog.likes}</p><button onClick={addLike}>like</button>
          <p>{blog.user ? blog.user.name : ''}</p>
          {canDelete && <button onClick={deleteThisBlog}>Remove</button>}
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleAddLike: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog