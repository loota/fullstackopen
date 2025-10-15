import PropTypes from 'prop-types'
import { useMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
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
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <ListItemAvatar>
              <Avatar>
                <ArticleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>{blog.title}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default User
