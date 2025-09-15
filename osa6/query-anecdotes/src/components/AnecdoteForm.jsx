import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests.js'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient =  useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notificationDispatch({type: "MESSAGE", payload: `anecdote created ${newAnecdote.content}`})
      setTimeout(() => {
        notificationDispatch({type: "MESSAGE", payload: ''})
      }, 5000)
    },
    onError: (error) => {
      notificationDispatch({type: "MESSAGE", payload: error.message})
      setTimeout(() => {
        notificationDispatch({type: "MESSAGE", payload: ''})
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
