import { createSlice } from '@reduxjs/toolkit'
import  blogsService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs (state, action) {
        const blogs = action.payload.slice()
        blogs.concat(action.payload)
        blogs.sort((a, b) => {
            return b.likes - a.likes
        })
        return blogs
      },
  }
})

export const { setBlogs } = blogsSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogsService
            .getAll()
        dispatch(setBlogs(blogs))
    }
}

export default blogsSlice.reducer