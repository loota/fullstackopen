import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [uiMessage, setUiMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const blogFormRef = useRef()
  const setBlogsSorted = (blogs) => {
    setBlogs(blogs.sort((a, b) => {
      return b.likes - a.likes
    }))
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogsSorted(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)

      blogService.setToken(user.token)
    }
  }, [])

  const triggerUiMessage = (msg) => {
    setUiMessage(msg)
    setTimeout(() => {
      setUiMessage(null)
    }, 5000)
  }

  const triggerErrorMessage = (msg) => {
    setErrorMessage(msg)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user)

      setUsername('')
      setPassword('')
    } catch (exception) {
      triggerErrorMessage('wrong username or password')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem(
      'loggedBlogAppUser'
    )
  }

  const handleCreateBlog = async (blogObject) => {
    const { title, author, url } = blogObject
    const newBlog = await blogService.create(title, author, url)
    setBlogsSorted(blogs.concat(newBlog))
    triggerUiMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    blogFormRef.current.toggleVisibility()
  }

  const handleAddLike = async (blog) => {
    const { id, title, author, url, likes, user } = blog
    const userId = user ? user.id : null
    const modifiedBlog = await blogService.modify(id, title, author, url, likes + 1, userId)
    setBlogsSorted(blogs.map(blog => blog.id !== id ? blog : modifiedBlog))

    triggerUiMessage(`${modifiedBlog.title} by ${modifiedBlog.author} liked`)
  }

  const handleDeleteBlog = async (blogToDelete) => {
    await blogService.deleteBlog(blogToDelete)
    setBlogsSorted(blogs.filter(blog => blog.id !== blogToDelete.id))
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  return (
    <div>
      {
        uiMessage &&
        <div className="uiMessage">
          {uiMessage}
        </div>
      }
      {
        errorMessage &&
        <div className="error">
          {errorMessage}
        </div>
      }

      {!user && loginForm() ||
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={handleCreateBlog} />
          </Togglable>

          <h2>blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleAddLike={handleAddLike} loggedInUser={user} deleteBlog={handleDeleteBlog} />
          )}
        </div>
      }
    </div>
  )
}

export default App