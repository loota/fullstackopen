import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import loginService from '../services/login.js'
import blogService from '../services/blogs.js'
import { setUser } from '../reducers/userReducer.js'
import { setErrorNotification } from '../reducers/notificationReducer.js'
import { TextField, Button, Box } from '@mui/material'

export const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedInBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)

      dispatch(setUser(user))

      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      dispatch(setErrorNotification('wrong username or password', 5))
    }
  }
  return (
    <form onSubmit={handleLogin}>
      <Box>
        <Box sx={{ pt: 2, pb: 2 }}>
          username
          <TextField
            sx={{ pl: 2 }}
            type="text"
            value={username}
            name="Username"
            data-testid="username"
            onChange={({ target }) => setUsername(target.value)}
          />{' '}
        </Box>
        <Box sx={{ pt: 2, pb: 2 }}>
          {' '}
          password
          <TextField
            sx={{ pl: 2 }}
            type="password"
            value={password}
            name="Password"
            data-testid="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </Box>
    </form>
  )
}
