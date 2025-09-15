import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, addVote } from './requests.js'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()
  const anecdoteMutation = useMutation({
    mutationFn: addVote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      console.log(anecdotes)
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    },
  })

  const handleVote = (anecdote) => {
    anecdoteMutation.mutate({content: anecdote.content, id: anecdote.id, votes: anecdote.votes + 1 })
    notificationDispatch({type: "MESSAGE", payload: `anecdote voted ${anecdote.content}`})
    setTimeout(() => {
      notificationDispatch({type: "MESSAGE", payload: ''})
    }, 5000)
  }

  const { data, isPending, error } = useQuery({
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
      retry: 2
    }
  )

  if (isPending) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>anecdote service not available due to problems in the server</span>
  }

  console.log(data)
  
  const anecdotes = data
  
  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
