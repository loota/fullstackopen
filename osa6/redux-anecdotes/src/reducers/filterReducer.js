import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: ''
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChange: (state, action) => {
      state.text = action.payload 
    }
  }
})
export const { filterChange } = filterSlice.actions
export default filterSlice.reducer