import { useState } from 'react'
import { Button, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <TextField
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          data-testid="title"
        />
        <br />
        author:
        <TextField
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          data-testid="author"
        />
        <br />
        url:
        <TextField
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          data-testid="url"
        />
      </div>

      <Button variant="contained" color="primary" type="submit">
        create
      </Button>
    </form>
  )
}

export default BlogForm
