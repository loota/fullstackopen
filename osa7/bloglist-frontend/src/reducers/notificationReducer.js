import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {},
  reducers: {
    notify: (state, action) => {
       state.message = action.payload
       return state
    },
    notifyError: (state, action) => {
       state.errorMessage = action.payload
       return state
    },
    removeNotification: (state, action) => {
        state.message = ''
        return state
    },
    removeErrorNotification: (state, action) => {
      state.errorMessage = ''
      return state
    }
  }
})

const { notify, notifyError, removeNotification, removeErrorNotification } = notificationSlice.actions

export const setNotification = (text, time) => {
  return async (dispatch) => {
    dispatch(notify(text))
    setTimeout(() => {
        dispatch(removeNotification())
    }, time * 1000)
  }
}

export const setErrorNotification = (text, time) => {
  return async (dispatch) => {
    dispatch(notifyError(text))
    setTimeout(() => {
        dispatch(removeErrorNotification())
    }, time * 1000)
  }
}

export default notificationSlice.reducer