import PropTypes from 'prop-types'
import { useMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const users = useSelector(({ users }) => users)
  const match = useMatch('/users/:id')
  const user = match ? users.find((user) => user.id === match.params.id) : null

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default User
