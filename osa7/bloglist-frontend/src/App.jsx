import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import { LoginForm } from './components/LoginForm'
import { initializeBlogs, setBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import Users from './components/Users'
import User from './components/User'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { Button, Container, Toolbar, AppBar, Alert } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))

      blogService.setToken(user.token)
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loggedInUser = useSelector(({ user }) => user)

  const uiMessage = useSelector(({ notification }) => notification.message)

  const errorMessage = useSelector(
    ({ notification }) => notification.errorMessage
  )

  const handleLogout = () => {
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedInBlogAppUser')
  }

  return (
    <Container>
      <h1>blogs</h1>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          {loggedInUser ? (
            <div>
              <em>{loggedInUser.name} logged in</em>
              <Button onClick={handleLogout} color="inherit" to="/">
                logout
              </Button>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {uiMessage && <Alert severity="success">{uiMessage}</Alert>}

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Routes>
        <Route path="/" element={<Blogs />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route
          path="/users"
          element={loggedInUser ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/users/:id" element={<User />}></Route>
        <Route path="/blogs/:id" element={<Blog />}></Route>
      </Routes>
    </Container>
  )
}

export default App
