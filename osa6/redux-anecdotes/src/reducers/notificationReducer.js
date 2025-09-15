import { createSlice } from '@reduxjs/toolkit'
const initialState = 'jebou'

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        notify: (state, action) => {
            state = action.payload
            console.log('jeba')
            console.log(state)
            return state
        },
        removeNotification: (state) => {
            state = ''
            return state
        }
    }
})

export const { notify, removeNotification } = notificationSlice.actions

export const setNotification = (text, time) => {
  return async dispatch => {
    dispatch(notify(text))
    setTimeout(() => {
        dispatch(removeNotification())
    }, time * 1000)
  }
}

export default notificationSlice.reducer
