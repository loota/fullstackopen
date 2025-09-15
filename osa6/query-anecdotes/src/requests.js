import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)  

export const createAnecdote = newAnecdote => {
    return axios.post(baseUrl, newAnecdote)
        .then(res => res.data)
        .catch(error => {
            throw new Error(error.response.data.error)
        })
}

export const addVote = updatedAnecdote =>
    axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)
