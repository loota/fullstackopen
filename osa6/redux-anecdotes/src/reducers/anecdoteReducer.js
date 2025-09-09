import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)
const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    createAnecdote: (state, action) => {
      return state.concat(
        {
          id: getId(),
          content: action.payload,
          votes: 0
        }
      )
    },
    addVote: (state, action) => {
      const id = action.payload
      const anecdoteToChange = state.find(n => n.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1
      }
      console.log(changedAnecdote.votes)
      const newState = state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      )
      const sortedState = newState.slice().sort((a, b) => {
        if (a.votes < b.votes) {
          return 1
        } else if (a.votes === b.votes) {
          return 0
         } else {
          return -1
         }
      })
      console.log(sortedState)
      
      return sortedState
    }
  }
})
export const { createAnecdote, addVote } = anecdotesSlice.actions
export default anecdotesSlice.reducer